
import { GameState, Card, Noble, GemType, Player, GemWallet, Action } from './types';
import { ALL_CARDS, ALL_NOBLES, INITIAL_BANK } from './constants';

export const createInitialState = (mode: 'PvAI' | 'AIvAI', difficulty: 'SIMPLE' | 'NORMAL' | 'HARD'): GameState => {
  const players: Player[] = [
    {
      id: 'p1',
      name: mode === 'PvAI' ? '玩家' : 'AI 阿尔法',
      isAI: mode === 'AIvAI',
      score: 0,
      gems: { WHITE: 0, BLUE: 0, GREEN: 0, RED: 0, BLACK: 0, GOLD: 0 },
      bonuses: { WHITE: 0, BLUE: 0, GREEN: 0, RED: 0, BLACK: 0 },
      reservedCards: [],
      purchasedCards: [],
    },
    {
      id: 'p2',
      name: mode === 'PvAI' ? 'AI 策略师' : 'AI 贝塔',
      isAI: true,
      score: 0,
      gems: { WHITE: 0, BLUE: 0, GREEN: 0, RED: 0, BLACK: 0, GOLD: 0 },
      bonuses: { WHITE: 0, BLUE: 0, GREEN: 0, RED: 0, BLACK: 0 },
      reservedCards: [],
      purchasedCards: [],
    }
  ];

  // 洗牌
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
  
  // 分离各级牌堆并洗牌
  const allLevel1 = shuffle(ALL_CARDS.filter(c => c.level === 1));
  const allLevel2 = shuffle(ALL_CARDS.filter(c => c.level === 2));
  const allLevel3 = shuffle(ALL_CARDS.filter(c => c.level === 3));
  
  // 场上展示4张，剩余放入牌堆
  const level1 = allLevel1.slice(0, 4);
  const deck1 = allLevel1.slice(4);
  const level2 = allLevel2.slice(0, 4);
  const deck2 = allLevel2.slice(4);
  const level3 = allLevel3.slice(0, 4);
  const deck3 = allLevel3.slice(4);
  
  const nobles = shuffle(ALL_NOBLES).slice(0, 3);

  return {
    board: {
      level1,
      level2,
      level3,
      deck1,
      deck2,
      deck3,
      nobles,
      bank: INITIAL_BANK(players.length),
    },
    players,
    currentPlayerIndex: 0,
    logs: ['游戏开始。'],
    winner: null,
    phase: 'PLAYING',
    difficulty,
    gameMode: mode,
  };
};

export const canBuyCard = (player: Player, card: Card): boolean => {
  let goldNeeded = 0;
  for (const gem of [GemType.WHITE, GemType.BLUE, GemType.GREEN, GemType.RED, GemType.BLACK]) {
    const cost = card.cost[gem] || 0;
    const bonus = player.bonuses[gem] || 0;
    const needed = Math.max(0, cost - bonus);
    if (needed > player.gems[gem]) {
      goldNeeded += (needed - player.gems[gem]);
    }
  }
  return player.gems.GOLD >= goldNeeded;
};

