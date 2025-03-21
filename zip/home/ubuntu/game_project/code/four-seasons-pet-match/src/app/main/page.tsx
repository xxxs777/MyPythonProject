'use client';

import { useState } from 'react';
import Link from 'next/link';

// 导航栏组件
const Navbar = ({ activePage }: { activePage: string }) => {
  const navItems = [
    { id: 'levels', label: '关卡', href: '/main/levels' },
    { id: 'garden', label: '庄园', href: '/main/garden' },
    { id: 'pets', label: '萌宠', href: '/main/pets' },
    { id: 'shop', label: '商店', href: '/main/shop' },
    { id: 'social', label: '社交', href: '/main/social' },
  ];

  return (
    <nav className="navbar">
      {navItems.map((item) => (
        <Link 
          key={item.id} 
          href={item.href}
          className={`navbar-item ${activePage === item.id ? 'text-primary font-bold' : 'text-gray-500'}`}
        >
          <div className="navbar-icon">
            {/* 实际开发中替换为真实图标 */}
            <div className={`w-6 h-6 rounded-full ${activePage === item.id ? 'bg-primary' : 'bg-gray-300'}`}></div>
          </div>
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

// 资源显示组件
const ResourceDisplay = () => {
  return (
    <div className="flex space-x-2">
      <div className="resource-display">
        <div className="resource-icon bg-yellow-400 rounded-full"></div>
        <span>1000</span>
      </div>
      <div className="resource-display">
        <div className="resource-icon bg-blue-400 rounded-full"></div>
        <span>50</span>
      </div>
      <div className="resource-display">
        <div className="resource-icon bg-red-400 rounded-full"></div>
        <span>10/20</span>
      </div>
    </div>
  );
};

// 季节选择器组件
const SeasonSelector = ({ currentSeason, onSeasonChange }: { currentSeason: string, onSeasonChange: (season: string) => void }) => {
  const seasons = [
    { id: 'spring', label: '春季' },
    { id: 'summer', label: '夏季' },
    { id: 'autumn', label: '秋季' },
    { id: 'winter', label: '冬季' },
  ];

  return (
    <div className="flex justify-center my-4">
      <div className="bg-white bg-opacity-70 rounded-full p-1 flex">
        {seasons.map((season) => (
          <button
            key={season.id}
            className={`px-4 py-2 rounded-full transition-all ${
              currentSeason === season.id 
                ? 'bg-primary text-white' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onSeasonChange(season.id)}
          >
            {season.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// 活动横幅组件
const ActivityBanner = () => {
  return (
    <div className="w-full bg-white bg-opacity-70 rounded-xl p-4 shadow-md">
      <h3 className="font-bold text-lg">春季限定活动</h3>
      <p className="text-sm text-gray-700">收集樱花，装饰你的庄园！</p>
      <div className="mt-2 flex justify-end">
        <button className="btn btn-primary text-sm px-3 py-1">查看详情</button>
      </div>
    </div>
  );
};

// 功能入口组件
const FeatureEntry = ({ title, icon, href }: { title: string, icon: string, href: string }) => {
  return (
    <Link href={href} className="card flex flex-col items-center p-3 hover:shadow-lg transition-all">
      <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
      <span className="text-sm">{title}</span>
    </Link>
  );
};

export default function MainPage() {
  const [currentSeason, setCurrentSeason] = useState('spring');
  
  return (
    <div className={`min-h-screen pb-16 theme-${currentSeason}`}>
      {/* 顶部栏 */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full mr-2"></div>
          <div>
            <h2 className="font-bold">玩家名称</h2>
            <p className="text-xs">Lv.10</p>
          </div>
        </div>
        <ResourceDisplay />
      </header>
      
      {/* 主要内容 */}
      <main className="p-4 space-y-6">
        {/* 季节选择器 */}
        <SeasonSelector 
          currentSeason={currentSeason} 
          onSeasonChange={setCurrentSeason} 
        />
        
        {/* 活动横幅 */}
        <ActivityBanner />
        
        {/* 功能入口 */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <FeatureEntry title="每日任务" icon="task" href="/main/tasks" />
          <FeatureEntry title="活动" icon="event" href="/main/events" />
          <FeatureEntry title="邮件" icon="mail" href="/main/mail" />
          <FeatureEntry title="好友" icon="friends" href="/main/friends" />
        </div>
      </main>
      
      {/* 底部导航栏 */}
      <Navbar activePage="garden" />
    </div>
  );
}
