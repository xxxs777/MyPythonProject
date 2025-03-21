import { NextRequest } from 'next/server';
import { Database } from '@/lib/database';

// 获取用户萌宠列表API
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    // 获取数据库实例
    const db = new Database(request.env.DB as any);
    
    // 获取萌宠列表
    const pets = await db.getPets(userId);
    
    return Response.json({ success: true, pets });
    
  } catch (error) {
    console.error('获取萌宠列表失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 添加/更新萌宠API
export async function POST(request: NextRequest) {
  try {
    const { userId, action, petData } = await request.json();
    
    if (!userId || !action) {
      return Response.json({ error: '缺少必要参数' }, { status: 400 });
    }
    
    // 获取数据库实例
    const db = new Database(request.env.DB as any);
    
    // 检查用户是否存在
    const user = await db.getUserById(userId);
    if (!user) {
      return Response.json({ error: '用户不存在' }, { status: 404 });
    }
    
    let result;
    
    switch (action) {
      case 'add':
        // 添加新萌宠
        if (!petData) {
          return Response.json({ error: '缺少萌宠数据' }, { status: 400 });
        }
        
        // 如果是付费萌宠，检查资源是否足够
        if (petData.cost) {
          if (petData.cost.type === 'gold') {
            if (user.gold < petData.cost.amount) {
              return Response.json({ error: '金币不足' }, { status: 400 });
            }
            await db.updateUser(userId, { gold: user.gold - petData.cost.amount });
          } else if (petData.cost.type === 'diamond') {
            if (user.diamond < petData.cost.amount) {
              return Response.json({ error: '钻石不足' }, { status: 400 });
            }
            await db.updateUser(userId, { diamond: user.diamond - petData.cost.amount });
          }
          
          // 记录交易
          await db.addTransaction({
            userId,
            type: 'purchase',
            itemType: 'pet',
            itemId: petData.petId,
            quantity: 1,
            cost: petData.cost,
            createdAt: Date.now()
          });
        }
        
        // 添加萌宠
        const petId = await db.addPet({
          userId,
          petId: petData.petId,
          name: petData.name,
          level: 1,
          exp: 0,
          intimacy: 1,
          skillLevel: 1,
          season: petData.season,
          isDeployed: false,
          accessories: [],
          obtainedAt: Date.now()
        });
        
        result = { petId };
        break;
        
      case 'update':
        // 更新萌宠信息
        if (!petData || !petData.id) {
          return Response.json({ error: '缺少萌宠ID' }, { status: 400 });
        }
        
        // 检查萌宠是否存在
        const pet = await db.getPetById(petData.id);
        if (!pet) {
          return Response.json({ error: '萌宠不存在' }, { status: 404 });
        }
        
        // 检查萌宠是否属于该用户
        if (pet.userId !== userId) {
          return Response.json({ error: '无权操作该萌宠' }, { status: 403 });
        }
        
        // 更新萌宠信息
        await db.updatePet(petData.id, petData);
        
        result = { updated: true };
        break;
        
      case 'deploy':
        // 设置出战萌宠
        if (!petData || !petData.id) {
          return Response.json({ error: '缺少萌宠ID' }, { status: 400 });
        }
        
        // 检查萌宠是否存在
        const deployPet = await db.getPetById(petData.id);
        if (!deployPet) {
          return Response.json({ error: '萌宠不存在' }, { status: 404 });
        }
        
        // 检查萌宠是否属于该用户
        if (deployPet.userId !== userId) {
          return Response.json({ error: '无权操作该萌宠' }, { status: 403 });
        }
        
        // 获取所有萌宠
        const allPets = await db.getPets(userId);
        
        // 取消所有萌宠的出战状态
        for (const p of allPets) {
          if (p.isDeployed) {
            await db.updatePet(p.id, { isDeployed: false });
          }
        }
        
        // 设置新的出战萌宠
        await db.updatePet(petData.id, { isDeployed: true });
        
        result = { deployed: true };
        break;
        
      case 'feed':
        // 喂养萌宠
        if (!petData || !petData.id) {
          return Response.json({ error: '缺少萌宠ID' }, { status: 400 });
        }
        
        // 检查萌宠是否存在
        const feedPet = await db.getPetById(petData.id);
        if (!feedPet) {
          return Response.json({ error: '萌宠不存在' }, { status: 404 });
        }
        
        // 检查萌宠是否属于该用户
        if (feedPet.userId !== userId) {
          return Response.json({ error: '无权操作该萌宠' }, { status: 403 });
        }
        
        // 检查金币是否足够
        const feedCost = 10; // 喂养消耗的金币
        if (user.gold < feedCost) {
          return Response.json({ error: '金币不足' }, { status: 400 });
        }
        
        // 扣除金币
        await db.updateUser(userId, { gold: user.gold - feedCost });
        
        // 增加萌宠经验和亲密度
        const expGain = 10;
        const intimacyGain = 0.1;
        
        let newLevel = feedPet.level;
        let newExp = feedPet.exp + expGain;
        let newIntimacy = Math.min(5, feedPet.intimacy + intimacyGain);
        
        // 检查是否升级
        const expNeeded = feedPet.level * 100;
        if (newExp >= expNeeded) {
          newLevel += 1;
          newExp = 0;
        }
        
        // 更新萌宠信息
        await db.updatePet(petData.id, {
          level: newLevel,
          exp: newExp,
          intimacy: newIntimacy
        });
        
        result = {
          fed: true,
          level: newLevel,
          exp: newExp,
          intimacy: newIntimacy
        };
        break;
        
      default:
        return Response.json({ error: '不支持的操作类型' }, { status: 400 });
    }
    
    // 获取更新后的萌宠列表
    const updatedPets = await db.getPets(userId);
    
    return Response.json({ 
      success: true, 
      result,
      pets: updatedPets
    });
    
  } catch (error) {
    console.error('萌宠操作失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}
