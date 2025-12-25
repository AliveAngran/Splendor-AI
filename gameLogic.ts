import { GameState, Card, GemType, Player, Action } from './types';
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

// 检查玩家是否满足贵族条件
const checkNobleVisit = (player: Player, noble: { points: number; cost: Partial<Record<GemType, number>> }): boolean => {
  for (const [gem, amt] of Object.entries(noble.cost)) {
    if ((player.bonuses[gem as GemType] || 0) < (amt as number)) {
      return false;
    }
  }
  return true;
};

export const executeAction = (state: GameState, action: Action): GameState => {
  const nextState = JSON.parse(JSON.stringify(state)) as GameState;
  const player = nextState.players[nextState.currentPlayerIndex];
  const { bank } = nextState.board;

  let valid = false;
  let logMessage = '';

  if (action.type === 'TAKE_GEMS') {
    const { gems } = action;
    const uniqueGems = new Set(gems);
    const isThreeDifferent = uniqueGems.size === 3 && gems.length === 3;
    const isTwoSame = gems.length === 2 && gems[0] === gems[1] && bank[gems[0]] >= 4;
    const isFewerDifferent = uniqueGems.size === gems.length && gems.length > 0 && gems.length < 3;

    if (isThreeDifferent || isTwoSame || isFewerDifferent) {
      const currentGemCount = Object.values(player.gems).reduce((sum, count) => sum + count, 0);
      const maxGems = 10;
      
      let actualTaken: GemType[] = [];
      let gemsToTake = gems.filter(g => bank[g] > 0);
      
      const canTake = Math.min(gemsToTake.length, maxGems - currentGemCount);
      gemsToTake = gemsToTake.slice(0, canTake);
      
      gemsToTake.forEach(g => {
        bank[g]--;
        player.gems[g]++;
        actualTaken.push(g);
      });
      
      if (actualTaken.length > 0) {
        valid = true;
        logMessage = `${player.name} 拿取了 ${actualTaken.join('、')} 宝石。`;
        if (canTake < gems.length) {
          logMessage += ` (已达上限10个)`;
        }
      }
    }
  } else if (action.type === 'BUY_CARD') {
    const visibleCards = [...nextState.board.level1, ...nextState.board.level2, ...nextState.board.level3];
    let card: Card | undefined;
    
    if (action.fromBoard) {
      card = visibleCards.find(c => c.id === action.cardId);
    } else {
      card = player.reservedCards.find(c => c.id === action.cardId);
    }
    
    if (card && canBuyCard(player, card)) {
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
        }
      }

      player.purchasedCards.push(card);
      player.score += card.points;
      player.bonuses[card.gemType] = (player.bonuses[card.gemType] || 0) + 1;

      if (action.fromBoard) {
        const levelKey = `level${card.level}` as 'level1' | 'level2' | 'level3';
        const deckKey = `deck${card.level}` as 'deck1' | 'deck2' | 'deck3';
        const boardCards = nextState.board[levelKey];
        const deck = nextState.board[deckKey];
        const index = boardCards.findIndex(c => c.id === card!.id);
        
        if (index !== -1) {
          if (deck.length > 0) {
            boardCards[index] = deck.shift()!;
          } else {
            boardCards.splice(index, 1);
          }
        }
      } else {
        player.reservedCards = player.reservedCards.filter(c => c.id !== card!.id);
      }

      // Check nobles - 每回合只能获得一个贵族
      let nobleGained = false;
      for (let i = 0; i < nextState.board.nobles.length && !nobleGained; i++) {
        const noble = nextState.board.nobles[i];
        if (checkNobleVisit(player, noble)) {
          player.score += noble.points;
          nextState.board.nobles.splice(i, 1);
          logMessage += ` 获得贵族青睐！`;
          nobleGained = true;
        }
      }

      valid = true;
      logMessage = `${player.name} 购买了一张 ${card.level} 级 ${card.gemType} 卡牌。${logMessage}`;
    }
  } else if (action.type === 'RESERVE_CARD') {
    if (player.reservedCards.length < 3) {
      const levelKey = `level${action.level}` as 'level1' | 'level2' | 'level3';
      const boardCards = nextState.board[levelKey];
      const cardIndex = boardCards.findIndex(c => c.id === action.cardId);
      
      if (cardIndex !== -1) {
        const card = boardCards[cardIndex];
        player.reservedCards.push(card);
        
        const currentGemCount = Object.values(player.gems).reduce((sum, count) => sum + count, 0);
        const maxGems = 10;
        
        if (bank.GOLD > 0 && currentGemCount < maxGems) {
          bank.GOLD--;
          player.gems.GOLD++;
        }
        
        const deckKey = `deck${action.level}` as 'deck1' | 'deck2' | 'deck3';
        const deck = nextState.board[deckKey];
        
        if (deck.length > 0) {
          boardCards[cardIndex] = deck.shift()!;
        } else {
          boardCards.splice(cardIndex, 1);
        }
        
        valid = true;
        logMessage = `${player.name} 预留了一张卡牌。`;
      }
    }
  } else if (action.type === 'PASS') {
    valid = true;
    logMessage = `${player.name} 跳过了本回合。`;
  }

  if (valid) {
    nextState.logs.unshift(logMessage);
    
    const nextPlayerIndex = (nextState.currentPlayerIndex + 1) % nextState.players.length;
    nextState.currentPlayerIndex = nextPlayerIndex;
    
    // 胜利检查：当回合结束（回到第一个玩家）时，检查是否有人达到15分
    if (nextPlayerIndex === 0) {
      const playersOver15 = nextState.players.filter(p => p.score >= 15);
      if (playersOver15.length > 0) {
        const maxScore = Math.max(...nextState.players.map(p => p.score));
        const winners = nextState.players.filter(p => p.score === maxScore);
        
        if (winners.length === 1) {
          nextState.winner = winners[0].name;
        } else {
          const minCards = Math.min(...winners.map(p => p.purchasedCards.length));
          const finalWinner = winners.find(p => p.purchasedCards.length === minCards);
          nextState.winner = finalWinner ? finalWinner.name : winners[0].name;
        }
        nextState.phase = 'GAMEOVER';
      }
    }
  }

  return nextState;
};
