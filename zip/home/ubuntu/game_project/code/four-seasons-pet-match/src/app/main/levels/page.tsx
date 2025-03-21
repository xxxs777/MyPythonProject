'use client';

import { useState } from 'react';
import Link from 'next/link';

// 关卡节点组件
const LevelNode = ({ 
  level, 
  status, 
  stars = 0,
  onClick 
}: { 
  level: number, 
  status: 'locked' | 'available' | 'completed', 
  stars?: number,
  onClick: () => void 
}) => {
  return (
    <button 
      className={`w-16 h-16 rounded-full flex items-center justify-center ${
        status === 'locked' 
          ? 'bg-gray-300 cursor-not-allowed' 
          : status === 'completed'
            ? 'bg-green-100 border-2 border-green-500'
            : 'bg-white border-2 border-primary animate-pulse'
      }`}
      onClick={onClick}
      disabled={status === 'locked'}
    >
      {status === 'locked' ? (
        <span className="text-gray-500">🔒</span>
      ) : (
        <div className="flex flex-col items-center">
          <span className="font-bold">{level}</span>
          {status === 'completed' && (
            <div className="flex mt-1">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={i < stars ? "text-yellow-500" : "text-gray-300"}>★</span>
              ))}
            </div>
          )}
        </div>
      )}
    </button>
  );
};

// 章节标题组件
const ChapterTitle = ({ title, season }: { title: string, season: string }) => {
  return (
    <div className={`bg-white bg-opacity-80 rounded-lg p-2 mb-4 border-l-4 border-${season}-primary`}>
      <h2 className="font-bold">{title}</h2>
    </div>
  );
};

export default function LevelsPage() {
  const [currentSeason, setCurrentSeason] = useState('spring');
  const [currentChapter, setCurrentChapter] = useState(1);
  
  // 模拟关卡数据
  const chapters = [
    {
      id: 1,
      title: '春季花园 第1章',
      season: 'spring',
      levels: [
        { id: 1, status: 'completed', stars: 3 },
        { id: 2, status: 'completed', stars: 2 },
        { id: 3, status: 'completed', stars: 3 },
        { id: 4, status: 'completed', stars: 1 },
        { id: 5, status: 'available', stars: 0 },
        { id: 6, status: 'locked', stars: 0 },
        { id: 7, status: 'locked', stars: 0 },
        { id: 8, status: 'locked', stars: 0 },
        { id: 9, status: 'locked', stars: 0 },
      ]
    },
    {
      id: 2,
      title: '春季花园 第2章',
      season: 'spring',
      levels: Array(9).fill(0).map((_, i) => ({ 
        id: i + 10, 
        status: 'locked', 
        stars: 0 
      }))
    }
  ];
  
  const handleLevelClick = (level: any) => {
    if (level.status !== 'locked') {
      // 实际开发中，这里应该导航到具体的关卡
      window.location.href = '/main/levels/game';
    }
  };
  
  const handleChapterChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else if (direction === 'next' && currentChapter < chapters.length) {
      setCurrentChapter(currentChapter + 1);
    }
  };
  
  const currentChapterData = chapters.find(c => c.id === currentChapter) || chapters[0];
  
  return (
    <div className={`min-h-screen pb-16 theme-${currentSeason}`}>
      {/* 顶部栏 */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/main" className="btn bg-white bg-opacity-70 text-gray-800 px-3 py-1">
          返回
        </Link>
        <ChapterTitle 
          title={currentChapterData.title} 
          season={currentChapterData.season} 
        />
        <div className="flex space-x-2">
          <div className="resource-display">
            <div className="resource-icon bg-red-400 rounded-full"></div>
            <span>10/20</span>
          </div>
        </div>
      </header>
      
      {/* 关卡地图 */}
      <div className="p-4">
        <div className="relative bg-white bg-opacity-30 rounded-xl p-6">
          {/* 章节导航 */}
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
            <button 
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
              onClick={() => handleChapterChange('prev')}
              disabled={currentChapter === 1}
            >
              &lt;
            </button>
          </div>
          <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
            <button 
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center"
              onClick={() => handleChapterChange('next')}
              disabled={currentChapter === chapters.length}
            >
              &gt;
            </button>
          </div>
          
          {/* 关卡路径 */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xs">
              {/* 这里使用简化的路径，实际开发中可以使用SVG路径或更复杂的布局 */}
              <div className="flex flex-col items-center space-y-4">
                {currentChapterData.levels.slice(0, 3).map(level => (
                  <LevelNode 
                    key={level.id}
                    level={level.id}
                    status={level.status as any}
                    stars={level.stars}
                    onClick={() => handleLevelClick(level)}
                  />
                ))}
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex flex-col items-center space-y-4">
                  {currentChapterData.levels.slice(3, 5).map(level => (
                    <LevelNode 
                      key={level.id}
                      level={level.id}
                      status={level.status as any}
                      stars={level.stars}
                      onClick={() => handleLevelClick(level)}
                    />
                  ))}
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  {currentChapterData.levels.slice(5, 9).map(level => (
                    <LevelNode 
                      key={level.id}
                      level={level.id}
                      status={level.status as any}
                      stars={level.stars}
                      onClick={() => handleLevelClick(level)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 底部导航栏 */}
      <nav className="navbar">
        <Link href="/main/levels" className="navbar-item text-primary font-bold">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-primary"></div>
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
