
import React, { useState } from 'react';

interface Props {
  onStart: (mode: 'PvAI' | 'AIvAI', difficulty: 'SIMPLE' | 'NORMAL' | 'HARD') => void;
}

const ModeSelector: React.FC<Props> = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState<'SIMPLE' | 'NORMAL' | 'HARD'>('NORMAL');

  return (
    <div className="min-h-screen bg-[#D52B1E] flex flex-col p-8 md:p-16 text-white overflow-hidden relative">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-1">
        <div className="mb-20">
          <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter uppercase leading-none mb-4">
            璀璨宝石<br/>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mt-auto">
          {/* Difficulty Selector */}
          <div className="bg-black p-8 border-l-8 border-white">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-60">策略难度</h3>
            <div className="flex gap-4">
              {(['SIMPLE', 'NORMAL', 'HARD'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all border-2 ${difficulty === d ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white hover:bg-white/10'}`}
                >
                  {d === 'SIMPLE' ? '简单' : d === 'NORMAL' ? '普通' : '困难'}
                </button>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-400">
              {difficulty === 'SIMPLE' && "AI 专注于即时收益，适合新手入门。"}
              {difficulty === 'NORMAL' && "平衡策略，由 Gemini 引导长期规划。"}
              {difficulty === 'HARD' && "启用完整推理能力，准备迎接激烈竞争。"}
            </p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={() => onStart('PvAI', difficulty)}
              className="w-full bg-white text-[#D52B1E] p-8 text-left hover:bg-black hover:text-white transition-all group relative overflow-hidden"
            >
              <span className="text-4xl font-black uppercase italic block group-hover:translate-x-2 transition-transform">挑战 AI</span>
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest mt-2 block">人机对战</span>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 text-6xl font-black">→</div>
            </button>

            <button 
              onClick={() => onStart('AIvAI', difficulty)}
              className="w-full border-4 border-white text-white p-8 text-left hover:bg-white hover:text-black transition-all group relative overflow-hidden"
            >
              <span className="text-4xl font-black uppercase italic block group-hover:translate-x-2 transition-transform">观战模式</span>
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest mt-2 block">AI 对战表演赛</span>
              <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 text-6xl font-black">∞</div>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Swiss elements */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-black opacity-10 rounded-full"></div>
      <div className="absolute top-1/2 -left-10 w-20 h-96 bg-white opacity-5"></div>
    </div>
  );
};

export default ModeSelector;
