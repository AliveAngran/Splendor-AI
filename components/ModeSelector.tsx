import React from 'react';

interface Props {
  onStart: (mode: 'PvAI' | 'AIvAI', difficulty: 'SIMPLE' | 'NORMAL' | 'HARD') => void;
}

// 宝石颜色配置 - 璀璨宝石五色
const GEM_PALETTE = {
  white: { bg: '#F8FAFC', text: '#000000', border: '#E2E8F0', name: '钻石' },
  blue: { bg: '#2563EB', text: '#FFFFFF', border: '#1D4ED8', name: '蓝宝石' },
  green: { bg: '#16A34A', text: '#FFFFFF', border: '#15803D', name: '祖母绿' },
  red: { bg: '#DC2626', text: '#FFFFFF', border: '#B91C1C', name: '红宝石' },
  black: { bg: '#18181B', text: '#FFFFFF', border: '#000000', name: '缟玛瑙' },
};

const ModeSelector: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col overflow-hidden relative">
      {/* 背景纹理 - 网格图案 */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* 顶部宝石装饰条 */}
      <div className="flex h-2">
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.white.bg, borderBottom: '1px solid #000' }} />
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.blue.bg }} />
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.green.bg }} />
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.red.bg }} />
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.black.bg }} />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* 左侧主区域 */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
          {/* 标题区 */}
          <div>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-8">
              璀璨<br/>宝石
            </h1>
            
            <p className="text-lg md:text-xl font-medium max-w-md leading-relaxed text-gray-600">
              成为文艺复兴时期最富有的宝石商人。<br/>
              收集宝石，购买矿脉，赢得贵族青睐。
            </p>
          </div>

          {/* 五种宝石 - 大尺寸展示 */}
          <div className="mt-12 lg:mt-0">
            <div className="flex gap-4 flex-wrap">
              {Object.entries(GEM_PALETTE).map(([key, gem]) => (
                <div 
                  key={key}
                  className="group flex flex-col items-center gap-3 p-6 border-4 border-black hover:scale-105 transition-transform cursor-default"
                  style={{ backgroundColor: gem.bg, color: gem.text }}
                >
                  <div 
                    className="w-10 h-10 rotate-45"
                    style={{ 
                      backgroundColor: gem.text,
                      opacity: 0.25
                    }}
                  />
                  <span className="text-sm font-black uppercase tracking-wider">{gem.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧操作区 */}
        <div className="lg:w-[480px] bg-black text-white p-8 md:p-12 flex flex-col justify-center relative">
          {/* 装饰性宝石图案 */}
          <div className="absolute top-8 right-8 opacity-10">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <polygon points="60,10 110,40 110,80 60,110 10,80 10,40" fill="none" stroke="white" strokeWidth="2"/>
              <polygon points="60,25 95,45 95,75 60,95 25,75 25,45" fill="none" stroke="white" strokeWidth="1"/>
              <line x1="60" y1="10" x2="60" y2="110" stroke="white" strokeWidth="1"/>
              <line x1="10" y1="40" x2="110" y2="80" stroke="white" strokeWidth="1"/>
              <line x1="110" y1="40" x2="10" y2="80" stroke="white" strokeWidth="1"/>
            </svg>
          </div>

          <div className="space-y-4">
            {/* 人机对战按钮 */}
            <button 
              onClick={() => onStart('PvAI', 'NORMAL')}
              className="w-full text-left p-6 border-4 border-white bg-transparent hover:bg-[#DC2626] hover:border-[#DC2626] transition-all duration-200 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl md:text-4xl font-black uppercase block mb-2 group-hover:translate-x-2 transition-transform">
                    挑战 AI
                  </span>
                  <span className="text-sm font-medium opacity-60 uppercase tracking-widest">
                    人机对战
                  </span>
                </div>
                <div className="text-5xl font-black opacity-20 group-hover:opacity-40 transition-opacity">
                  →
                </div>
              </div>
              {/* 悬停时的宝石装饰 */}
              <div className="absolute -bottom-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-3 h-3 rotate-45 bg-white/30" />
                <div className="w-3 h-3 rotate-45 bg-white/20" />
                <div className="w-3 h-3 rotate-45 bg-white/10" />
              </div>
            </button>

            {/* AI对战按钮 */}
            <button 
              onClick={() => onStart('AIvAI', 'NORMAL')}
              className="w-full text-left p-6 border-2 border-white/30 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all duration-200 group relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl md:text-4xl font-black uppercase block mb-2 group-hover:translate-x-2 transition-transform">
                    观战模式
                  </span>
                  <span className="text-sm font-medium opacity-60 uppercase tracking-widest group-hover:opacity-80">
                    AI 对战
                  </span>
                </div>
                <div className="text-5xl font-black opacity-20 group-hover:opacity-40 transition-opacity">
                  ∞
                </div>
              </div>
            </button>
          </div>

          {/* 底部信息 */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-xs uppercase tracking-widest opacity-40">
              基于 ONNX 神经网络 · 深度学习驱动
            </p>
          </div>
        </div>
      </div>

      {/* 底部装饰 - 抽象宝石几何图形 */}
      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 128" preserveAspectRatio="none">
          <polygon points="100,128 130,80 160,128" fill={GEM_PALETTE.white.bg} stroke="#000" strokeWidth="1" opacity="0.3"/>
          <polygon points="250,128 290,60 330,128" fill={GEM_PALETTE.blue.bg} opacity="0.2"/>
          <polygon points="450,128 480,90 510,128" fill={GEM_PALETTE.green.bg} opacity="0.25"/>
          <polygon points="600,128 650,50 700,128" fill={GEM_PALETTE.red.bg} opacity="0.15"/>
          <polygon points="850,128 880,70 910,128" fill={GEM_PALETTE.black.bg} opacity="0.1"/>
          <line x1="0" y1="127" x2="1200" y2="127" stroke="#000" strokeWidth="2"/>
        </svg>
      </div>

      {/* 移动端底部宝石装饰 */}
      <div className="lg:hidden flex h-1">
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.white.bg }} />
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.blue.bg }} />
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.green.bg }} />
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.red.bg }} />
        <div className="flex-1" style={{ backgroundColor: GEM_PALETTE.black.bg }} />
      </div>
    </div>
  );
};

export default ModeSelector;
