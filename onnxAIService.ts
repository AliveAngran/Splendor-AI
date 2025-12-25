import { GameState, Action, GemType, Card, Player } from './types';
import { canBuyCard } from './gameLogic';

// 动态导入 onnxruntime-web
let ort: typeof import('onnxruntime-web') | null = null;
let session: any = null;

// 拿3种不同宝石的10种组合
const TAKE_3_COMBINATIONS: GemType[][] = [
  [GemType.WHITE, GemType.BLUE, GemType.GREEN],
  [GemType.WHITE, GemType.BLUE, GemType.RED],
  [GemType.WHITE, GemType.BLUE, GemType.BLACK],
  [GemType.WHITE, GemType.GREEN, GemType.RED],
  [GemType.WHITE, GemType.GREEN, GemType.BLACK],
  [GemType.WHITE, GemType.RED, GemType.BLACK],
  [GemType.BLUE, GemType.GREEN, GemType.RED],
  [GemType.BLUE, GemType.GREEN, GemType.BLACK],
  [GemType.BLUE, GemType.RED, GemType.BLACK],
  [GemType.GREEN, GemType.RED, GemType.BLACK],
];

// 拿2个同色宝石的5种颜色
const TAKE_2_COLORS: GemType[] = [
  GemType.WHITE, GemType.BLUE, GemType.GREEN, GemType.RED, GemType.BLACK
];

// 宝石颜色索引映射
const GEM_INDEX: Record<string, number> = {
  WHITE: 0, BLUE: 1, GREEN: 2, RED: 3, BLACK: 4, GOLD: 5
};

// 初始化 ONNX 模型
export const initONNXModel = async (): Promise<void> => {
  if (session) return;
  
  try {
    ort = await import('onnxruntime-web');
    
    // 设置 WASM 文件路径为 public 目录
    ort.env.wasm.wasmPaths = '/';
    ort.env.wasm.numThreads = 1;
    
    const response = await fetch('/models/best_model_v15.onnx');
    const arrayBuffer = await response.arrayBuffer();
    
    session = await ort.InferenceSession.create(arrayBuffer, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'basic'
    });
    
    console.log('ONNX 模型加载成功');
    console.log('输入名:', session.inputNames);
    console.log('输出名:', session.outputNames);
  } catch (error) {
    console.error('ONNX 模型加载失败:', error);
  }
};


// 编码卡牌为11维向量
const encodeCard = (card: Card | null): number[] => {
  if (!card) return new Array(11).fill(0);
  
  const features = new Array(11).fill(0);
  features[GEM_INDEX[card.gemType]] = 1;
  features[5] = card.points / 5.0;
  features[6] = (card.cost[GemType.WHITE] || 0) / 7.0;
  features[7] = (card.cost[GemType.BLUE] || 0) / 7.0;
  features[8] = (card.cost[GemType.GREEN] || 0) / 7.0;
  features[9] = (card.cost[GemType.RED] || 0) / 7.0;
  features[10] = (card.cost[GemType.BLACK] || 0) / 7.0;
  return features;
};

// 编码贵族为6维向量
const encodeNoble = (noble: { points: number; cost: Partial<Record<GemType, number>> } | null): number[] => {
  if (!noble) return new Array(6).fill(0);
  const features = new Array(6).fill(0);
  features[0] = noble.points / 3.0;
  features[1] = (noble.cost[GemType.WHITE] || 0) / 4.0;
  features[2] = (noble.cost[GemType.BLUE] || 0) / 4.0;
  features[3] = (noble.cost[GemType.GREEN] || 0) / 4.0;
  features[4] = (noble.cost[GemType.RED] || 0) / 4.0;
  features[5] = (noble.cost[GemType.BLACK] || 0) / 4.0;
  return features;
};

// 编码玩家为13维向量
const encodePlayer = (player: Player): number[] => {
  return [
    player.gems[GemType.WHITE] / 7.0,
    player.gems[GemType.BLUE] / 7.0,
    player.gems[GemType.GREEN] / 7.0,
    player.gems[GemType.RED] / 7.0,
    player.gems[GemType.BLACK] / 7.0,
    player.gems[GemType.GOLD] / 5.0,
    (player.bonuses[GemType.WHITE] || 0) / 7.0,
    (player.bonuses[GemType.BLUE] || 0) / 7.0,
    (player.bonuses[GemType.GREEN] || 0) / 7.0,
    (player.bonuses[GemType.RED] || 0) / 7.0,
    (player.bonuses[GemType.BLACK] || 0) / 7.0,
    player.score / 15.0,
    player.reservedCards.length / 3.0,
  ];
};

