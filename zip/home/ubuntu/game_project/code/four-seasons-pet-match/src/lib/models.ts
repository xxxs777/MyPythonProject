// 数据库模型定义

// 用户模型
export interface User {
  id: string;
  username: string;
  avatar: string;
  platform: 'wechat' | 'douyin' | 'guest';
  platformId?: string;
  level: number;
  exp: number;
  gold: number;
  diamond: number;
  energy: number;
  maxEnergy: number;
  lastEnergyRefillTime: number;
  createdAt: number;
  lastLoginAt: number;
}

// 游戏进度模型
export interface GameProgress {
  userId: string;
  currentSeason: 'spring' | 'summer' | 'autumn' | 'winter';
  highestLevel: number;
  levelStars: Record<string, number>; // 关卡ID -> 星级
  completedLevels: string[]; // 已完成关卡ID列表
  totalScore: number;
}

// 庄园模型
export interface Garden {
  userId: string;
  level: number;
  exp: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  buildings: GardenItem[];
  decorations: GardenItem[];
}

// 庄园物品模型
export interface GardenItem {
  id: string;
  itemId: string;
  type: 'building' | 'decoration';
  name: string;
  level?: number;
  x: number;
  y: number;
  rotation?: number;
  purchasedAt: number;
}

// 萌宠模型
export interface Pet {
  userId: string;
  id: string;
  petId: string;
  name: string;
  level: number;
  exp: number;
  intimacy: number;
  skillLevel: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  isDeployed: boolean;
  accessories: string[]; // 装饰ID列表
  obtainedAt: number;
}

// 物品库存模型
export interface Inventory {
  userId: string;
  items: InventoryItem[];
}

// 库存物品模型
export interface InventoryItem {
  id: string;
  itemId: string;
  type: 'prop' | 'material' | 'gift';
  quantity: number;
  obtainedAt: number;
}

// 好友关系模型
export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted';
  createdAt: number;
  updatedAt: number;
}

// 消息模型
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  type: 'gift' | 'invitation' | 'system';
  content: string;
  isRead: boolean;
  attachments?: any;
  createdAt: number;
}

// 交易记录模型
export interface Transaction {
  id: string;
  userId: string;
  type: 'purchase' | 'reward' | 'gift';
  itemType: 'gold' | 'diamond' | 'energy' | 'prop' | 'pet' | 'decoration' | 'building';
  itemId?: string;
  quantity: number;
  cost?: {
    type: 'gold' | 'diamond' | 'rmb';
    amount: number;
  };
  createdAt: number;
}

// 活动模型
export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'seasonal' | 'special';
  rewards: EventReward[];
  startTime: number;
  endTime: number;
  isActive: boolean;
}

// 活动奖励模型
export interface EventReward {
  type: 'gold' | 'diamond' | 'energy' | 'prop' | 'pet' | 'decoration' | 'building';
  itemId?: string;
  quantity: number;
}

// 成就模型
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'collection' | 'level' | 'garden' | 'pet' | 'social';
  requiredValue: number;
  rewards: EventReward[];
}

// 用户成就进度模型
export interface UserAchievement {
  userId: string;
  achievementId: string;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: number;
  isRewardClaimed: boolean;
}

// 游戏配置模型
export interface GameConfig {
  version: string;
  seasons: SeasonConfig[];
  levels: LevelConfig[];
  items: ItemConfig[];
  pets: PetConfig[];
  achievements: Achievement[];
  events: Event[];
}

// 季节配置模型
export interface SeasonConfig {
  id: 'spring' | 'summer' | 'autumn' | 'winter';
  name: string;
  elements: string[];
  specialElements: string[];
  backgroundTheme: string;
}

// 关卡配置模型
export interface LevelConfig {
  id: string;
  chapter: number;
  level: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  type: 'normal' | 'time' | 'boss';
  difficulty: number;
  objectives: LevelObjective[];
  grid: {
    rows: number;
    cols: number;
    initialElements?: string[][];
  };
  moves?: number;
  time?: number;
  rewards: {
    gold: number;
    exp: number;
    items?: {
      itemId: string;
      probability: number;
    }[];
  };
}

// 关卡目标模型
export interface LevelObjective {
  type: 'score' | 'collect' | 'clear' | 'reach';
  target: string;
  quantity: number;
}

// 物品配置模型
export interface ItemConfig {
  id: string;
  name: string;
  description: string;
  type: 'prop' | 'material' | 'gift' | 'building' | 'decoration';
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  price?: {
    type: 'gold' | 'diamond' | 'rmb';
    amount: number;
  };
  effects?: any;
  requirements?: any;
}

// 萌宠配置模型
export interface PetConfig {
  id: string;
  name: string;
  description: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  skill: {
    name: string;
    description: string;
    effects: any;
    cooldown: number;
  };
  evolutionStages?: {
    level: number;
    name: string;
    skillEnhancement: any;
  }[];
  price?: {
    type: 'gold' | 'diamond' | 'rmb';
    amount: number;
  };
}
