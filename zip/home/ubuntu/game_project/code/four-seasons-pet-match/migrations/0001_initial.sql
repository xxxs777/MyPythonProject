CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar TEXT NOT NULL,
  platform TEXT NOT NULL,
  platformId TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 1000,
  diamond INTEGER NOT NULL DEFAULT 50,
  energy INTEGER NOT NULL DEFAULT 20,
  maxEnergy INTEGER NOT NULL DEFAULT 20,
  lastEnergyRefillTime INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  lastLoginAt INTEGER NOT NULL
);

CREATE TABLE game_progress (
  userId TEXT PRIMARY KEY,
  currentSeason TEXT NOT NULL,
  highestLevel INTEGER NOT NULL DEFAULT 1,
  levelStars TEXT NOT NULL, -- JSON string
  completedLevels TEXT NOT NULL, -- JSON array string
  totalScore INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE gardens (
  userId TEXT PRIMARY KEY,
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  season TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE garden_items (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  itemId TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  x REAL NOT NULL,
  y REAL NOT NULL,
  rotation REAL NOT NULL DEFAULT 0,
  purchasedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE pets (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  petId TEXT NOT NULL,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  intimacy REAL NOT NULL DEFAULT 1,
  skillLevel INTEGER NOT NULL DEFAULT 1,
  season TEXT NOT NULL,
  isDeployed INTEGER NOT NULL DEFAULT 0,
  accessories TEXT NOT NULL, -- JSON array string
  obtainedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE inventory_items (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  itemId TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  obtainedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE friendships (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  friendId TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (friendId) REFERENCES users(id)
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  senderId TEXT NOT NULL,
  receiverId TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  isRead INTEGER NOT NULL DEFAULT 0,
  attachments TEXT, -- JSON string
  createdAt INTEGER NOT NULL,
  FOREIGN KEY (senderId) REFERENCES users(id),
  FOREIGN KEY (receiverId) REFERENCES users(id)
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  type TEXT NOT NULL,
  itemType TEXT NOT NULL,
  itemId TEXT,
  quantity INTEGER NOT NULL,
  costType TEXT,
  costAmount INTEGER,
  createdAt INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE user_achievements (
  userId TEXT NOT NULL,
  achievementId TEXT NOT NULL,
  currentValue INTEGER NOT NULL DEFAULT 0,
  isCompleted INTEGER NOT NULL DEFAULT 0,
  completedAt INTEGER,
  isRewardClaimed INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (userId, achievementId),
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- 索引
CREATE INDEX idx_garden_items_userId ON garden_items(userId);
CREATE INDEX idx_pets_userId ON pets(userId);
CREATE INDEX idx_inventory_items_userId ON inventory_items(userId);
CREATE INDEX idx_friendships_userId ON friendships(userId);
CREATE INDEX idx_friendships_friendId ON friendships(friendId);
CREATE INDEX idx_messages_receiverId ON messages(receiverId);
CREATE INDEX idx_transactions_userId ON transactions(userId);
