'use client';

import { useState } from 'react';
import Link from 'next/link';

// 萌宠卡片组件
const PetCard = ({ 
  pet, 
  isSelected, 
  onClick 
}: { 
  pet: {
    id: string;
    name: string;
    level: number;
    intimacy: number;
    skillLevel: number;
    skill: string;
    season: string;
    unlocked: boolean;
  }, 
  isSelected: boolean, 
  onClick: () => void 
}) => {
  if (!pet.unlocked) {
    return (
      <div 
        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center opacity-70"
        onClick={onClick}
      >
        <span className="text-xl">?</span>
      </div>
    );
  }
  
  return (
    <div 
      className={`w-16 h-16 rounded-lg flex items-center justify-center ${
        isSelected 
          ? 'bg-primary bg-opacity-20 border-2 border-primary' 
          : 'bg-white'
      }`}
      onClick={onClick}
    >
      {/* 实际开发中替换为真实萌宠图片 */}
      <span className="text-2xl">
        {pet.season === 'spring' ? '🐰' : 
         pet.season === 'summer' ? '🐬' : 
         pet.season === 'autumn' ? '🦊' : '🐧'}
      </span>
    </div>
  );
};

// 萌宠详情组件
const PetDetail = ({ 
  pet,
  onFeed,
  onInteract,
  onDress,
  onDeploy
}: { 
  pet: {
    id: string;
    name: string;
    level: number;
    intimacy: number;
    skillLevel: number;
    skill: string;
    season: string;
    unlocked: boolean;
  },
  onFeed: () => void,
  onInteract: () => void,
  onDress: () => void,
  onDeploy: () => void
}) => {
  return (
    <div className="bg-white bg-opacity-80 rounded-xl p-4 flex flex-col items-center">
      {/* 萌宠3D模型区域 */}
      <div className="w-40 h-40 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
        <span className="text-6xl">
          {pet.season === 'spring' ? '🐰' : 
           pet.season === 'summer' ? '🐬' : 
           pet.season === 'autumn' ? '🦊' : '🐧'}
        </span>
      </div>
      
      <h2 className="font-bold text-lg mb-1">{pet.name}</h2>
      <p className="text-sm text-gray-600 mb-3">等级: {pet.level}</p>
      
      {/* 亲密度和技能等级 */}
      <div className="w-full flex justify-between mb-3">
        <div>
          <p className="text-xs text-gray-600 mb-1">亲密度:</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < pet.intimacy ? "text-red-500" : "text-gray-300"}`}>❤️</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">技能等级:</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-sm ${i < pet.skillLevel ? "text-yellow-500" : "text-gray-300"}`}>⭐</span>
            ))}
          </div>
        </div>
      </div>
      
      {/* 技能描述 */}
      <div className="w-full bg-white rounded-lg p-2 mb-4">
        <p className="text-sm font-medium">技能: {pet.skill}</p>
      </div>
      
      {/* 操作按钮 */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <button 
          className="btn bg-green-500 text-sm py-2"
          onClick={onFeed}
        >
          喂养
        </button>
        <button 
          className="btn bg-blue-500 text-sm py-2"
          onClick={onInteract}
        >
          互动
        </button>
        <button 
          className="btn bg-purple-500 text-sm py-2"
          onClick={onDress}
        >
          装扮
        </button>
        <button 
          className="btn bg-red-500 text-sm py-2"
          onClick={onDeploy}
        >
          出战
        </button>
      </div>
    </div>
  );
};

// 季节标签组件
const SeasonTabs = ({ 
  currentSeason, 
  onSeasonChange 
}: { 
  currentSeason: string, 
  onSeasonChange: (season: string) => void 
}) => {
  const seasons = [
    { id: 'all', label: '全部' },
    { id: 'spring', label: '春季' },
    { id: 'summer', label: '夏季' },
    { id: 'autumn', label: '秋季' },
    { id: 'winter', label: '冬季' },
  ];

  return (
    <div className="flex bg-white bg-opacity-70 rounded-lg p-1">
      {seasons.map(season => (
        <button
          key={season.id}
          className={`flex-1 py-1 text-sm rounded ${
            currentSeason === season.id
              ? 'bg-primary text-white'
              : 'text-gray-700'
          }`}
          onClick={() => onSeasonChange(season.id)}
        >
          {season.label}
        </button>
      ))}
    </div>
  );
};