export const executeAction = (state: GameState, action: Action): GameState => {
  const nextState = JSON.parse(JSON.stringify(state)) as GameState;
  const player = nextState.players[nextState.currentPlayerIndex];
  const { bank } = nextState.board;

  let valid = false;
  let logMessage = '';

  if (action.type === 'TAKE_GEMS') {
    const { gems } = action;
    // Rule: Take 3 different or 2 of same if count >= 4, or take fewer if bank is low
    const uniqueGems = new Set(gems);
    const isThreeDifferent = uniqueGems.size === 3 && gems.length === 3;
    const isTwoSame = gems.length === 2 && gems[0] === gems[1] && bank[gems[0]] >= 4;
    // 允许拿少于3个不同的宝石（当银行不足时）
    const isFewerDifferent = uniqueGems.size === gems.length && gems.length > 0 && gems.length < 3;

    if (isThreeDifferent || isTwoSame || isFewerDifferent) {
      let actualTaken: GemType[] = [];
      gems.forEach(g => {
        if (bank[g] > 0) {
          bank[g]--;
          player.gems[g]++;
          actualTaken.push(g);
        }
      });
      if (actualTaken.length > 0) {
        valid = true;
        logMessage = `${player.name} 拿取了 ${actualTaken.join('、')} 宝石。`;
      }
    }
  } else if (action.type === 'BUY_CARD') {
    const card = ALL_CARDS.find(c => c.id === action.cardId);
    if (card && canBuyCard(player, card)) {
      // Logic for deducting costs
      let goldSpent = 0;
      for (const gem of [GemType.WHITE, GemType.BLUE, GemType.GREEN, GemType.RED, GemType.BLACK]) {
        const cost = card.cost[gem] || 0;
        const bonus = player.bonuses[gem] || 0;
        const needed = Math.max(0, cost - bonus);
        const fromStash = Math.min(needed, player.gems[gem]);
        player.gems[gem] -= fromStash;
        bank[gem] += fromStash;
        
        const remainingNeeded = needed - fromStash;
        if (remainingNeeded > 0) {
          player.gems.GOLD -= remainingNeeded;
          bank.GOLD += remainingNeeded;
          goldSpent += remainingNeeded;
        }
      }

      player.purchasedCards.push(card);
      player.score += card.points;
      player.bonuses[card.gemType] = (player.bonuses[card.gemType] || 0) + 1;

      // Replace card on board from deck
      if (action.fromBoard) {
        const levelKey = `level${card.level}` as 'level1' | 'level2' | 'level3';
        const deckKey = `deck${card.level}` as 'deck1' | 'deck2' | 'deck3';
        const boardCards = nextState.board[levelKey];
        const deck = nextState.board[deckKey];
        const index = boardCards.findIndex(c => c.id === card.id);
        
        if (index !== -1) {
          if (deck.length > 0) {
            // 从牌堆抽一张补充
            boardCards[index] = deck.shift()!;
          } else {
            // 牌堆空了，移除该位置
            boardCards.splice(index, 1);
          }
        }
      } else {
        // Bought from reserve
        player.reservedCards = player.reservedCards.filter(c => c.id !== card.id);
      }

      // Check nobles
      nextState.board.nobles.forEach((noble, nIdx) => {
        let satisfied = true;
        for (const [gem, amt] of Object.entries(noble.cost)) {
          if ((player.bonuses[gem as GemType] || 0) < (amt as number)) satisfied = false;
        }
        if (satisfied) {
          player.score += noble.points;
          nextState.board.nobles.splice(nIdx, 1);
          logMessage += ` 获得贵族青睐！`;
        }
      });

      valid = true;
      logMessage = `${player.name} 购买了一张 ${card.level} 级 ${card.gemType} 卡牌。${logMessage}`;
    }
  } else if (action.type === 'RESERVE_CARD') {
    if (player.reservedCards.length < 3) {
      const card = ALL_CARDS.find(c => c.id === action.cardId);
      if (card) {
        player.reservedCards.push(card);
        if (bank.GOLD > 0) {
          bank.GOLD--;
          player.gems.GOLD++;
        }
        
        // Remove from board and replace from deck
        const levelKey = `level${card.level}` as 'level1' | 'level2' | 'level3';
        const deckKey = `deck${card.level}` as 'deck1' | 'deck2' | 'deck3';
        const boardCards = nextState.board[levelKey];
        const deck = nextState.board[deckKey];
        const index = boardCards.findIndex(c => c.id === card.id);
        
        if (index !== -1) {
          if (deck.length > 0) {
            boardCards[index] = deck.shift()!;
          } else {
            boardCards.splice(index, 1);
          }
        }
        
        valid = true;
        logMessage = `${player.name} 预留了一张卡牌。`;
      }
    }
  }

  if (valid) {
    nextState.logs.unshift(logMessage);
    // Winner Check
    if (player.score >= 15 && nextState.currentPlayerIndex === nextState.players.length - 1) {
      const winner = nextState.players.reduce((prev, curr) => prev.score > curr.score ? prev : curr);
      nextState.winner = winner.name;
      nextState.phase = 'GAMEOVER';
    }
    nextState.currentPlayerIndex = (nextState.currentPlayerIndex + 1) % nextState.players.length;
  }

  return nextState;
};
