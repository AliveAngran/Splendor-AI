
export enum GemType {
  WHITE = 'WHITE',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  RED = 'RED',
  BLACK = 'BLACK',
  GOLD = 'GOLD',
}

export type GemWallet = Record<GemType, number>;

export interface Card {
  id: string;
  level: 1 | 2 | 3;
  points: number;
  gemType: GemType; // The bonus provided
  cost: Partial<Record<GemType, number>>;
}

export interface Noble {
  id: string;
  points: number;
  cost: Partial<Record<GemType, number>>; // Bonuses required
}

export interface Player {
  id: string;
  name: string;
  isAI: boolean;
  score: number;
  gems: GemWallet;
  bonuses: Partial<Record<GemType, number>>;
  reservedCards: Card[];
  purchasedCards: Card[];
}

export interface GameState {
  board: {
    level1: Card[];
    level2: Card[];
    level3: Card[];
    deck1: Card[];  // 一级牌堆
    deck2: Card[];  // 二级牌堆
    deck3: Card[];  // 三级牌堆
    nobles: Noble[];
    bank: GemWallet;
  };
  players: Player[];
  currentPlayerIndex: number;
  logs: string[];
  winner: string | null;
  phase: 'MENU' | 'PLAYING' | 'GAMEOVER';
  difficulty: 'SIMPLE' | 'NORMAL' | 'HARD';
  gameMode: 'PvAI' | 'AIvAI';
}

export type Action = 
  | { type: 'TAKE_GEMS'; gems: GemType[] }
  | { type: 'BUY_CARD'; cardId: string; fromBoard: boolean; level?: number }
  | { type: 'RESERVE_CARD'; cardId: string; level: number }
  | { type: 'PASS' };