// 将游戏状态编码为261维输入向量
const encodeGameState = (state: GameState): Float32Array => {
  const input = new Float32Array(261);
  let idx = 0;
  
  // [0-5] 可用宝石
  input[idx++] = state.board.bank[GemType.WHITE] / 7.0;
  input[idx++] = state.board.bank[GemType.BLUE] / 7.0;
  input[idx++] = state.board.bank[GemType.GREEN] / 7.0;
  input[idx++] = state.board.bank[GemType.RED] / 7.0;
  input[idx++] = state.board.bank[GemType.BLACK] / 7.0;
  input[idx++] = state.board.bank[GemType.GOLD] / 5.0;
  
  // [6-17] 玩家1, [18-29] 玩家2
  for (const p of state.players) {
    for (const f of encodePlayer(p)) input[idx++] = f;
  }
  
  // [30-161] 可见卡牌 (3层 × 4张 × 11特征)
  for (const level of [state.board.level1, state.board.level2, state.board.level3]) {
    for (let i = 0; i < 4; i++) {
      for (const f of encodeCard(level[i] || null)) input[idx++] = f;
    }
  }
  
  // [162-227] 预留卡 (玩家1: 3张, 玩家2: 3张)
  for (const p of state.players) {
    for (let i = 0; i < 3; i++) {
      for (const f of encodeCard(p.reservedCards[i] || null)) input[idx++] = f;
    }
  }
  
  // [228-257] 贵族 (5个)
  for (let i = 0; i < 5; i++) {
    for (const f of encodeNoble(state.board.nobles[i] || null)) input[idx++] = f;
  }
  
  // [258-260] 当前玩家 + padding
  input[idx++] = state.currentPlayerIndex;
  input[idx++] = 0;
  input[idx++] = 0;
  
  return input;
};


// 生成合法动作掩码
const getValidActionsMask = (state: GameState): boolean[] => {
  const mask = new Array(46).fill(false);
  const player = state.players[state.currentPlayerIndex];
  const bank = state.board.bank;
  
  // [0-9] TAKE_3_DIFFERENT
  for (let i = 0; i < 10; i++) {
    mask[i] = TAKE_3_COMBINATIONS[i].every(g => bank[g] > 0);
  }
  
  // [10-14] TAKE_2_SAME
  for (let i = 0; i < 5; i++) {
    mask[10 + i] = bank[TAKE_2_COLORS[i]] >= 4;
  }
  
  const visibleCards = [...state.board.level1, ...state.board.level2, ...state.board.level3];
  
  // [15-26] RESERVE visible card
  for (let i = 0; i < 12; i++) {
    mask[15 + i] = i < visibleCards.length && player.reservedCards.length < 3;
  }
  
  // [27-29] RESERVE from deck
  for (let i = 0; i < 3; i++) {
    mask[27 + i] = player.reservedCards.length < 3;
  }
  
  // [30-41] PURCHASE visible card
  for (let i = 0; i < visibleCards.length && i < 12; i++) {
    mask[30 + i] = canBuyCard(player, visibleCards[i]);
  }
  
  // [42-44] PURCHASE reserved card
  for (let i = 0; i < 3; i++) {
    if (player.reservedCards[i]) {
      mask[42 + i] = canBuyCard(player, player.reservedCards[i]);
    }
  }
  
  // [45] PASS
  mask[45] = !mask.slice(0, 45).some(v => v);
  
  return mask;
};

