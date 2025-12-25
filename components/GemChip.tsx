
import React from 'react';
import { GemType } from '../types';
import { GEM_COLORS } from '../constants';

interface Props {
  type: GemType;
  count: number;
  onClick?: () => void;
  isSelected?: boolean;
}

const GemChip: React.FC<Props> = ({ type, count, onClick, isSelected }) => {
  const isGold = type === GemType.GOLD;

  return (
    <div 
      onClick={onClick}
      className={`
        w-16 h-16 rounded-full border-4 border-black flex flex-col items-center justify-center cursor-pointer select-none transition-all
        ${isSelected ? 'scale-110 shadow-[0_0_20px_rgba(0,0,0,0.3)]' : 'hover:scale-105'}
        ${count === 0 ? 'opacity-30 grayscale pointer-events-none' : ''}
      `}
      style={{ 
        backgroundColor: GEM_COLORS[type],
        color: type === GemType.BLACK ? 'white' : 'black'
      }}
    >
      <span className="text-xl font-black italic">{count}</span>
      <div className="w-6 h-0.5 bg-current opacity-30 mt-1"></div>
      <span className="text-[8px] font-black uppercase tracking-tighter mt-1">{type}</span>
      
      {isSelected && (
          <div className="absolute -top-1 -right-1 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              <span className="text-xs font-black">✓</span>
          </div>
      )}
    </div>
  );
};

(GemChip as any).COLORS = GEM_COLORS;

export default GemChip;
