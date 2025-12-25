import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Action, Player } from './types';
import { createInitialState, executeAction } from './gameLogic';
import { getONNXAIMove, initONNXModel } from './onnxAIService';
import Board from './components/Board';
import ModeSelector from './components/ModeSelector';
import Sidebar from './components/Sidebar';
import PlayerDashboard from './components/PlayerDashboard';

// 宝石颜色配置
const GEM_ACCENT = {
  primary: '#DC2626', // 红宝石色作为主强调色
  secondary: '#2563EB', // 蓝宝石色
};

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [turnCount, setTurnCount] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [aiSpeed, setAiSpeed] = useState(0.5); // 默认0.5秒
  const processingRef = useRef(false);
  const pausedRef = useRef(false);

  // 同步 pausedRef
  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  // 预加载 ONNX 模型
  useEffect(() => {
    initONNXModel();
  }, []);

  const startNewGame = (mode: 'PvAI' | 'AIvAI', difficulty: 'SIMPLE' | 'NORMAL' | 'HARD') => {
    setState(createInitialState(mode, difficulty));
    setIsProcessing(false);
    setTurnCount(1);
    setIsPaused(false);
    processingRef.current = false;
  };

  const handleAction = useCallback((action: Action) => {
    if (!state || state.phase !== 'PLAYING') return;
    
    const nextState = executeAction(state, action);
    setState(nextState);
    setTurnCount(prev => prev + 1);
  }, [state]);

  useEffect(() => {
    if (!state || state.phase !== 'PLAYING') return;
    if (!state.players[state.currentPlayerIndex].isAI) return;
    if (processingRef.current) return;
    if (pausedRef.current) return;

    const triggerAI = async () => {
      processingRef.current = true;
      setIsProcessing(true);
      
      // 使用用户设置的速度
      await new Promise(r => setTimeout(r, aiSpeed * 1000));
      
      // 检查是否在等待期间被暂停
      if (pausedRef.current) {
        processingRef.current = false;
        setIsProcessing(false);
        return;
      }
      
      try {
        const move = await getONNXAIMove(state);
        console.log('AI 决策:', move);
        
        if (move) {
          const nextState = executeAction(state, move);
          setState(nextState);
          setTurnCount(prev => prev + 1);
        } else {
          console.error('AI 无法决策，跳过回合');
          setState((prev: GameState | null) => prev ? {
            ...prev,
            currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
            logs: ['AI 无法行动，跳过回合', ...prev.logs]
          } : null);
        }
      } catch (error) {
        console.error('AI 执行错误:', error);
      } finally {
        processingRef.current = false;
        setIsProcessing(false);
      }
    };
    
    triggerAI();
  }, [state, aiSpeed, isPaused]);

  // 暂停后恢复时重新触发AI
  useEffect(() => {
    if (!isPaused && state && state.phase === 'PLAYING' && state.players[state.currentPlayerIndex].isAI && !processingRef.current) {
      // 触发重新渲染以启动AI
      setState(s => s ? { ...s } : null);
    }
  }, [isPaused]);

  if (!state) {
    return <ModeSelector onStart={startNewGame} />;
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  const isAIvAI = state.gameMode === 'AIvAI';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFA] relative">
      {/* 背景网格纹理 */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      />

      {/* 顶部宝石色条 */}
      <div className="absolute top-0 left-0 right-0 flex h-1 z-50">
        <div className="flex-1 bg-[#F8FAFC] border-b border-black/10" />
        <div className="flex-1 bg-[#2563EB]" />
        <div className="flex-1 bg-[#16A34A]" />
        <div className="flex-1 bg-[#DC2626]" />
        <div className="flex-1 bg-[#18181B]" />
      </div>

      {/* Main Game Area */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto pt-6 relative z-10">
        <header className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: GEM_ACCENT.primary }}>
                {state.gameMode === 'PvAI' ? '人机对战' : 'AI 对战'}
              </span>
              {isAIvAI && (
                <>
                  <span className="text-xs opacity-40">•</span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    回合 {turnCount}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">璀璨宝石</h1>
          </div>
          <button 
            onClick={() => setState(null)}
            className="px-4 py-2 border-2 border-black font-bold uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-colors duration-200"
          >
            退出
          </button>
        </header>

        {/* AI对战控制面板 */}
        {isAIvAI && state.phase === 'PLAYING' && (
          <div className="mb-6 p-4 bg-black text-white flex flex-wrap items-center gap-4 md:gap-6">
            {/* 回合数 */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest opacity-60">回合</span>
              <span className="text-2xl font-black">{turnCount}</span>
            </div>

            <div className="w-px h-8 bg-white/20 hidden md:block" />

            {/* 暂停/开始按钮 */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-4 py-2 border-2 font-bold uppercase text-sm tracking-wider transition-all duration-200 ${
                isPaused 
                  ? 'border-[#16A34A] bg-[#16A34A] text-white hover:bg-[#15803D]' 
                  : 'border-[#DC2626] bg-[#DC2626] text-white hover:bg-[#B91C1C]'
              }`}
            >
              {isPaused ? '▶ 继续' : '⏸ 暂停'}
            </button>

            <div className="w-px h-8 bg-white/20 hidden md:block" />

            {/* 速度调节 */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest opacity-60 whitespace-nowrap">速度</span>
              <div className="flex">
                {[0.1, 0.3, 0.5, 0.8, 1.0].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setAiSpeed(speed)}
                    className={`px-3 py-1 text-xs font-bold uppercase border-2 border-white/30 transition-all duration-150 ${
                      aiSpeed === speed
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    {speed}s
                  </button>
                ))}
              </div>
            </div>

            {/* 状态指示 */}
            {isProcessing && !isPaused && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#DC2626] animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#2563EB] animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#16A34A] animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs uppercase tracking-widest opacity-60">思考中</span>
              </div>
            )}
            {isPaused && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400" />
                <span className="text-xs uppercase tracking-widest opacity-60">已暂停</span>
              </div>
            )}
          </div>
        )}

        {state.phase === 'GAMEOVER' ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border-4 border-black text-center relative overflow-hidden">
            {/* 装饰性宝石图案 */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                <polygon points="200,20 280,80 280,160 200,220 120,160 120,80" fill="none" stroke="black" strokeWidth="2"/>
                <polygon points="200,50 250,90 250,150 200,190 150,150 150,90" fill="none" stroke="black" strokeWidth="1"/>
              </svg>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: GEM_ACCENT.primary }}>
                游戏结束
              </span>
              {isAIvAI && (
                <>
                  <span className="text-xs opacity-40">•</span>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                    共 {turnCount} 回合
                  </span>
                </>
              )}
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tight">
              {state.winner}
            </h2>
            <p className="text-xl font-bold mb-8 uppercase tracking-widest opacity-60">获胜</p>
            
            {/* 宝石装饰 */}
            <div className="flex gap-2 mb-8">
              <div className="w-4 h-4 rotate-45 bg-[#F8FAFC] border border-black/20" />
              <div className="w-4 h-4 rotate-45 bg-[#2563EB]" />
              <div className="w-4 h-4 rotate-45 bg-[#16A34A]" />
              <div className="w-4 h-4 rotate-45 bg-[#DC2626]" />
              <div className="w-4 h-4 rotate-45 bg-[#18181B]" />
            </div>
            
            <button 
              onClick={() => setState(null)}
              className="bg-black text-white px-8 py-4 text-lg font-bold uppercase tracking-wider hover:bg-[#DC2626] transition-colors duration-200"
            >
              返回主菜单
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 玩家状态栏 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex gap-3 flex-wrap">
                {state.players.map((p: Player, idx: number) => (
                  <div 
                    key={p.id} 
                    className={`p-4 border-2 transition-all duration-200 ${
                      state.currentPlayerIndex === idx 
                        ? 'bg-black text-white border-black scale-[1.02]' 
                        : 'bg-white border-gray-200 hover:border-black'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs uppercase font-bold tracking-wider ${
                        state.currentPlayerIndex === idx ? 'text-[#DC2626]' : 'opacity-50'
                      }`}>
                        {p.isAI ? 'AI' : '玩家'}
                      </span>
                      {state.currentPlayerIndex === idx && !isPaused && (
                        <span className="w-2 h-2 bg-[#DC2626] rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl font-black">{p.name}</span>
                      <span className="text-2xl font-light">{p.score}</span>
                      <span className="text-xs uppercase tracking-wider opacity-50">pts</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 人机对战时的AI思考指示器 */}
              {!isAIvAI && isProcessing && (
                <div className="flex items-center gap-3 px-4 py-2 bg-black text-white">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#DC2626] animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#2563EB] animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#16A34A] animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="font-bold uppercase tracking-widest text-xs">AI 思考中</span>
                </div>
              )}
            </div>

            <Board 
              state={state} 
              onAction={handleAction} 
              disabled={currentPlayer.isAI || isProcessing || isPaused}
            />
          </div>
        )}
      </main>

      {/* Sidebar Stats & Logs */}
      <aside className="w-full md:w-96 bg-white border-l-2 border-black flex flex-col relative z-10">
        <PlayerDashboard player={state.players[0]} isCurrent={state.currentPlayerIndex === 0} />
        <div className="border-t-2 border-black" />
        <PlayerDashboard player={state.players[1]} isCurrent={state.currentPlayerIndex === 1} />
        <div className="mt-auto border-t-2 border-black">
          <Sidebar logs={state.logs} />
        </div>
      </aside>

      {/* 底部宝石色条 */}
      <div className="absolute bottom-0 left-0 right-0 flex h-1 z-50 md:hidden">
        <div className="flex-1 bg-[#F8FAFC] border-t border-black/10" />
        <div className="flex-1 bg-[#2563EB]" />
        <div className="flex-1 bg-[#16A34A]" />
        <div className="flex-1 bg-[#DC2626]" />
        <div className="flex-1 bg-[#18181B]" />
      </div>
    </div>
  );
};

export default App;
