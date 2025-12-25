import { Card, Noble, GemType } from './types';

// 完整的璀璨宝石卡牌数据
export const ALL_CARDS: Card[] = [
  // ========== Level 1 (40张) ==========
  // 白色奖励 (8张)
  { id: '1-w1', level: 1, points: 0, gemType: GemType.WHITE, cost: { BLUE: 1, GREEN: 1, RED: 1, BLACK: 1 } },
  { id: '1-w2', level: 1, points: 0, gemType: GemType.WHITE, cost: { BLUE: 1, GREEN: 2, RED: 1, BLACK: 1 } },
  { id: '1-w3', level: 1, points: 0, gemType: GemType.WHITE, cost: { BLUE: 2, GREEN: 2, BLACK: 1 } },
  { id: '1-w4', level: 1, points: 0, gemType: GemType.WHITE, cost: { GREEN: 3 } },
  { id: '1-w5', level: 1, points: 0, gemType: GemType.WHITE, cost: { BLUE: 2, BLACK: 2 } },
  { id: '1-w6', level: 1, points: 0, gemType: GemType.WHITE, cost: { BLUE: 3 } },
  { id: '1-w7', level: 1, points: 0, gemType: GemType.WHITE, cost: { RED: 2, BLACK: 1 } },
  { id: '1-w8', level: 1, points: 1, gemType: GemType.WHITE, cost: { GREEN: 4 } },
  // 蓝色奖励 (8张)
  { id: '1-b1', level: 1, points: 0, gemType: GemType.BLUE, cost: { WHITE: 1, GREEN: 1, RED: 1, BLACK: 1 } },
  { id: '1-b2', level: 1, points: 0, gemType: GemType.BLUE, cost: { WHITE: 1, GREEN: 1, RED: 2, BLACK: 1 } },
  { id: '1-b3', level: 1, points: 0, gemType: GemType.BLUE, cost: { WHITE: 1, GREEN: 2, RED: 2 } },
  { id: '1-b4', level: 1, points: 0, gemType: GemType.BLUE, cost: { BLACK: 3 } },
  { id: '1-b5', level: 1, points: 0, gemType: GemType.BLUE, cost: { WHITE: 2, BLACK: 2 } },
  { id: '1-b6', level: 1, points: 0, gemType: GemType.BLUE, cost: { GREEN: 2, BLACK: 1 } },
  { id: '1-b7', level: 1, points: 0, gemType: GemType.BLUE, cost: { BLACK: 2, WHITE: 1 } },
  { id: '1-b8', level: 1, points: 1, gemType: GemType.BLUE, cost: { RED: 4 } },
  // 绿色奖励 (8张)
  { id: '1-g1', level: 1, points: 0, gemType: GemType.GREEN, cost: { WHITE: 1, BLUE: 1, RED: 1, BLACK: 1 } },
  { id: '1-g2', level: 1, points: 0, gemType: GemType.GREEN, cost: { WHITE: 1, BLUE: 1, RED: 1, BLACK: 2 } },
  { id: '1-g3', level: 1, points: 0, gemType: GemType.GREEN, cost: { BLUE: 1, RED: 2, BLACK: 2 } },
  { id: '1-g4', level: 1, points: 0, gemType: GemType.GREEN, cost: { RED: 3 } },
  { id: '1-g5', level: 1, points: 0, gemType: GemType.GREEN, cost: { WHITE: 2, BLUE: 2 } },
  { id: '1-g6', level: 1, points: 0, gemType: GemType.GREEN, cost: { BLUE: 3 } },
  { id: '1-g7', level: 1, points: 0, gemType: GemType.GREEN, cost: { WHITE: 1, BLUE: 2 } },
  { id: '1-g8', level: 1, points: 1, gemType: GemType.GREEN, cost: { BLACK: 4 } },
  // 红色奖励 (8张)
  { id: '1-r1', level: 1, points: 0, gemType: GemType.RED, cost: { WHITE: 1, BLUE: 1, GREEN: 1, BLACK: 1 } },
  { id: '1-r2', level: 1, points: 0, gemType: GemType.RED, cost: { WHITE: 2, BLUE: 1, GREEN: 1, BLACK: 1 } },
  { id: '1-r3', level: 1, points: 0, gemType: GemType.RED, cost: { WHITE: 2, GREEN: 1, BLACK: 2 } },
  { id: '1-r4', level: 1, points: 0, gemType: GemType.RED, cost: { WHITE: 3 } },
  { id: '1-r5', level: 1, points: 0, gemType: GemType.RED, cost: { GREEN: 2, BLACK: 2 } },
  { id: '1-r6', level: 1, points: 0, gemType: GemType.RED, cost: { WHITE: 2, RED: 2 } },
  { id: '1-r7', level: 1, points: 0, gemType: GemType.RED, cost: { WHITE: 1, BLACK: 2 } },
  { id: '1-r8', level: 1, points: 1, gemType: GemType.RED, cost: { WHITE: 4 } },
  // 黑色奖励 (8张)
  { id: '1-k1', level: 1, points: 0, gemType: GemType.BLACK, cost: { WHITE: 1, BLUE: 1, GREEN: 1, RED: 1 } },
  { id: '1-k2', level: 1, points: 0, gemType: GemType.BLACK, cost: { WHITE: 1, BLUE: 2, GREEN: 1, RED: 1 } },
  { id: '1-k3', level: 1, points: 0, gemType: GemType.BLACK, cost: { WHITE: 2, BLUE: 2, GREEN: 1 } },
  { id: '1-k4', level: 1, points: 0, gemType: GemType.BLACK, cost: { GREEN: 3 } },
  { id: '1-k5', level: 1, points: 0, gemType: GemType.BLACK, cost: { GREEN: 2, RED: 2 } },
  { id: '1-k6', level: 1, points: 0, gemType: GemType.BLACK, cost: { WHITE: 2, GREEN: 2 } },
  { id: '1-k7', level: 1, points: 0, gemType: GemType.BLACK, cost: { GREEN: 1, RED: 2 } },
  { id: '1-k8', level: 1, points: 1, gemType: GemType.BLACK, cost: { BLUE: 4 } },

  // ========== Level 2 (30张) ==========
  // 白色奖励 (6张)
  { id: '2-w1', level: 2, points: 1, gemType: GemType.WHITE, cost: { GREEN: 3, RED: 2, BLACK: 2 } },
  { id: '2-w2', level: 2, points: 1, gemType: GemType.WHITE, cost: { WHITE: 2, BLUE: 3, RED: 3 } },
  { id: '2-w3', level: 2, points: 2, gemType: GemType.WHITE, cost: { GREEN: 1, RED: 4, BLACK: 2 } },
  { id: '2-w4', level: 2, points: 2, gemType: GemType.WHITE, cost: { RED: 5 } },
  { id: '2-w5', level: 2, points: 2, gemType: GemType.WHITE, cost: { RED: 5, BLACK: 3 } },
  { id: '2-w6', level: 2, points: 3, gemType: GemType.WHITE, cost: { WHITE: 6 } },
  // 蓝色奖励 (6张)
  { id: '2-b1', level: 2, points: 1, gemType: GemType.BLUE, cost: { WHITE: 2, GREEN: 2, BLACK: 3 } },
  { id: '2-b2', level: 2, points: 1, gemType: GemType.BLUE, cost: { BLUE: 2, GREEN: 3, BLACK: 3 } },
  { id: '2-b3', level: 2, points: 2, gemType: GemType.BLUE, cost: { WHITE: 2, RED: 1, BLACK: 4 } },
  { id: '2-b4', level: 2, points: 2, gemType: GemType.BLUE, cost: { WHITE: 5 } },
  { id: '2-b5', level: 2, points: 2, gemType: GemType.BLUE, cost: { WHITE: 5, BLUE: 3 } },
  { id: '2-b6', level: 2, points: 3, gemType: GemType.BLUE, cost: { BLUE: 6 } },
  // 绿色奖励 (6张)
  { id: '2-g1', level: 2, points: 1, gemType: GemType.GREEN, cost: { WHITE: 3, BLUE: 2, RED: 2 } },
  { id: '2-g2', level: 2, points: 1, gemType: GemType.GREEN, cost: { WHITE: 3, GREEN: 2, RED: 3 } },
  { id: '2-g3', level: 2, points: 2, gemType: GemType.GREEN, cost: { WHITE: 4, BLUE: 2, BLACK: 1 } },
  { id: '2-g4', level: 2, points: 2, gemType: GemType.GREEN, cost: { BLUE: 5 } },
  { id: '2-g5', level: 2, points: 2, gemType: GemType.GREEN, cost: { BLUE: 5, GREEN: 3 } },
  { id: '2-g6', level: 2, points: 3, gemType: GemType.GREEN, cost: { GREEN: 6 } },
  // 红色奖励 (6张)
  { id: '2-r1', level: 2, points: 1, gemType: GemType.RED, cost: { WHITE: 2, BLUE: 2, GREEN: 3 } },
  { id: '2-r2', level: 2, points: 1, gemType: GemType.RED, cost: { BLUE: 3, RED: 2, BLACK: 3 } },
  { id: '2-r3', level: 2, points: 2, gemType: GemType.RED, cost: { WHITE: 1, BLUE: 4, GREEN: 2 } },
  { id: '2-r4', level: 2, points: 2, gemType: GemType.RED, cost: { BLACK: 5 } },
  { id: '2-r5', level: 2, points: 2, gemType: GemType.RED, cost: { GREEN: 3, BLACK: 5 } },
  { id: '2-r6', level: 2, points: 3, gemType: GemType.RED, cost: { RED: 6 } },
  // 黑色奖励 (6张)
  { id: '2-k1', level: 2, points: 1, gemType: GemType.BLACK, cost: { WHITE: 3, BLUE: 3, GREEN: 2 } },
  { id: '2-k2', level: 2, points: 1, gemType: GemType.BLACK, cost: { GREEN: 3, RED: 3, BLACK: 2 } },
  { id: '2-k3', level: 2, points: 2, gemType: GemType.BLACK, cost: { BLUE: 1, GREEN: 4, RED: 2 } },
  { id: '2-k4', level: 2, points: 2, gemType: GemType.BLACK, cost: { GREEN: 5 } },
  { id: '2-k5', level: 2, points: 2, gemType: GemType.BLACK, cost: { WHITE: 3, GREEN: 5 } },
  { id: '2-k6', level: 2, points: 3, gemType: GemType.BLACK, cost: { BLACK: 6 } },

  // ========== Level 3 (20张) ==========
  // 白色奖励 (4张)
  { id: '3-w1', level: 3, points: 3, gemType: GemType.WHITE, cost: { BLUE: 3, GREEN: 3, RED: 5, BLACK: 3 } },
  { id: '3-w2', level: 3, points: 4, gemType: GemType.WHITE, cost: { WHITE: 3, RED: 3, BLACK: 6 } },
  { id: '3-w3', level: 3, points: 4, gemType: GemType.WHITE, cost: { BLACK: 7 } },
  { id: '3-w4', level: 3, points: 5, gemType: GemType.WHITE, cost: { WHITE: 3, BLACK: 7 } },
  // 蓝色奖励 (4张)
  { id: '3-b1', level: 3, points: 3, gemType: GemType.BLUE, cost: { WHITE: 3, GREEN: 3, RED: 3, BLACK: 5 } },
  { id: '3-b2', level: 3, points: 4, gemType: GemType.BLUE, cost: { WHITE: 6, BLUE: 3, BLACK: 3 } },
  { id: '3-b3', level: 3, points: 4, gemType: GemType.BLUE, cost: { WHITE: 7 } },
  { id: '3-b4', level: 3, points: 5, gemType: GemType.BLUE, cost: { WHITE: 7, BLUE: 3 } },
  // 绿色奖励 (4张)
  { id: '3-g1', level: 3, points: 3, gemType: GemType.GREEN, cost: { WHITE: 5, BLUE: 3, RED: 3, BLACK: 3 } },
  { id: '3-g2', level: 3, points: 4, gemType: GemType.GREEN, cost: { WHITE: 3, BLUE: 6, GREEN: 3 } },
  { id: '3-g3', level: 3, points: 4, gemType: GemType.GREEN, cost: { BLUE: 7 } },
  { id: '3-g4', level: 3, points: 5, gemType: GemType.GREEN, cost: { BLUE: 7, GREEN: 3 } },
  // 红色奖励 (4张)
  { id: '3-r1', level: 3, points: 3, gemType: GemType.RED, cost: { WHITE: 3, BLUE: 5, GREEN: 3, BLACK: 3 } },
  { id: '3-r2', level: 3, points: 4, gemType: GemType.RED, cost: { BLUE: 3, GREEN: 6, RED: 3 } },
  { id: '3-r3', level: 3, points: 4, gemType: GemType.RED, cost: { GREEN: 7 } },
  { id: '3-r4', level: 3, points: 5, gemType: GemType.RED, cost: { GREEN: 7, RED: 3 } },
  // 黑色奖励 (4张)
  { id: '3-k1', level: 3, points: 3, gemType: GemType.BLACK, cost: { WHITE: 3, BLUE: 3, GREEN: 5, RED: 3 } },
  { id: '3-k2', level: 3, points: 4, gemType: GemType.BLACK, cost: { GREEN: 3, RED: 6, BLACK: 3 } },
  { id: '3-k3', level: 3, points: 4, gemType: GemType.BLACK, cost: { RED: 7 } },
  { id: '3-k4', level: 3, points: 5, gemType: GemType.BLACK, cost: { RED: 7, BLACK: 3 } },
];

