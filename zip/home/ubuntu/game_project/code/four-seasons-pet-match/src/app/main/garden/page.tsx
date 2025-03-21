'use client';

import { useState } from 'react';
import Link from 'next/link';

// 建筑/装饰项组件
const GardenItem = ({ 
  item, 
  onPlace 
}: { 
  item: {
    id: string;
    name: string;
    type: string;
    cost: { type: string; amount: number };
    placed: boolean;
  }, 
  onPlace: () => void 
}) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm">
      <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
        {/* 实际开发中替换为真实图片 */}
        <span className="text-2xl">{item.type === 'building' ? '🏠' : '🌳'}</span>
      </div>
      <h3 className="font-medium text-sm">{item.name}</h3>
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${item.cost.type === 'gold' ? 'bg-yellow-400' : 'bg-blue-400'} mr-1`}></div>
          <span className="text-xs">{item.cost.amount}</span>
        </div>
        <button 
          className={`text-xs px-2 py-1 rounded ${
            item.placed 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-primary text-white'
          }`}
          onClick={onPlace}
          disabled={item.placed}
        >
          {item.placed ? '已放置' : '放置'}
        </button>
      </div>
    </div>
  );
};

// 庄园区域组件
const GardenArea = ({ 
  items, 
  onItemClick 
}: { 
  items: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    name: string;
  }>, 
  onItemClick: (id: string) => void 
}) => {
  return (
    <div className="relative w-full h-96 bg-green-100 rounded-xl overflow-hidden">
      {/* 实际开发中这里应该是一个可交互的庄园场景 */}
      {items.map(item => (
        <div 
          key={item.id}
          className="absolute bg-white rounded-lg shadow-md flex items-center justify-center"
          style={{ 
            width: item.type === 'building' ? '60px' : '40px',
            height: item.type === 'building' ? '60px' : '40px',
            left: `${item.x}%`, 
            top: `${item.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => onItemClick(item.id)}
        >
          <span className="text-xl">{item.type === 'building' ? '🏠' : '🌳'}</span>
        </div>
      ))}
    </div>
  );
};

// 季节切换组件
const SeasonToggle = ({ 
  currentSeason, 
  onSeasonChange 
}: { 
  currentSeason: string, 
  onSeasonChange: (season: string) => void 
}) => {
  const seasons = [
    { id: 'spring', label: '春季', emoji: '🌸' },
    { id: 'summer', label: '夏季', emoji: '☀️' },
    { id: 'autumn', label: '秋季', emoji: '🍂' },
    { id: 'winter', label: '冬季', emoji: '❄️' },
  ];

  return (
    <div className="flex space-x-2 mb-4">
      {seasons.map(season => (
        <button
          key={season.id}
          className={`flex-1 py-2 rounded-lg ${
            currentSeason === season.id
              ? 'bg-white shadow-md'
              : 'bg-white bg-opacity-50'
          }`}
          onClick={() => onSeasonChange(season.id)}
        >
          <span className="text-sm">{season.emoji} {season.label}</span>
        </button>
      ))}
    </div>
  );
};

