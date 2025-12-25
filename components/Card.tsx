
import React from 'react';
import { Card as CardType, GemType } from '../types';
import { GEM_COLORS } from '../constants';

interface Props {
  card: CardType;
  onClick: () => void;
  onReserve: () => void;
  affordable: boolean;
}

const Card: React.FC<Props> = ({ card, onClick, onReserve, affordable }) => {
  return (
    <div className="bg-white border-2 border-black p-2 group relative hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
      {/* Top Bar: Points & Bonus */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-2xl font-black italic">{card.points > 0 ? card.points : ''}</span>
        <div 
          className="w-8 h-8 border-2 border-black" 
          style={{ backgroundColor: GEM_COLORS[card.gemType] }}
        ></div>
      </div>

      {/* Main Illustration Area (Stylized) */}
      <div className="h-20 bg-gray-50 border-2 border-gray-100 mb-6 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex flex-wrap gap-1 p-1">
            {Array.from({length: 12}).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: GEM_COLORS[card.gemType] }}></div>
            ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">等级 {card.level}</span>
      </div>

      {/* Costs Area */}
      <div className="space-y-1">
        {Object.entries(card.cost).map(([gem, amt]) => (
            <div key={gem} className="flex items-center gap-2">
                <div 
                    className="w-5 h-5 rounded-full border border-black/20" 
                    style={{ backgroundColor: GEM_COLORS[gem as GemType] }}
                ></div>
                <span className="text-sm font-black">{amt}</span>
            </div>
        ))}
      </div>

      {/* Actions Overlay */}
      <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="w-full bg-white text-black py-2 text-xs font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-colors"
        >
          购买
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onReserve(); }}
          className="w-full border-2 border-white text-white py-2 text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors"
        >
          预留
        </button>
      </div>
    </div>
  );
};

export default Card;
