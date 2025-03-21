'use client';

import { useState } from 'react';
import Link from 'next/link';

// 好友卡片组件
const FriendCard = ({ 
  friend, 
  onSendGift, 
  onVisit, 
  onInvite 
}: { 
  friend: {
    id: string;
    name: string;
    level: number;
    gardenLevel: number;
    petsCount: number;
    totalPets: number;
    avatar: string;
    online: boolean;
  }, 
  onSendGift: () => void, 
  onVisit: () => void, 
  onInvite: () => void 
}) => {
  return (
    <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
      <div className="flex items-center">
        {/* 头像 */}
        <div className="relative">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            {/* 实际开发中替换为真实头像 */}
            <span className="text-xl">{friend.avatar}</span>
          </div>
          {/* 在线状态 */}
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
            friend.online ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>
        
        {/* 好友信息 */}
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{friend.name}</h3>
            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">Lv.{friend.level}</span>
          </div>
          <p className="text-xs text-gray-600">
            庄园等级: {friend.gardenLevel} &nbsp;|&nbsp; 萌宠: {friend.petsCount}/{friend.totalPets}
          </p>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex justify-between mt-2">
        <button 
          className="btn bg-green-500 text-xs px-2 py-1"
          onClick={onSendGift}
        >
          送礼物
        </button>
        <button 
          className="btn bg-blue-500 text-xs px-2 py-1"
          onClick={onVisit}
        >
          访问庄园
        </button>
        <button 
          className="btn bg-purple-500 text-xs px-2 py-1"
          onClick={onInvite}
        >
          邀请游戏
        </button>
      </div>
    </div>
  );
};

// 搜索框组件
const SearchBar = ({ 
  onSearch 
}: { 
  onSearch: (query: string) => void 
}) => {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input 
        type="text"
        placeholder="搜索好友..."
        className="flex-1 px-3 py-2 rounded-l-lg border-0"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit"
        className="bg-primary text-white px-3 py-2 rounded-r-lg"
      >
        搜索
      </button>
    </form>
  );
};

// 好友请求组件
const FriendRequest = ({ 
  request, 
  onAccept, 
  onReject 
}: { 
  request: {
    id: string;
    name: string;
    level: number;
    avatar: string;
  }, 
  onAccept: () => void, 
  onReject: () => void 
}) => {
  return (
    <div className="bg-white bg-opacity-80 rounded-lg p-3 mb-3 flex items-center">
      {/* 头像 */}
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-lg">{request.avatar}</span>
      </div>
      
      {/* 请求信息 */}
      <div className="ml-3 flex-1">
        <div className="flex items-center">
          <h3 className="font-medium text-sm">{request.name}</h3>
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full ml-2">Lv.{request.level}</span>
        </div>
        <p className="text-xs text-gray-600">请求添加您为好友</p>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <button 
          className="btn bg-green-500 text-xs px-2 py-1"
          onClick={onAccept}
        >
          接受
        </button>
        <button 
          className="btn bg-gray-300 text-gray-700 text-xs px-2 py-1"
          onClick={onReject}
        >
          拒绝
        </button>
      </div>
    </div>
  );
};

