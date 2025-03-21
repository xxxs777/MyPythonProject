import { NextRequest } from 'next/server';
import { Database } from '@/lib/database';

// 获取用户物品库存API
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    
    if (!userId) {
      return Response.json({ error: '缺少用户ID' }, { status: 400 });
    }
    
    // 获取数据库实例
    const db = new Database(request.env.DB as any);
    
    // 获取物品库存
    const inventory = await db.getInventory(userId);
    
    return Response.json({ success: true, inventory });
    
  } catch (error) {
    console.error('获取物品库存失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}

// 添加/使用物品API
export async function POST(request: NextRequest) {
  try {
    const { userId, action, itemData } = await request.json();
    
    if (!userId || !action || !itemData) {
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
        // 添加物品到库存
        if (!itemData.itemId || !itemData.type || !itemData.quantity) {
          return Response.json({ error: '物品数据不完整' }, { status: 400 });
        }
        
        // 如果是购买物品，检查资源是否足够
        if (itemData.cost) {
          if (itemData.cost.type === 'gold') {
            if (user.gold < itemData.cost.amount) {
              return Response.json({ error: '金币不足' }, { status: 400 });
            }
            await db.updateUser(userId, { gold: user.gold - itemData.cost.amount });
          } else if (itemData.cost.type === 'diamond') {
            if (user.diamond < itemData.cost.amount) {
              return Response.json({ error: '钻石不足' }, { status: 400 });
            }
            await db.updateUser(userId, { diamond: user.diamond - itemData.cost.amount });
          }
          
          // 记录交易
          await db.addTransaction({
            userId,
            type: 'purchase',
            itemType: itemData.type,
            itemId: itemData.itemId,
            quantity: itemData.quantity,
            cost: itemData.cost,
            createdAt: Date.now()
          });
        }
        
        // 添加物品到库存
        const itemId = await db.addInventoryItem(userId, {
          itemId: itemData.itemId,
          type: itemData.type,
          quantity: itemData.quantity,
          obtainedAt: Date.now()
        });
        
        result = { itemId };
        break;
        
      case 'use':
        // 使用物品
        if (!itemData.itemId || !itemData.type) {
          return Response.json({ error: '物品数据不完整' }, { status: 400 });
        }
        
        // 获取物品库存
        const inventory = await db.getInventory(userId);
        
        // 查找物品
        const item = inventory.items.find(i => i.itemId === itemData.itemId && i.type === itemData.type);
        
        if (!item) {
          return Response.json({ error: '物品不存在' }, { status: 404 });
        }
        
        if (item.quantity < 1) {
          return Response.json({ error: '物品数量不足' }, { status: 400 });
        }
        
        // 根据物品类型执行不同的效果
        switch (itemData.type) {
          case 'prop':
            // 游戏道具，在游戏中使用
            // 这里只减少库存，具体效果在游戏前端实现
            await db.addInventoryItem(userId, {
              itemId: itemData.itemId,
              type: itemData.type,
              quantity: -1,
              obtainedAt: Date.now()
            });
            break;
            
          case 'material':
            // 材料，用于合成或升级
            await db.addInventoryItem(userId, {
              itemId: itemData.itemId,
              type: itemData.type,
              quantity: -1,
              obtainedAt: Date.now()
            });
            break;
            
          case 'gift':
            // 礼物，用于赠送好友
            if (!itemData.receiverId) {
              return Response.json({ error: '缺少接收者ID' }, { status: 400 });
            }
            
            // 检查接收者是否存在
            const receiver = await db.getUserById(itemData.receiverId);
            if (!receiver) {
              return Response.json({ error: '接收者不存在' }, { status: 404 });
            }
            
            // 减少发送者库存
            await db.addInventoryItem(userId, {
              itemId: itemData.itemId,
              type: itemData.type,
              quantity: -1,
              obtainedAt: Date.now()
            });
            
            // 增加接收者库存
            await db.addInventoryItem(itemData.receiverId, {
              itemId: itemData.itemId,
              type: itemData.type,
              quantity: 1,
              obtainedAt: Date.now()
            });
            
            // 发送消息通知
            await db.addMessage({
              senderId: userId,
              receiverId: itemData.receiverId,
              type: 'gift',
              content: `${user.username} 送给你一个礼物: ${itemData.name}`,
              isRead: false,
              createdAt: Date.now()
            });
            break;
            
          default:
            return Response.json({ error: '不支持的物品类型' }, { status: 400 });
        }
        
        result = { used: true };
        break;
        
      default:
        return Response.json({ error: '不支持的操作类型' }, { status: 400 });
    }
    
    // 获取更新后的物品库存
    const updatedInventory = await db.getInventory(userId);
    
    return Response.json({ 
      success: true, 
      result,
      inventory: updatedInventory
    });
    
  } catch (error) {
    console.error('物品操作失败:', error);
    return Response.json({ error: '服务器错误' }, { status: 500 });
  }
}
