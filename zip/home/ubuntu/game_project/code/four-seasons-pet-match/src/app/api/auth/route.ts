import { NextRequest } from 'next/server';
import { Database } from '@/lib/database';
import { User } from '@/lib/models';

// 用户登录/注册API
export async function POST(request: NextRequest) {
  try {
    const { platform, platformId, username, avatar } = await request.json();
    
    // 验证必要参数
    if (!platform || !username) {
      return Response.json({ error: '缺少必要参数' }, { status: 400 });
    }
    
    // 验证平台类型
    if (!['wechat', 'douyin', 'guest'].includes(platform)) {
      return Response.json({ error: '不支持的平台类型' }, { status: 400 });
    }
    
    // 获取数据库实例
    const db = new Database(request.env.DB as any);
    
    // 检查用户是否已存在
    let user: User | null = null;
    
    if (platform !== 'guest' && platformId) {
      user = await db.getUserByPlatformId(platform, platformId);
    }
    
    // 如果用户不存在，创建新用户
    if (!user) {
      // 创建新用户
      user = await db.createUser({
        username,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        platform,
        platformId: platform !== 'guest' ? platformId : undefined,
        level: 1,
        exp: 0,
        gold: 1000, // 初始金币
        diamond: 50, // 初始钻石
        energy: 20, // 初始体力
        maxEnergy: 20,
        lastEnergyRefillTime: Date.now(),
        createdAt: Date.now(),
        lastLoginAt: Date.now()
      });
      
      // 创建初始游戏进度
      await db.createGameProgress({
        userId: user.id,
        currentSeason: 'spring',
        highestLevel: 1,
        levelStars: {},
        completedLevels: [],
        totalScore: 0
      });
      
      // 创建初始庄园
      await db.createGarden({
        userId: user.id,
        level: 1,
        exp: 0,
        season: 'spring'
      });
      
      // 添加初始萌宠（小兔子）
      await db.addPet({
        userId: user.id,
        petId: 'pet_rabbit',
        name: '小兔子',
        level: 1,
        exp: 0,
        intimacy: 1,
        skillLevel: 1,
        season: 'spring',
        isDeployed: true,
        accessories: [],
        obtainedAt: Date.now()
      });
      
    } else {
      // 更新登录时间
      await db.updateUser(user.id, { lastLoginAt: Date.now() });
    }
    
    // 返回用户信息
    return Response.json({ success: true, user });
    
  } catch (error) {
    console.error('用户登录/注册失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}
