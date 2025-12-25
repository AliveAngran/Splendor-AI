
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Action, GemType } from './types';
import { createInitialState, executeAction } from './gameLogic';
import { getONNXAIMove, initONNXModel } from './onnxAIService';
import Board from './components/Board';
import ModeSelector from './components/ModeSelector';
import Sidebar from './components/Sidebar';
import PlayerDashboard from './components/PlayerDashboard';

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const processingRef = useRef(false);

  // 预加载 ONNX 模型
  useEffect(() => {
    initONNXModel().then(() => setModelLoaded(true));
  }, []);

  const startNewGame = (mode: 'PvAI' | 'AIvAI', difficulty: 'SIMPLE' | 'NORMAL' | 'HARD') => {
    setState(createInitialState(mode, difficulty));
    setIsProcessing(false);
    processingRef.current = false;
  };

  const handleAction = useCallback((action: Action) => {
    if (!state || state.phase !== 'PLAYING') return;
    
    const nextState = executeAction(state, action);
    setState(nextState);
  }, [state]);

  useEffect(() => {
    if (!state || state.phase !== 'PLAYING') return;
    if (!state.players[state.currentPlayerIndex].isAI) return;
    if (processingRef.current) return;

    const triggerAI = async () => {
      processingRef.current = true;
      setIsProcessing(true);
      
      await new Promise(r => setTimeout(r, 800));
      
      try {
        const move = await getONNXAIMove(state);
        console.log('AI 决策:', move);
        
        if (move) {
          const nextState = executeAction(state, move);
          setState(nextState);
        } else {
          console.error('AI 无法决策，跳过回合');
          // 强制跳过回合
          setState(prev => prev ? {
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
  }, [state]);

  if (!state) {
    return <ModeSelector onStart={startNewGame} />;
  }

  const currentPlayer = state.players[state.currentPlayerIndex];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F2F2F2]">
      {/* Main Game Area */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tighter">璀璨宝石 AI 对决</h1>
            <p className="text-sm font-medium text-gray-500 uppercase">{state.gameMode === 'PvAI' ? '人机对战' : 'AI对战'} • {state.difficulty === 'SIMPLE' ? '简单' : state.difficulty === 'NORMAL' ? '普通' : '困难'}模式</p>
          </div>
          <button 
            onClick={() => setState(null)}
            className="px-4 py-2 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors"
          >
            退出
          </button>
        </header>

        {state.phase === 'GAMEOVER' ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border-4 border-black text-center">
            <h2 className="text-6xl font-black mb-4 italic uppercase">游戏结束</h2>
            <p className="text-2xl font-bold mb-8">{state.winner} 获胜！</p>
            <button 
              onClick={() => setState(null)}
              className="bg-red-600 text-white px-8 py-4 text-xl font-bold uppercase hover:bg-black transition-colors"
            >
              返回主菜单
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div className="flex gap-4">
                  {state.players.map((p, idx) => (
                    <div 
                      key={p.id} 
                      className={`p-4 border-2 transition-all ${state.currentPlayerIndex === idx ? 'bg-black text-white border-black scale-105' : 'bg-white border-gray-300'}`}
                    >
                      <span className="text-xs uppercase font-bold block mb-1 opacity-70">{p.isAI ? 'AI 机器人' : '玩家'}</span>
                      <span className="text-xl font-black">{p.name}</span>
                      <span className="ml-4 text-2xl font-light">{p.score} PTS</span>
                    </div>
                  ))}
                </div>
                {isProcessing && (
                  <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <span className="font-bold uppercase tracking-widest text-sm">AI 思考中...</span>
                  </div>
                )}
            </div>

            <Board 
              state={state} 
              onAction={handleAction} 
              disabled={currentPlayer.isAI || isProcessing}
            />
          </div>
        )}
      </main>

      {/* Sidebar Stats & Logs */}
      <aside className="w-full md:w-96 bg-white border-l-2 border-black flex flex-col">
         <PlayerDashboard player={state.players[0]} isCurrent={state.currentPlayerIndex === 0} />
         <div className="border-t-2 border-black"></div>
         <PlayerDashboard player={state.players[1]} isCurrent={state.currentPlayerIndex === 1} />
         <div className="mt-auto border-t-2 border-black">
           <Sidebar logs={state.logs} />
         </div>
      </aside>
    </div>
  );
};

export default App;
