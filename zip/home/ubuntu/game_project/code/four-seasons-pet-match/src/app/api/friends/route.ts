import { NextRequest } from 'next/server';
import { Database } from '@/lib/database';

// 获取好友列表API
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const type = request.nextUrl.searchParams.get('type') || 'friends'; // friends, requests
    
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
    
    let result;
    
    if (type === 'friends') {
      // 获取好友列表
      const friendships = await db.getFriends(userId);
      
      // 获取好友详细信息
      const friendsData = [];
      for (const friendship of friendships) {
        const friendId = friendship.userId === userId ? friendship.friendId : friendship.userId;
        const friend = await db.getUserById(friendId);
        if (friend) {
          friendsData.push({
            id: friend.id,
            username: friend.username,
            avatar: friend.avatar,
            level: friend.level,
            lastLoginAt: friend.lastLoginAt,
            // 获取好友的庄园信息
            garden: await db.getGarden(friendId),
            // 获取好友的萌宠数量
            petsCount: (await db.getPets(friendId)).length
          });
        }
      }
      
      result = { friends: friendsData };
    } else if (type === 'requests') {
      // 获取好友请求列表
      const requests = await db.getFriendRequests(userId);
      
      // 获取请求者详细信息
      const requestsData = [];
      for (const request of requests) {
        const requester = await db.getUserById(request.userId);
        if (requester) {
          requestsData.push({
            id: request.id,
            user: {
              id: requester.id,
              username: requester.username,
              avatar: requester.avatar,
              level: requester.level
            },
            createdAt: request.createdAt
          });
        }
      }
      
      result = { requests: requestsData };
    } else {
      return Response.json({ error: '不支持的类型' }, { status: 400 });
    }
    
    return Response.json({ success: true, ...result });
    
  } catch (error) {
    console.error('获取好友信息失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 好友操作API
export async function POST(request: NextRequest) {
  try {
    const { userId, action, targetId, friendshipId } = await request.json();
    
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
        // 添加好友请求
        if (!targetId) {
          return Response.json({ error: '缺少目标用户ID' }, { status: 400 });
        }
        
        // 检查目标用户是否存在
        const targetUser = await db.getUserById(targetId);
        if (!targetUser) {
          return Response.json({ error: '目标用户不存在' }, { status: 404 });
        }
        
        // 检查是否已经是好友
        const existingFriendships = await db.getFriends(userId);
        const isAlreadyFriend = existingFriendships.some(f => 
          (f.userId === userId && f.friendId === targetId) || 
          (f.userId === targetId && f.friendId === userId)
        );
        
        if (isAlreadyFriend) {
          return Response.json({ error: '已经是好友关系' }, { status: 400 });
        }
        
        // 检查是否已经发送过请求
        const existingRequests = await db.getFriendRequests(targetId);
        const hasExistingRequest = existingRequests.some(r => r.userId === userId);
        
        if (hasExistingRequest) {
          return Response.json({ error: '已经发送过好友请求' }, { status: 400 });
        }
        
        // 添加好友请求
        const requestId = await db.addFriend({
          userId,
          friendId: targetId,
          status: 'pending',
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        
        // 发送消息通知
        await db.addMessage({
          senderId: userId,
          receiverId: targetId,
          type: 'system',
          content: `${user.username} 请求添加您为好友`,
          isRead: false,
          createdAt: Date.now()
        });
        
        result = { requestId };
        break;
        
      case 'accept':
        // 接受好友请求
        if (!friendshipId) {
          return Response.json({ error: '缺少好友请求ID' }, { status: 400 });
        }
        
        // 更新好友关系状态
        await db.updateFriendship(friendshipId, 'accepted');
        
        // 获取请求信息
        const requests = await db.getFriendRequests(userId);
        const acceptedRequest = requests.find(r => r.id === friendshipId);
        
        if (acceptedRequest) {
          // 发送消息通知
          const requester = await db.getUserById(acceptedRequest.userId);
          if (requester) {
            await db.addMessage({
              senderId: userId,
              receiverId: acceptedRequest.userId,
              type: 'system',
              content: `${user.username} 接受了您的好友请求`,
              isRead: false,
              createdAt: Date.now()
            });
          }
        }
        
        result = { accepted: true };
        break;
        
      case 'reject':
        // 拒绝好友请求
        if (!friendshipId) {
          return Response.json({ error: '缺少好友请求ID' }, { status: 400 });
        }
        
        // 删除好友请求
        // 实际实现中可能需要添加删除方法，这里简化处理
        await db.updateFriendship(friendshipId, 'rejected');
        
        result = { rejected: true };
        break;
        
      case 'remove':
        // 删除好友
        if (!targetId) {
          return Response.json({ error: '缺少目标用户ID' }, { status: 400 });
        }
        
        // 获取好友关系
        const friendships = await db.getFriends(userId);
        const friendship = friendships.find(f => 
          (f.userId === userId && f.friendId === targetId) || 
          (f.userId === targetId && f.friendId === userId)
        );
        
        if (!friendship) {
          return Response.json({ error: '好友关系不存在' }, { status: 404 });
        }
        
        // 删除好友关系
        // 实际实现中可能需要添加删除方法，这里简化处理
        await db.updateFriendship(friendship.id, 'removed');
        
        result = { removed: true };
        break;
        
      default:
        return Response.json({ error: '不支持的操作类型' }, { status: 400 });
    }
    
    return Response.json({ success: true, ...result });
    
  } catch (error) {
    console.error('好友操作失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}
