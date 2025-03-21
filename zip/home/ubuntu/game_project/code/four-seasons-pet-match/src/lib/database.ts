import { D1Database } from '@cloudflare/workers-types';
import { User, GameProgress, Garden, Pet, Inventory, Friendship, Message, Transaction } from '../models';

// 数据库工具类
export class Database {
  constructor(private db: D1Database) {}

  // 用户相关方法
  async getUserById(userId: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(userId).first();
    return result as User | null;
  }

  async getUserByPlatformId(platform: string, platformId: string): Promise<User | null> {
    const result = await this.db.prepare(
      'SELECT * FROM users WHERE platform = ? AND platformId = ?'
    ).bind(platform, platformId).first();
    return result as User | null;
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = crypto.randomUUID();
    const now = Date.now();
    
    await this.db.prepare(`
      INSERT INTO users (
        id, username, avatar, platform, platformId, level, exp, 
        gold, diamond, energy, maxEnergy, lastEnergyRefillTime, 
        createdAt, lastLoginAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, user.username, user.avatar, user.platform, user.platformId || null, 
      user.level, user.exp, user.gold, user.diamond, user.energy, 
      user.maxEnergy, user.lastEnergyRefillTime, now, now
    ).run();
    
    return { ...user, id, createdAt: now, lastLoginAt: now } as User;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    await this.db.prepare(`
      UPDATE users SET ${fields} WHERE id = ?
    `).bind(...values, userId).run();
  }

  // 游戏进度相关方法
  async getGameProgress(userId: string): Promise<GameProgress | null> {
    const result = await this.db.prepare(
      'SELECT * FROM game_progress WHERE userId = ?'
    ).bind(userId).first();
    
    if (!result) return null;
    
    // 处理JSON字段
    return {
      ...result,
      levelStars: JSON.parse(result.levelStars as string),
      completedLevels: JSON.parse(result.completedLevels as string)
    } as GameProgress;
  }

  async createGameProgress(progress: GameProgress): Promise<void> {
    await this.db.prepare(`
      INSERT INTO game_progress (
        userId, currentSeason, highestLevel, levelStars, 
        completedLevels, totalScore
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      progress.userId, progress.currentSeason, progress.highestLevel,
      JSON.stringify(progress.levelStars), JSON.stringify(progress.completedLevels),
      progress.totalScore
    ).run();
  }

  async updateGameProgress(userId: string, updates: Partial<GameProgress>): Promise<void> {
    // 处理JSON字段
    const processedUpdates = { ...updates };
    if (updates.levelStars) {
      processedUpdates.levelStars = JSON.stringify(updates.levelStars);
    }
    if (updates.completedLevels) {
      processedUpdates.completedLevels = JSON.stringify(updates.completedLevels);
    }
    
    const fields = Object.keys(processedUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(processedUpdates);
    
    await this.db.prepare(`
      UPDATE game_progress SET ${fields} WHERE userId = ?
    `).bind(...values, userId).run();
  }

  // 庄园相关方法
  async getGarden(userId: string): Promise<Garden | null> {
    const result = await this.db.prepare(
      'SELECT * FROM gardens WHERE userId = ?'
    ).bind(userId).first();
    
    if (!result) return null;
    
    // 获取庄园物品
    const buildings = await this.db.prepare(
      'SELECT * FROM garden_items WHERE userId = ? AND type = "building"'
    ).bind(userId).all();
    
    const decorations = await this.db.prepare(
      'SELECT * FROM garden_items WHERE userId = ? AND type = "decoration"'
    ).bind(userId).all();
    
    return {
      ...result,
      buildings: buildings.results,
      decorations: decorations.results
    } as Garden;
  }

  async createGarden(garden: Omit<Garden, 'buildings' | 'decorations'>): Promise<void> {
    await this.db.prepare(`
      INSERT INTO gardens (
        userId, level, exp, season
      ) VALUES (?, ?, ?, ?)
    `).bind(
      garden.userId, garden.level, garden.exp, garden.season
    ).run();
  }

  async addGardenItem(userId: string, item: Omit<Garden['buildings'][0], 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    
    await this.db.prepare(`
      INSERT INTO garden_items (
        id, userId, itemId, type, name, level, x, y, rotation, purchasedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, userId, item.itemId, item.type, item.name, 
      item.level || 1, item.x, item.y, item.rotation || 0, 
      item.purchasedAt
    ).run();
    
    return id;
  }

  // 萌宠相关方法
  async getPets(userId: string): Promise<Pet[]> {
    const result = await this.db.prepare(
      'SELECT * FROM pets WHERE userId = ?'
    ).bind(userId).all();
    
    return result.results.map(pet => ({
      ...pet,
      accessories: JSON.parse(pet.accessories as string)
    })) as Pet[];
  }

  async getPetById(petId: string): Promise<Pet | null> {
    const result = await this.db.prepare(
      'SELECT * FROM pets WHERE id = ?'
    ).bind(petId).first();
    
    if (!result) return null;
    
    return {
      ...result,
      accessories: JSON.parse(result.accessories as string)
    } as Pet;
  }

  async addPet(pet: Omit<Pet, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    
    await this.db.prepare(`
      INSERT INTO pets (
        id, userId, petId, name, level, exp, intimacy, skillLevel,
        season, isDeployed, accessories, obtainedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, pet.userId, pet.petId, pet.name, pet.level, pet.exp,
      pet.intimacy, pet.skillLevel, pet.season, pet.isDeployed ? 1 : 0,
      JSON.stringify(pet.accessories), pet.obtainedAt
    ).run();
    
    return id;
  }

  async updatePet(petId: string, updates: Partial<Pet>): Promise<void> {
    // 处理JSON字段和布尔值
    const processedUpdates = { ...updates };
    if (updates.accessories) {
      processedUpdates.accessories = JSON.stringify(updates.accessories);
    }
    if (updates.isDeployed !== undefined) {
      processedUpdates.isDeployed = updates.isDeployed ? 1 : 0;
    }
    
    const fields = Object.keys(processedUpdates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(processedUpdates);
    
    await this.db.prepare(`
      UPDATE pets SET ${fields} WHERE id = ?
    `).bind(...values, petId).run();
  }

  // 物品库存相关方法
  async getInventory(userId: string): Promise<Inventory> {
    const result = await this.db.prepare(
      'SELECT * FROM inventory_items WHERE userId = ?'
    ).bind(userId).all();
    
    return {
      userId,
      items: result.results
    } as Inventory;
  }

  async addInventoryItem(userId: string, item: Omit<Inventory['items'][0], 'id'>): Promise<string> {
    // 检查是否已存在相同物品
    const existingItem = await this.db.prepare(
      'SELECT * FROM inventory_items WHERE userId = ? AND itemId = ? AND type = ?'
    ).bind(userId, item.itemId, item.type).first();
    
    if (existingItem) {
      // 更新数量
      await this.db.prepare(
        'UPDATE inventory_items SET quantity = quantity + ? WHERE id = ?'
      ).bind(item.quantity, existingItem.id).run();
      
      return existingItem.id;
    } else {
      // 添加新物品
      const id = crypto.randomUUID();
      
      await this.db.prepare(`
        INSERT INTO inventory_items (
          id, userId, itemId, type, quantity, obtainedAt
        ) VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        id, userId, item.itemId, item.type, item.quantity, item.obtainedAt
      ).run();
      
      return id;
    }
  }

  // 好友关系相关方法
  async getFriends(userId: string): Promise<Friendship[]> {
    const result = await this.db.prepare(`
      SELECT * FROM friendships 
      WHERE (userId = ? OR friendId = ?) AND status = 'accepted'
    `).bind(userId, userId).all();
    
    return result.results as Friendship[];
  }

  async getFriendRequests(userId: string): Promise<Friendship[]> {
    const result = await this.db.prepare(`
      SELECT * FROM friendships 
      WHERE friendId = ? AND status = 'pending'
    `).bind(userId).all();
    
    return result.results as Friendship[];
  }

  async addFriend(friendship: Omit<Friendship, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    const now = Date.now();
    
    await this.db.prepare(`
      INSERT INTO friendships (
        id, userId, friendId, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id, friendship.userId, friendship.friendId, 
      friendship.status, now, now
    ).run();
    
    return id;
  }

  async updateFriendship(friendshipId: string, status: 'pending' | 'accepted'): Promise<void> {
    const now = Date.now();
    
    await this.db.prepare(`
      UPDATE friendships SET status = ?, updatedAt = ? WHERE id = ?
    `).bind(status, now, friendshipId).run();
  }

  // 消息相关方法
  async getMessages(userId: string): Promise<Message[]> {
    const result = await this.db.prepare(`
      SELECT * FROM messages 
      WHERE receiverId = ?
      ORDER BY createdAt DESC
    `).bind(userId).all();
    
    return result.results as Message[];
  }

  async addMessage(message: Omit<Message, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    
    await this.db.prepare(`
      INSERT INTO messages (
        id, senderId, receiverId, type, content, 
        isRead, attachments, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, message.senderId, message.receiverId, message.type,
      message.content, message.isRead ? 1 : 0, 
      message.attachments ? JSON.stringify(message.attachments) : null,
      message.createdAt
    ).run();
    
    return id;
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await this.db.prepare(`
      UPDATE messages SET isRead = 1 WHERE id = ?
    `).bind(messageId).run();
  }

  // 交易记录相关方法
  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<string> {
    const id = crypto.randomUUID();
    
    await this.db.prepare(`
      INSERT INTO transactions (
        id, userId, type, itemType, itemId, quantity, 
        costType, costAmount, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, transaction.userId, transaction.type, transaction.itemType,
      transaction.itemId || null, transaction.quantity,
      transaction.cost?.type || null, transaction.cost?.amount || null,
      transaction.createdAt
    ).run();
    
    return id;
  }

  async getTransactions(userId: string, limit = 20): Promise<Transaction[]> {
    const result = await this.db.prepare(`
      SELECT * FROM transactions 
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT ?
    `).bind(userId, limit).all();
    
    return result.results.map(tx => ({
      ...tx,
      cost: tx.costType ? { type: tx.costType, amount: tx.costAmount } : undefined
    })) as Transaction[];
  }
}
