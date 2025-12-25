
import React, { useState } from 'react';
import { GameState, Action, GemType, Card as CardType } from '../types';
import Card from './Card';
import GemChip from './GemChip';

interface Props {
  state: GameState;
  onAction: (action: Action) => void;
  disabled: boolean;
}

const Board: React.FC<Props> = ({ state, onAction, disabled }) => {
  const [selectedGems, setSelectedGems] = useState<GemType[]>([]);

  const handleGemClick = (gem: GemType) => {
    if (disabled || gem === GemType.GOLD) return;
    
    let newSelection = [...selectedGems];
    if (newSelection.includes(gem)) {
        newSelection = newSelection.filter(g => g !== gem);
    } else {
        // 最多选择 3 个不同的宝石
        if (newSelection.length < 3) {
            newSelection.push(gem);
        }
    }
    
    setSelectedGems(newSelection);
  };

  const handleTwoSame = (gem: GemType) => {
    if (disabled || state.board.bank[gem] < 4) return;
    // 选择 2 个相同的宝石，也需要确认
    setSelectedGems([gem, gem]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Cards Display */}
      <div className="lg:col-span-3 space-y-8">
        {[3, 2, 1].map((level) => {
            const cards = state.board[`level${level}` as keyof typeof state.board] as CardType[];
            const deckCount = (state.board[`deck${level}` as keyof typeof state.board] as CardType[])?.length || 0;
            return (
                <div key={level} className="flex gap-4 items-center">
                    <div className="w-16 h-24 bg-black text-white flex flex-col items-center justify-center border-2 border-black flex-shrink-0">
                        <span className="text-3xl font-black italic">T{level}</span>
                        <div className="w-1/2 h-0.5 bg-white/30 my-1"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">剩余 {deckCount}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                        {cards.map(card => (
                            <Card 
                                key={card.id} 
                                card={card} 
                                onClick={() => onAction({ type: 'BUY_CARD', cardId: card.id, fromBoard: true })}
                                onReserve={() => onAction({ type: 'RESERVE_CARD', cardId: card.id, level: card.level })}
                                affordable={!disabled} // Simplified affordance check for UI
                            />
                        ))}
                    </div>
                </div>
            )
        })}
      </div>

      {/* Bank & Nobles */}
      <div className="space-y-8">
        <div className="bg-white border-2 border-black p-6">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 pb-2 border-b-2 border-black">宝石银行</h3>
            <div className="grid grid-cols-2 gap-4">
                {(Object.keys(state.board.bank) as GemType[]).map(gem => (
                    <div key={gem} className="flex flex-col items-center group relative">
                        <GemChip 
                            type={gem} 
                            count={state.board.bank[gem]} 
                            isSelected={selectedGems.includes(gem)}
                            onClick={() => handleGemClick(gem)}
                        />
                        {gem !== GemType.GOLD && state.board.bank[gem] >= 4 && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleTwoSame(gem); }}
                                className="mt-2 text-[10px] font-black uppercase bg-black text-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                拿2个
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {selectedGems.length > 0 && (
                 <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300">
                    <p className="text-xs text-gray-500 mb-2">
                        {selectedGems.length === 2 && selectedGems[0] === selectedGems[1] 
                            ? `已选择 2 个 ${selectedGems[0]} 宝石` 
                            : `已选择: ${selectedGems.join('、')}`}
                    </p>
                    <button 
                        onClick={() => { onAction({ type: 'TAKE_GEMS', gems: selectedGems }); setSelectedGems([]); }}
                        className="w-full bg-black text-white py-2 font-bold uppercase italic"
                    >
                        确认拿取
                    </button>
                    <button 
                        onClick={() => setSelectedGems([])}
                        className="w-full mt-2 border-2 border-gray-300 text-gray-500 py-2 font-bold uppercase"
                    >
                        取消
                    </button>
                 </div>
            )}
        </div>

        <div className="bg-white border-2 border-black p-6">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 pb-2 border-b-2 border-black">贵族</h3>
            <div className="space-y-4">
                {state.board.nobles.map(noble => (
                    <div key={noble.id} className="border-2 border-gray-200 p-3 flex gap-4 items-center">
                        <div className="w-12 h-12 bg-gray-100 border-2 border-black flex items-center justify-center font-black text-xl italic">
                            {noble.points}
                        </div>
                        <div className="flex gap-2">
                            {Object.entries(noble.cost).map(([gem, amt]) => (
                                <div key={gem} className="text-center">
                                    <div className="w-6 h-6 rounded-sm border border-black mb-1" style={{ backgroundColor: (GemChip as any).COLORS[gem] || '#000' }}></div>
                                    <span className="text-[10px] font-bold">{amt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