// 将动作索引转换为游戏动作
const decodeAction = (actionIdx: number, state: GameState): Action | null => {
  const player = state.players[state.currentPlayerIndex];
  const visibleCards = [...state.board.level1, ...state.board.level2, ...state.board.level3];
  
  if (actionIdx < 10) {
    return { type: 'TAKE_GEMS', gems: TAKE_3_COMBINATIONS[actionIdx] };
  }
  if (actionIdx < 15) {
    const gem = TAKE_2_COLORS[actionIdx - 10];
    return { type: 'TAKE_GEMS', gems: [gem, gem] };
  }
  if (actionIdx < 27) {
    const card = visibleCards[actionIdx - 15];
    if (card) return { type: 'RESERVE_CARD', cardId: card.id, level: card.level };
  }
  if (actionIdx < 30) {
    const level = (actionIdx - 27 + 1) as 1 | 2 | 3;
    const levelCards = state.board[`level${level}` as keyof typeof state.board] as Card[];
    if (levelCards[0]) return { type: 'RESERVE_CARD', cardId: levelCards[0].id, level };
  }
  if (actionIdx < 42) {
    const card = visibleCards[actionIdx - 30];
    if (card) return { type: 'BUY_CARD', cardId: card.id, fromBoard: true };
  }
  if (actionIdx < 45) {
    const card = player.reservedCards[actionIdx - 42];
    if (card) return { type: 'BUY_CARD', cardId: card.id, fromBoard: false };
  }
  
  // PASS fallback
  const availableGems = TAKE_2_COLORS.filter(g => state.board.bank[g] > 0);
  if (availableGems.length >= 3) {
    return { type: 'TAKE_GEMS', gems: availableGems.slice(0, 3) };
  }
  return null;
};

// 后备策略
const getFallbackAction = (state: GameState): Action | null => {
  const player = state.players[state.currentPlayerIndex];
  const bank = state.board.bank;
  const allCards = [...state.board.level1, ...state.board.level2, ...state.board.level3];
  
  // 1. 尝试购买能买的卡（优先高分）
  const affordableCards = [...allCards, ...player.reservedCards]
    .filter(card => canBuyCard(player, card))
    .sort((a, b) => b.points - a.points);
  
  if (affordableCards.length > 0) {
    const card = affordableCards[0];
    const fromBoard = allCards.some(c => c.id === card.id);
    return { type: 'BUY_CARD', cardId: card.id, fromBoard };
  }
  
  // 2. 尝试拿 3 个不同宝石
  for (const combo of TAKE_3_COMBINATIONS) {
    if (combo.every(g => bank[g] > 0)) {
      return { type: 'TAKE_GEMS', gems: combo };
    }
  }
  
  // 3. 尝试拿 2 个相同宝石
  for (const gem of TAKE_2_COLORS) {
    if (bank[gem] >= 4) {
      return { type: 'TAKE_GEMS', gems: [gem, gem] };
    }
  }
  
  // 4. 尝试拿任意可用宝石（少于3个）
  const availableGems = TAKE_2_COLORS.filter(g => bank[g] > 0);
  if (availableGems.length > 0) {
    return { type: 'TAKE_GEMS', gems: availableGems.slice(0, Math.min(3, availableGems.length)) };
  }
  
  // 5. 预留一张卡
  if (player.reservedCards.length < 3 && allCards.length > 0) {
    const card = allCards[0];
    return { type: 'RESERVE_CARD', cardId: card.id, level: card.level };
  }
  
  return null;
};

// 主要的 AI 决策函数
export const getONNXAIMove = async (state: GameState): Promise<Action | null> => {
  if (!session || !ort) {
    return getFallbackAction(state);
  }
  
  try {
    const inputData = encodeGameState(state);
    const inputTensor = new ort.Tensor('float32', inputData, [1, 261]);
    
    const inputName = session.inputNames[0];
    const results = await session.run({ [inputName]: inputTensor });
    
    // 获取 policy 输出
    const policyOutput = results[session.outputNames[0]];
    const policy = policyOutput.data as Float32Array;
    
    const validMask = getValidActionsMask(state);
    
    let bestAction = -1;
    let bestProb = -Infinity;
    for (let i = 0; i < 46; i++) {
      if (validMask[i] && policy[i] > bestProb) {
        bestProb = policy[i];
        bestAction = i;
      }
    }
    
    if (bestAction >= 0) {
      const action = decodeAction(bestAction, state);
      if (action) return action;
    }
    
    return getFallbackAction(state);
  } catch (error) {
    console.error('ONNX 推理错误:', error);
    return getFallbackAction(state);
  }
};