// 标签页组件
const Tabs = ({ 
  currentTab, 
  onTabChange 
}: { 
  currentTab: string, 
  onTabChange: (tab: string) => void 
}) => {
  const tabs = [
    { id: 'friends', label: '好友' },
    { id: 'requests', label: '请求' },
    { id: 'rankings', label: '排行榜' },
  ];

  return (
    <div className="flex bg-white bg-opacity-70 rounded-lg p-1 mb-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`flex-1 py-2 rounded ${
            currentTab === tab.id
              ? 'bg-primary text-white'
              : 'text-gray-700'
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// 排行榜项组件
const RankingItem = ({ 
  player, 
  rank 
}: { 
  player: {
    id: string;
    name: string;
    level: number;
    score: number;
    avatar: string;
  }, 
  rank: number 
}) => {
  return (
    <div className={`bg-white rounded-lg p-3 mb-2 flex items-center ${
      rank <= 3 ? 'border-l-4 border-yellow-400' : ''
    }`}>
      {/* 排名 */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
        rank === 1 ? 'bg-yellow-400' :
        rank === 2 ? 'bg-gray-300' :
        rank === 3 ? 'bg-orange-400' :
        'bg-gray-200'
      }`}>
        <span className={`font-bold ${rank <= 3 ? 'text-white' : 'text-gray-700'}`}>{rank}</span>
      </div>
      
      {/* 头像 */}
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-lg">{player.avatar}</span>
      </div>
      
      {/* 玩家信息 */}
      <div className="ml-3 flex-1">
        <div className="flex items-center">
          <h3 className="font-medium text-sm">{player.name}</h3>
          <span className="text-xs bg-primary bg-opacity-20 text-primary px-2 py-0.5 rounded-full ml-2">Lv.{player.level}</span>
        </div>
        <p className="text-xs text-gray-600">得分: {player.score.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default function SocialPage() {
  const [currentTab, setCurrentTab] = useState('friends');
  
  // 模拟好友数据
  const friends = [
    { 
      id: 'f1', 
      name: '好友名称1', 
      level: 15, 
      gardenLevel: 8, 
      petsCount: 12, 
      totalPets: 20, 
      avatar: '👧', 
      online: true 
    },
    { 
      id: 'f2', 
      name: '好友名称2', 
      level: 8, 
      gardenLevel: 5, 
      petsCount: 8, 
      totalPets: 20, 
      avatar: '👦', 
      online: false 
    },
    { 
      id: 'f3', 
      name: '好友名称3', 
      level: 20, 
      gardenLevel: 10, 
      petsCount: 15, 
      totalPets: 20, 
      avatar: '👩', 
      online: true 
    },
  ];
  
  // 模拟好友请求数据
  const friendRequests = [
    { id: 'r1', name: '请求用户1', level: 5, avatar: '👨' },
    { id: 'r2', name: '请求用户2', level: 10, avatar: '👧' },
  ];
  
  // 模拟排行榜数据
  const rankings = [
    { id: 'p1', name: '玩家1', level: 25, score: 15800, avatar: '👸' },
    { id: 'p2', name: '玩家2', level: 23, score: 14500, avatar: '🤴' },
    { id: 'p3', name: '玩家3', level: 22, score: 13200, avatar: '👩' },
    { id: 'p4', name: '玩家4', level: 20, score: 12000, avatar: '👨' },
    { id: 'p5', name: '玩家5', level: 18, score: 10500, avatar: '👧' },
    { id: 'p6', name: '玩家6', level: 15, score: 9800, avatar: '👦' },
    { id: 'p7', name: '玩家7', level: 12, score: 8500, avatar: '👵' },
    { id: 'p8', name: '玩家8', level: 10, score: 7200, avatar: '👴' },
  ];
  
  // 处理函数
  const handleSearch = (query: string) => {
    alert(`搜索好友: ${query}`);
  };
  
  const handleSendGift = (friend: any) => {
    alert(`向 ${friend.name} 发送礼物`);
  };
  
  const handleVisit = (friend: any) => {
    alert(`访问 ${friend.name} 的庄园`);
  };
  
  const handleInvite = (friend: any) => {
    alert(`邀请 ${friend.name} 一起游戏`);
  };
  
  const handleAcceptRequest = (request: any) => {
    alert(`接受 ${request.name} 的好友请求`);
  };
  
  const handleRejectRequest = (request: any) => {
    alert(`拒绝 ${request.name} 的好友请求`);
  };
  
  return (
    <div className="min-h-screen pb-16 theme-spring">
      {/* 顶部栏 */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/main" className="btn bg-white bg-opacity-70 text-gray-800 px-3 py-1">
          返回
        </Link>
        <h1 className="font-bold">好友中心</h1>
        <button className="btn bg-primary px-3 py-1">
          添加好友
        </button>
      </header>
      
      {/* 标签页 */}
      <div className="px-4">
        <Tabs 
          currentTab={currentTab} 
          onTabChange={setCurrentTab} 
        />
      </div>
      
      {/* 内容区域 */}
      <div className="px-4">
        {currentTab === 'friends' && (
          <>
            <SearchBar onSearch={handleSearch} />
            
            {friends.map(friend => (
              <FriendCard 
                key={friend.id}
                friend={friend}
                onSendGift={() => handleSendGift(friend)}
                onVisit={() => handleVisit(friend)}
                onInvite={() => handleInvite(friend)}
              />
            ))}
          </>
        )}
        
        {currentTab === 'requests' && (
          <>
            <h2 className="font-bold mb-3">好友请求</h2>
            
            {friendRequests.length > 0 ? (
              friendRequests.map(request => (
                <FriendRequest 
                  key={request.id}
                  request={request}
                  onAccept={() => handleAcceptRequest(request)}
                  onReject={() => handleRejectRequest(request)}
                />
              ))
            ) : (
              <div className="bg-white bg-opacity-80 rounded-lg p-4 text-center">
                <p className="text-gray-600">暂无好友请求</p>
              </div>
            )}
          </>
        )}
        
        {currentTab === 'rankings' && (
          <>
            <div className="flex justify-between mb-3">
              <h2 className="font-bold">排行榜</h2>
              <div className="text-sm text-gray-600">每周一更新</div>
            </div>
            
            {rankings.map((player, index) => (
              <RankingItem 
                key={player.id}
                player={player}
                rank={index + 1}
              />
            ))}
          </>
        )}
      </div>
      
      {/* 底部导航栏 */}
      <nav className="navbar">
        <Link href="/main/levels" className="navbar-item text-gray-500">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
          <span className="text-xs">关卡</span>
        </Link>
        <Link href="/main/garden" className="navbar-item text-gray-500">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
          <span className="text-xs">庄园</span>
        </Link>
        <Link href="/main/pets" className="navbar-item text-gray-500">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
          <span className="text-xs">萌宠</span>
        </Link>
        <Link href="/main/shop" className="navbar-item text-gray-500">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
          <span className="text-xs">商店</span>
        </Link>
        <Link href="/main/social" className="navbar-item text-primary font-bold">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-primary"></div>
          </div>
          <span className="text-xs">社交</span>
        </Link>
      </nav>
    </div>
  );
}
