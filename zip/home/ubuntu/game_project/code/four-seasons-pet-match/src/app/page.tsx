'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StartPage() {
  const [loading, setLoading] = useState(true);
  const [currentSeason, setCurrentSeason] = useState('spring');
  
  // 模拟加载过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 季节背景轮换效果
  useEffect(() => {
    if (!loading) {
      const seasons = ['spring', 'summer', 'autumn', 'winter'];
      let currentIndex = 0;
      
      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % seasons.length;
        setCurrentSeason(seasons[currentIndex]);
      }, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [loading]);
  
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 theme-${currentSeason}`}>
      {loading ? (
        <div className="loading animate-fadeIn">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-white">正在加载游戏资源...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-md animate-fadeIn">
          <div className="w-64 h-64 relative mb-8 animate-pulse">
            {/* 游戏Logo占位，实际开发中替换为真实Logo */}
            <div className="w-full h-full bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <h1 className="text-3xl font-bold text-white text-center">四季萌宠消消乐</h1>
            </div>
          </div>
          
          <div className="w-full space-y-4">
            <Link href="/main" className="btn btn-primary w-full flex justify-center items-center py-3">
              开始游戏
            </Link>
            
            <div className="flex space-x-4">
              <button className="btn btn-secondary flex-1 py-3">微信登录</button>
              <button className="btn btn-secondary flex-1 py-3">抖音登录</button>
            </div>
            
            <button className="btn w-full bg-white bg-opacity-20 text-white py-3">
              游客模式
            </button>
            
            <button className="mt-8 text-white underline">
              设置
            </button>
          </div>
          
          <div className="mt-8 text-white text-sm">
            版本: 1.0.0
          </div>
        </div>
      )}
    </div>
  );
}
