import { NextRequest } from 'next/server';
import { Database } from '@/lib/database';

// 获取用户庄园信息API
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    // 获取数据库实例
    const db = new Database(request.env.DB as any);
    
    // 获取庄园信息
    const garden = await db.getGarden(userId);
    
    if (!garden) {
      return Response.json({ error: '未找到庄园信息' }, { status: 404 });
    }
    
    return Response.json({ success: true, garden });
    
  } catch (error) {
    console.error('获取庄园信息失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 添加/更新庄园物品API
export async function POST(request: NextRequest) {
  try {
    const { userId, item } = await request.json();
    
    if (!userId || !item) {
      return Response.json({ error: '缺少必要参数' }, { status: 400 });
    }
    
    // 获取数据库实例
    const db = new Database(request.env.DB as any);
    
    // 检查用户是否存在
    const user = await db.getUserById(userId);
    if (!user) {
      return Response.json({ error: '用户不存在' }, { status: 404 });
    }
    
    // 添加庄园物品
    const itemId = await db.addGardenItem(userId, {
      ...item,
      purchasedAt: Date.now()
    });
    
    // 如果是付费物品，扣除相应资源
    if (item.cost) {
      if (item.cost.type === 'gold') {
        if (user.gold < item.cost.amount) {
          return Response.json({ error: '金币不足' }, { status: 400 });
        }
        await db.updateUser(userId, { gold: user.gold - item.cost.amount });
      } else if (item.cost.type === 'diamond') {
        if (user.diamond < item.cost.amount) {
          return Response.json({ error: '钻石不足' }, { status: 400 });
        }
        await db.updateUser(userId, { diamond: user.diamond - item.cost.amount });
      }
      
      // 记录交易
      await db.addTransaction({
        userId,
        type: 'purchase',
        itemType: item.type,
        itemId: item.itemId,
        quantity: 1,
        cost: item.cost,
        createdAt: Date.now()
      });
    }
    
    // 获取更新后的庄园信息
    const updatedGarden = await db.getGarden(userId);
    
    return Response.json({ 
      success: true, 
      itemId,
      garden: updatedGarden 
    });
    
  } catch (error) {
    console.error('添加庄园物品失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}
