'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 游戏元素组件
const GameElement = ({ type, onClick }: { type: string, onClick: () => void }) => {
  // 根据元素类型返回不同的样式和图标
  const getElementStyle = () => {
    switch (type) {
      case 'flower':
        return 'bg-pink-200';
      case 'apple':
        return 'bg-red-200';
      case 'leaf':
        return 'bg-green-200';
      case 'star':
        return 'bg-yellow-200';
      case 'special':
        return 'bg-purple-200';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div 
      className={`game-element ${getElementStyle()}`}
      onClick={onClick}
    >
      {/* 实际开发中替换为真实图标或图片 */}
      <span>{type.charAt(0).toUpperCase()}</span>
    </div>
  );
};

// 游戏棋盘组件
const GameBoard = ({ size = 7 }: { size?: number }) => {
  const elementTypes = ['flower', 'apple', 'leaf', 'star'];
  const [board, setBoard] = useState<string[][]>([]);
  const [selectedElement, setSelectedElement] = useState<{row: number, col: number} | null>(null);

  // 初始化游戏棋盘
  useEffect(() => {
    const newBoard = Array(size).fill(0).map(() => 
      Array(size).fill(0).map(() => 
        elementTypes[Math.floor(Math.random() * elementTypes.length)]
      )
    );
    setBoard(newBoard);
  }, [size]);

  // 处理元素点击
  const handleElementClick = (row: number, col: number) => {
    if (selectedElement) {
      // 检查是否相邻
      const isAdjacent = 
        (Math.abs(selectedElement.row - row) === 1 && selectedElement.col === col) ||
        (Math.abs(selectedElement.col - col) === 1 && selectedElement.row === row);
      
      if (isAdjacent) {
        // 交换元素
        const newBoard = [...board];
        const temp = newBoard[selectedElement.row][selectedElement.col];
        newBoard[selectedElement.row][selectedElement.col] = newBoard[row][col];
        newBoard[row][col] = temp;
        setBoard(newBoard);
        setSelectedElement(null);
        
        // 实际游戏中，这里需要检查是否有可消除的元素
      } else {
        // 如果不相邻，则选择新元素
        setSelectedElement({ row, col });
      }
    } else {
      setSelectedElement({ row, col });
    }
  };

  return (
    <div 
      className="game-board"
      style={{ 
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`
      }}
    >
      {board.map((row, rowIndex) => 
        row.map((element, colIndex) => (
          <GameElement 
            key={`${rowIndex}-${colIndex}`}
            type={element}
            onClick={() => handleElementClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

// 游戏目标组件
const GameObjective = ({ objective, progress }: { objective: string, progress: number }) => {
  return (
    <div className="bg-white bg-opacity-80 rounded-lg p-2 flex items-center justify-between">
      <span className="text-sm font-medium">{objective}</span>
      <span className="text-sm">{progress}</span>
    </div>
  );
};

// 游戏道具组件
const GameTools = () => {
  const tools = [
    { id: 'hammer', name: '锤子', available: 2 },
    { id: 'bomb', name: '炸弹', available: 1 },
    { id: 'rainbow', name: '彩虹', available: 0 },
  ];

  return (
    <div className="flex space-x-2">
      {tools.map(tool => (
        <button 
          key={tool.id}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            tool.available > 0 ? 'bg-white' : 'bg-gray-300'
          }`}
          disabled={tool.available === 0}
        >
          <span className="text-xs">{tool.name}</span>
        </button>
      ))}
    </div>
  );
};

// 萌宠技能组件
const PetSkill = ({ pet, onUse }: { pet: { name: string, skill: string }, onUse: () => void }) => {
  const [cooldown, setCooldown] = useState(false);

  const handleUse = () => {
    if (!cooldown) {
      onUse();
      setCooldown(true);
      setTimeout(() => setCooldown(false), 10000); // 10秒冷却时间
    }
  };

  return (
    <button 
      className={`flex items-center space-x-2 bg-white rounded-lg p-2 ${
        cooldown ? 'opacity-50' : ''
      }`}
      onClick={handleUse}
      disabled={cooldown}
    >
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="text-left">
        <p className="text-sm font-medium">{pet.name}</p>
        <p className="text-xs text-gray-600">{pet.skill}</p>
      </div>
    </button>
  );
};

export default function GamePage() {
  const [remainingSteps, setRemainingSteps] = useState(15);
  const [score, setScore] = useState(0);
  
  return (
    <div className="min-h-screen theme-spring flex flex-col">
      {/* 顶部游戏信息 */}
      <header className="p-4 flex justify-between items-center">
        <button className="btn bg-white bg-opacity-70 text-gray-800 px-3 py-1">
          暂停
        </button>
        <GameObjective objective="收集20朵花" progress={5} />
        <div className="bg-white bg-opacity-80 rounded-lg px-3 py-1">
          <span className="text-sm font-medium">步数: {remainingSteps}</span>
        </div>
      </header>
      
      {/* 分数显示 */}
      <div className="px-4 mb-2">
        <div className="bg-white bg-opacity-70 rounded-lg p-2 text-center">
          <span className="font-bold">得分: {score}</span>
        </div>
      </div>
      
      {/* 游戏棋盘 */}
      <div className="flex-1 px-4 flex items-center justify-center">
        <GameBoard />
      </div>
      
      {/* 底部工具栏 */}
      <footer className="p-4 flex justify-between items-center">
        <GameTools />
        <PetSkill 
          pet={{ name: '小兔子', skill: '生成胡萝卜' }}
          onUse={() => console.log('使用萌宠技能')}
        />
      </footer>
    </div>
  );
}