// 完整的贵族数据 (10张，游戏中随机选5张)
export const ALL_NOBLES: Noble[] = [
  { id: 'n1', points: 3, cost: { WHITE: 3, BLUE: 3, BLACK: 3 } },
  { id: 'n2', points: 3, cost: { WHITE: 3, BLUE: 3, GREEN: 3 } },
  { id: 'n3', points: 3, cost: { BLUE: 3, GREEN: 3, RED: 3 } },
  { id: 'n4', points: 3, cost: { GREEN: 3, RED: 3, BLACK: 3 } },
  { id: 'n5', points: 3, cost: { WHITE: 3, RED: 3, BLACK: 3 } },
  { id: 'n6', points: 3, cost: { WHITE: 4, BLUE: 4 } },
  { id: 'n7', points: 3, cost: { BLUE: 4, GREEN: 4 } },
  { id: 'n8', points: 3, cost: { GREEN: 4, RED: 4 } },
  { id: 'n9', points: 3, cost: { RED: 4, BLACK: 4 } },
  { id: 'n10', points: 3, cost: { WHITE: 4, BLACK: 4 } },
];

export const GEM_COLORS: Record<GemType, string> = {
  [GemType.WHITE]: '#f8fafc',
  [GemType.BLUE]: '#3b82f6',
  [GemType.GREEN]: '#22c55e',
  [GemType.RED]: '#ef4444',
  [GemType.BLACK]: '#1f2937',
  [GemType.GOLD]: '#f59e0b',
};

export const INITIAL_BANK = (playerCount: number): Record<GemType, number> => ({
  [GemType.WHITE]: playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7,
  [GemType.BLUE]: playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7,
  [GemType.GREEN]: playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7,
  [GemType.RED]: playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7,
  [GemType.BLACK]: playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7,
  [GemType.GOLD]: 5,
});
