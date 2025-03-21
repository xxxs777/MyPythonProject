import { NextRequest } from 'next/server';
import { Database } from '@/lib/database';

// 获取用户游戏进度API
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    // 获取数据库实例
    const db = new Database(request.env.DB as any);
    
    // 获取游戏进度
    const progress = await db.getGameProgress(userId);
    
    if (!progress) {
      return Response.json({ error: '未找到游戏进度' }, { status: 404 });
    }
    
    return Response.json({ success: true, progress });
    
  } catch (error) {
    console.error('获取游戏进度失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 更新游戏进度API
export async function POST(request: NextRequest) {
  try {
    const { userId, updates } = await request.json();
    
    if (!userId || !updates) {
      return Response.json({ error: '缺少必要参数' }, { status: 400 });
    }
    
    // 获取数据库实例
    const db = new Database(request.env.DB as any);
    
    // 检查用户是否存在
    const user = await db.getUserById(userId);
    if (!user) {
      return Response.json({ error: '用户不存在' }, { status: 404 });
    }
    
    // 更新游戏进度
    await db.updateGameProgress(userId, updates);
    
    // 如果有关卡完成，可能需要更新用户经验和资源
    if (updates.completedLevels && updates.completedLevels.length > 0) {
      // 这里可以添加关卡奖励逻辑
      // 例如：增加用户经验、金币等
    }
    
    // 获取更新后的游戏进度
    const updatedProgress = await db.getGameProgress(userId);
    
    return Response.json({ 
      success: true, 
      progress: updatedProgress 
    });
    
  } catch (error) {
    console.error('更新游戏进度失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}
