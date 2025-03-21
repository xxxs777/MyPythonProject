import { NextRequest } from 'next/server';
import { Database } from '@/lib/database';

// 获取消息列表API
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    // 获取数据库实例
    const db = new Database(request.env.DB as any);
    
    // 检查用户是否存在
    const user = await db.getUserById(userId);
    if (!user) {
      return Response.json({ error: '用户不存在' }, { status: 404 });
    }
    
    // 获取消息列表
    const messages = await db.getMessages(userId);
    
    return Response.json({ success: true, messages });
    
  } catch (error) {
    console.error('获取消息列表失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 消息操作API
export async function POST(request: NextRequest) {
  try {
    const { userId, action, messageId, messageData } = await request.json();
    
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
      case 'send':
        // 发送消息
        if (!messageData || !messageData.receiverId || !messageData.content) {
          return Response.json({ error: '消息数据不完整' }, { status: 400 });
        }
        
        // 检查接收者是否存在
        const receiver = await db.getUserById(messageData.receiverId);
        if (!receiver) {
          return Response.json({ error: '接收者不存在' }, { status: 404 });
        }
        
        // 发送消息
        const msgId = await db.addMessage({
          senderId: userId,
          receiverId: messageData.receiverId,
          type: messageData.type || 'system',
          content: messageData.content,
          isRead: false,
          attachments: messageData.attachments,
          createdAt: Date.now()
        });
        
        result = { messageId: msgId };
        break;
        
      case 'read':
        // 标记消息为已读
        if (!messageId) {
          return Response.json({ error: '缺少消息ID' }, { status: 400 });
        }
        
        // 标记消息为已读
        await db.markMessageAsRead(messageId);
        
        result = { read: true };
        break;
        
      default:
        return Response.json({ error: '不支持的操作类型' }, { status: 400 });
    }
    
    // 获取更新后的消息列表
    const updatedMessages = await db.getMessages(userId);
    
    return Response.json({ 
      success: true, 
      result,
      messages: updatedMessages
    });
    
  } catch (error) {
    console.error('消息操作失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}