export default function PetsPage() {
  const [currentSeason, setCurrentSeason] = useState('all');
  const [selectedPet, setSelectedPet] = useState('p1');
  
  // 模拟萌宠数据
  const pets = [
    { 
      id: 'p1', 
      name: '小兔子', 
      level: 5, 
      intimacy: 4, 
      skillLevel: 3, 
      skill: '花朵收集 - 随机生成3个胡萝卜元素', 
      season: 'spring',
      unlocked: true
    },
    { 
      id: 'p2', 
      name: '小狐狸', 
      level: 3, 
      intimacy: 2, 
      skillLevel: 2, 
      skill: '秋叶旋风 - 清除一行元素', 
      season: 'autumn',
      unlocked: true
    },
    { 
      id: 'p3', 
      name: '小熊', 
      level: 4, 
      intimacy: 3, 
      skillLevel: 2, 
      skill: '蜂蜜收集 - 增加额外得分', 
      season: 'autumn',
      unlocked: true
    },
    { 
      id: 'p4', 
      name: '企鹅', 
      level: 1, 
      intimacy: 1, 
      skillLevel: 1, 
      skill: '冰冻 - 暂停倒计时5秒', 
      season: 'winter',
      unlocked: true
    },
    { 
      id: 'p5', 
      name: '???', 
      level: 0, 
      intimacy: 0, 
      skillLevel: 0, 
      skill: '???', 
      season: 'spring',
      unlocked: false
    },
  ];
  
  // 根据当前选择的季节过滤萌宠
  const filteredPets = currentSeason === 'all' 
    ? pets 
    : pets.filter(pet => pet.season === currentSeason);
  
  // 获取当前选中的萌宠
  const currentPet = pets.find(pet => pet.id === selectedPet) || pets[0];
  
  // 萌宠操作函数
  const handleFeed = () => {
    alert(`喂养 ${currentPet.name}`);
  };
  
  const handleInteract = () => {
    alert(`与 ${currentPet.name} 互动`);
  };
  
  const handleDress = () => {
    alert(`为 ${currentPet.name} 装扮`);
  };
  
  const handleDeploy = () => {
    alert(`将 ${currentPet.name} 设为出战萌宠`);
  };
  
  return (
    <div className={`min-h-screen pb-16 theme-${currentPet.season}`}>
      {/* 顶部栏 */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/main" className="btn bg-white bg-opacity-70 text-gray-800 px-3 py-1">
          返回
        </Link>
        <h1 className="font-bold">萌宠中心</h1>
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
      
      {/* 季节标签 */}
      <div className="px-4 mb-4">
        <SeasonTabs 
          currentSeason={currentSeason} 
          onSeasonChange={setCurrentSeason} 
        />
      </div>
      
      {/* 萌宠详情 */}
      <div className="px-4 mb-4">
        <PetDetail 
          pet={currentPet}
          onFeed={handleFeed}
          onInteract={handleInteract}
          onDress={handleDress}
          onDeploy={handleDeploy}
        />
      </div>
      
      {/* 萌宠列表 */}
      <div className="px-4">
        <div className="bg-white bg-opacity-50 rounded-xl p-3">
          <div className="flex justify-between">
            {filteredPets.map(pet => (
              <PetCard 
                key={pet.id}
                pet={pet}
                isSelected={selectedPet === pet.id}
                onClick={() => setSelectedPet(pet.id)}
              />
            ))}
          </div>
        </div>
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
        <Link href="/main/pets" className="navbar-item text-primary font-bold">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-primary"></div>
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
