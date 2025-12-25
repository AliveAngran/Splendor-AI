
import React from 'react';
import { Player, GemType } from '../types';
import { GEM_COLORS } from '../constants';

interface Props {
  player: Player;
  isCurrent: boolean;
}

const PlayerDashboard: React.FC<Props> = ({ player, isCurrent }) => {
  return (
    <div className={`p-6 transition-colors ${isCurrent ? 'bg-red-50' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{player.isAI ? '机器' : '玩家'}</h4>
          <h2 className="text-2xl font-black italic uppercase leading-none">{player.name}</h2>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black italic">{player.score}</span>
          <span className="text-xs font-bold uppercase ml-1">分</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        {/* Gems Stash */}
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">宝石库存</h5>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(player.gems) as GemType[]).map(gem => (
              <div key={gem} className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: GEM_COLORS[gem] }}></div>
                <span className="text-xs font-bold">{player.gems[gem]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bonuses (Cards Owned) */}
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">奖励加成</h5>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(player.bonuses) as GemType[]).map(gem => (
              <div key={gem} className="flex items-center gap-1.5">
                <div className="w-4 h-4 border border-black/10" style={{ backgroundColor: GEM_COLORS[gem] }}></div>
                <span className="text-xs font-bold">{player.bonuses[gem] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">预留卡牌 ({player.reservedCards.length}/3)</h5>
          <div className="flex gap-2 flex-wrap">
              {player.reservedCards.map(card => (
                  <div key={card.id} className="w-24 bg-gray-50 border-2 border-black p-2">
                       {/* 卡牌顶部：分数和宝石类型 */}
                       <div className="flex justify-between items-center mb-2">
                           <span className="text-sm font-black italic">{card.points > 0 ? card.points : '-'}</span>
                           <div className="w-5 h-5 border border-black" style={{ backgroundColor: GEM_COLORS[card.gemType] }}></div>
                       </div>
                       {/* 卡牌费用 */}
                       <div className="space-y-1">
                           {Object.entries(card.cost).map(([gem, amt]) => (
                               <div key={gem} className="flex items-center gap-1">
                                   <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: GEM_COLORS[gem as GemType] }}></div>
                                   <span className="text-[10px] font-bold">{amt}</span>
                               </div>
                           ))}
                       </div>
                  </div>
              ))}
              {player.reservedCards.length === 0 && <span className="text-[10px] font-bold text-gray-300 italic">无</span>}
          </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;
