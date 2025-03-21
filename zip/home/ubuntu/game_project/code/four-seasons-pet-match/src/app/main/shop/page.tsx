'use client';

import { useState } from 'react';
import Link from 'next/link';

// 商品卡片组件
const ProductCard = ({ 
  product, 
  onBuy 
}: { 
  product: {
    id: string;
    name: string;
    description: string;
    price: { type: string; amount: number };
    image: string;
    limited?: boolean;
    discount?: number;
  }, 
  onBuy: () => void 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 商品图片 */}
      <div className="w-full h-24 bg-gray-100 flex items-center justify-center relative">
        {/* 实际开发中替换为真实图片 */}
        <span className="text-3xl">{product.image}</span>
        
        {/* 限时标签 */}
        {product.limited && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">
            限时
          </div>
        )}
        
        {/* 折扣标签 */}
        {product.discount && (
          <div className="absolute bottom-0 left-0 bg-orange-500 text-white text-xs px-2 py-1">
            {product.discount}折
          </div>
        )}
      </div>
      
      {/* 商品信息 */}
      <div className="p-2">
        <h3 className="font-medium text-sm">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-1 ${
              product.price.type === 'gold' 
                ? 'bg-yellow-400' 
                : product.price.type === 'diamond' 
                  ? 'bg-blue-400' 
                  : 'bg-green-400'
            }`}></div>
            <span className="text-sm font-medium">{product.price.amount}</span>
          </div>
          <button 
            className="btn bg-primary text-xs px-3 py-1"
            onClick={onBuy}
          >
            购买
          </button>
        </div>
      </div>
    </div>
  );
};

// 商品分类标签组件
const CategoryTabs = ({ 
  currentCategory, 
  onCategoryChange 
}: { 
  currentCategory: string, 
  onCategoryChange: (category: string) => void 
}) => {
  const categories = [
    { id: 'resources', label: '资源' },
    { id: 'items', label: '道具' },
    { id: 'pets', label: '萌宠' },
    { id: 'decorations', label: '装饰' },
    { id: 'limited', label: '限时' },
  ];

  return (
    <div className="flex bg-white bg-opacity-70 rounded-lg p-1 mb-4">
      {categories.map(category => (
        <button
          key={category.id}
          className={`flex-1 py-1 text-sm rounded ${
            currentCategory === category.id
              ? 'bg-primary text-white'
              : 'text-gray-700'
          }`}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

// 广告横幅组件
const AdBanner = ({ 
  title, 
  description, 
  onClick 
}: { 
  title: string, 
  description: string, 
  onClick: () => void 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-3 mb-4 text-white">
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm mb-2">{description}</p>
      <button 
        className="bg-white text-blue-500 text-sm px-3 py-1 rounded-full"
        onClick={onClick}
      >
        查看详情
      </button>
    </div>
  );
};

export default function ShopPage() {
  const [currentCategory, setCurrentCategory] = useState('resources');
  
  // 模拟商品数据
  const products = {
    resources: [
      { 
        id: 'r1', 
        name: '金币礼包', 
        description: '获得1000金币', 
        price: { type: 'rmb', amount: 6 }, 
        image: '💰' 
      },
      { 
        id: 'r2', 
        name: '钻石礼包', 
        description: '获得100钻石', 
        price: { type: 'rmb', amount: 30 }, 
        image: '💎' 
      },
      { 
        id: 'r3', 
        name: '体力礼包', 
        description: '获得20体力', 
        price: { type: 'rmb', amount: 12 }, 
        image: '⚡' 
      },
      { 
        id: 'r4', 
        name: '超值礼包', 
        description: '金币、钻石、体力各种资源', 
        price: { type: 'rmb', amount: 68 }, 
        image: '🎁',
        discount: 7
      },
    ],
    items: [
      { 
        id: 'i1', 
        name: '行消除', 
        description: '消除一整行元素', 
        price: { type: 'gold', amount: 100 }, 
        image: '🔨' 
      },
      { 
        id: 'i2', 
        name: '爆炸道具', 
        description: '消除周围3x3范围内的元素', 
        price: { type: 'gold', amount: 150 }, 
        image: '🧨' 
      },
      { 
        id: 'i3', 
        name: '彩虹道具', 
        description: '消除所有同类型元素', 
        price: { type: 'gold', amount: 200 }, 
        image: '🌈' 
      },
      { 
        id: 'i4', 
        name: '时间增加', 
        description: '增加10秒游戏时间', 
        price: { type: 'diamond', amount: 5 }, 
        image: '⏱️' 
      },
    ],
    pets: [
      { 
        id: 'p1', 
        name: '小鹿', 
        description: '春季萌宠，技能：连接两个元素', 
        price: { type: 'diamond', amount: 100 }, 
        image: '🦌' 
      },
      { 
        id: 'p2', 
        name: '海豚', 
        description: '夏季萌宠，技能：清除底部元素', 
        price: { type: 'diamond', amount: 100 }, 
        image: '🐬' 
      },
      { 
        id: 'p3', 
        name: '松鼠', 
        description: '秋季萌宠，技能：收集指定元素', 
        price: { type: 'diamond', amount: 100 }, 
        image: '🐿️' 
      },
      { 
        id: 'p4', 
        name: '雪狐', 
        description: '冬季萌宠，技能：改变元素类型', 
        price: { type: 'diamond', amount: 100 }, 
        image: '🦊' 
      },
    ],
    decorations: [
      { 
        id: 'd1', 
        name: '豪华主屋', 
        description: '提升庄园等级上限', 
        price: { type: 'gold', amount: 1000 }, 
        image: '🏠' 
      },
      { 
        id: 'd2', 
        name: '喷泉', 
        description: '增加庄园美观度', 
        price: { type: 'gold', amount: 500 }, 
        image: '⛲' 
      },
      { 
        id: 'd3', 
        name: '花园', 
        description: '增加金币产出', 
        price: { type: 'gold', amount: 300 }, 
        image: '🌷' 
      },
      { 
        id: 'd4', 
        name: '果园', 
        description: '增加体力恢复速度', 
        price: { type: 'gold', amount: 300 }, 
        image: '🍎' 
      },
    ],
    limited: [
      { 
        id: 'l1', 
        name: '春节装饰包', 
        description: '限时春节主题装饰', 
        price: { type: 'diamond', amount: 50 }, 
        image: '🧧',
        limited: true
      },
      { 
        id: 'l2', 
        name: '花仙子', 
        description: '限时春季萌宠', 
        price: { type: 'diamond', amount: 200 }, 
        image: '🧚',
        limited: true
      },
      { 
        id: 'l3', 
        name: '超值道具包', 
        description: '各种道具打包特惠', 
        price: { type: 'gold', amount: 500 }, 
        image: '📦',
        limited: true,
        discount: 5
      },
    ]
  };
  
  const handleBuy = (product: any) => {
    alert(`购买 ${product.name}`);
  };
  
  const handleAdClick = () => {
    alert('查看广告详情');
  };
  
  return (
    <div className="min-h-screen pb-16 theme-spring">
      {/* 顶部栏 */}
      <header className="p-4 flex justify-between items-center">
        <Link href="/main" className="btn bg-white bg-opacity-70 text-gray-800 px-3 py-1">
          返回
        </Link>
        <h1 className="font-bold">商店</h1>
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
      
      {/* 广告横幅 */}
      <div className="px-4">
        <AdBanner 
          title="春季特惠活动" 
          description="限时7折，多种春季主题道具和萌宠" 
          onClick={handleAdClick} 
        />
      </div>
      
      {/* 分类标签 */}
      <div className="px-4">
        <CategoryTabs 
          currentCategory={currentCategory} 
          onCategoryChange={setCurrentCategory} 
        />
      </div>
      
      {/* 商品列表 */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {products[currentCategory as keyof typeof products].map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onBuy={() => handleBuy(product)}
            />
          ))}
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
        <Link href="/main/pets" className="navbar-item text-gray-500">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
          <span className="text-xs">萌宠</span>
        </Link>
        <Link href="/main/shop" className="navbar-item text-primary font-bold">
          <div className="navbar-icon">
            <div className="w-6 h-6 rounded-full bg-primary"></div>
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