// 庄园信息组件
const GardenInfo = ({ 
  name, 
  level, 
  exp 
}: { 
  name: string, 
  level: number, 
  exp: { current: number, next: number } 
}) => {
  const progress = (exp.current / exp.next) * 100;
  
  return (
    <div className="bg-white bg-opacity-80 rounded-lg p-3 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="font-bold">{name}</h2>
        <span className="text-sm bg-primary text-white px-2 py-1 rounded-full">Lv.{level}</span>
      </div>
      <div className="mt-2">
        <div className="text-xs text-gray-600 mb-1">经验值: {exp.current}/{exp.next}</div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default function GardenPage() {
  const [currentSeason, setCurrentSeason] = useState('spring');
  const [editMode, setEditMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState('buildings');
  
  // 模拟庄园数据
  const gardenInfo = {
    name: '我的春季庄园',
    level: 5,
    exp: { current: 450, next: 1000 }
  };
  
  // 模拟庄园中的物品
  const [placedItems, setPlacedItems] = useState([
    { id: 'b1', type: 'building', x: 50, y: 30, name: '主屋' },
    { id: 'b2', type: 'building', x: 30, y: 70, name: '工坊' },
    { id: 'd1', type: 'decoration', x: 20, y: 40, name: '樱花树' },
    { id: 'd2', type: 'decoration', x: 70, y: 50, name: '花坛' },
    { id: 'd3', type: 'decoration', x: 80, y: 20, name: '小池塘' },
  ]);
  
  // 模拟可放置的物品
  const availableItems = {
    buildings: [
      { id: 'b3', name: '主屋升级', type: 'building', cost: { type: 'gold', amount: 500 }, placed: false },
      { id: 'b4', name: '高级工坊', type: 'building', cost: { type: 'gold', amount: 300 }, placed: false },
      { id: 'b5', name: '许愿池', type: 'building', cost: { type: 'diamond', amount: 50 }, placed: false },
    ],
    decorations: [
      { id: 'd4', name: '樱花树', type: 'decoration', cost: { type: 'gold', amount: 100 }, placed: false },
      { id: 'd5', name: '花坛', type: 'decoration', cost: { type: 'gold', amount: 50 }, placed: false },
      { id: 'd6', name: '向日葵', type: 'decoration', cost: { type: 'gold', amount: 50 }, placed: false },
    ],
    seasonal: [
      { id: 's1', name: '春季喷泉', type: 'decoration', cost: { type: 'gold', amount: 200 }, placed: false },
      { id: 's2', name: '樱花拱门', type: 'decoration', cost: { type: 'diamond', amount: 30 }, placed: false },
    ]
  };
  
  const handleItemPlace = (item: any) => {
    // 实际开发中，这里应该检查资源是否足够，然后添加到庄园中
    alert(`放置 ${item.name}`);
  };
  
  const handlePlacedItemClick = (id: string) => {
    if (editMode) {
      // 实际开发中，这里应该显示编辑选项
      alert(`编辑物品 ${id}`);
    } else {
      // 实际开发中，这里应该显示物品详情
      alert(`查看物品 ${id}`);
    }
  };
  
  return (
    <div className={`min-h-screen pb-16 theme-${currentSeason}`}>
      {/* 顶部栏 */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/main" className="btn bg-white bg-opacity-70 text-gray-800 px-3 py-1">
          返回
        </Link>
        <div className="flex space-x-2">
          <div className="resource-display">
            <div className="resource-icon bg-yellow-400 rounded-full"></div>
            <span>1000</span>
          </div>
          <div className="resource-display">
            <div className="resource-icon bg-blue-400 rounded-full"></div>
            <span>50</span>
          </div>
        </div>
      </header>
      
      {/* 庄园信息 */}
      <div className="p-4">
        <GardenInfo 
          name={gardenInfo.name} 
          level={gardenInfo.level} 
          exp={gardenInfo.exp} 
        />
        
        {/* 季节切换 */}
        <SeasonToggle 
          currentSeason={currentSeason} 
          onSeasonChange={setCurrentSeason} 
        />
        
        {/* 庄园区域 */}
        <GardenArea 
          items={placedItems} 
          onItemClick={handlePlacedItemClick} 
        />
        
        {/* 编辑模式切换 */}
        <div className="flex justify-center mt-4">
          <button 
            className={`btn ${editMode ? 'bg-red-500' : 'bg-primary'} px-6`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? '退出编辑' : '编辑庄园'}
          </button>
        </div>
        
        {/* 建筑/装饰选择 */}
        {editMode && (
          <div className="mt-4">
            <div className="flex mb-2">
              <button 
                className={`flex-1 py-2 ${selectedTab === 'buildings' ? 'bg-white' : 'bg-white bg-opacity-50'} rounded-l-lg`}
                onClick={() => setSelectedTab('buildings')}
              >
                建筑
              </button>
              <button 
                className={`flex-1 py-2 ${selectedTab === 'decorations' ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                onClick={() => setSelectedTab('decorations')}
              >
                装饰
              </button>
              <button 
                className={`flex-1 py-2 ${selectedTab === 'seasonal' ? 'bg-white' : 'bg-white bg-opacity-50'} rounded-r-lg`}
                onClick={() => setSelectedTab('seasonal')}
              >
                季节限定
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {availableItems[selectedTab as keyof typeof availableItems].map(item => (
                <GardenItem 
                  key={item.id}
                  item={item}
                  onPlace={() => handleItemPlace(item)}
                />
              ))}
            </div>
          </div>
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
        <Link href="/main/garden" className="navbar-item text-primary font-bold">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-primary"></div>
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
        <Link href="/main/social" className="navbar-item text-gray-500">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
          <span className="text-xs">社交</span>
        </Link>
      </nav>
    </div>
  );
}
