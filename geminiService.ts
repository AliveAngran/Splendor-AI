
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, Action, GemType, Card } from "./types";
import { canBuyCard } from "./gameLogic";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, enum: ['TAKE_GEMS', 'BUY_CARD', 'RESERVE_CARD'] },
    gems: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: 'Up to 3 unique or 2 identical gem types' 
    },
    cardId: { type: Type.STRING, description: 'ID of the card to buy/reserve' },
    fromBoard: { type: Type.BOOLEAN },
    level: { type: Type.NUMBER }
  },
  required: ['type']
};

export const getAIMove = async (state: GameState): Promise<Action | null> => {
  const player = state.players[state.currentPlayerIndex];
  
  // Rule-based fallback or simple difficulty: Try to buy any card we can afford
  const availableCards = [
    ...state.board.level1.map(c => ({...c, fromBoard: true})),
    ...state.board.level2.map(c => ({...c, fromBoard: true})),
    ...state.board.level3.map(c => ({...c, fromBoard: true})),
    ...player.reservedCards.map(c => ({...c, fromBoard: false}))
  ];

  const affordable = availableCards.filter(c => canBuyCard(player, c));
  if (affordable.length > 0) {
      // Prioritize points
      const best = affordable.sort((a, b) => b.points - a.points)[0];
      return { type: 'BUY_CARD', cardId: best.id, fromBoard: (best as any).fromBoard };
  }

  // If not affordable, use Gemini for high-level strategy
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Splendor Game State: ${JSON.stringify({
          player: { gems: player.gems, bonuses: player.bonuses, score: player.score },
          board: {
              bank: state.board.bank,
              level1: state.board.level1.map(c => ({ id: c.id, cost: c.cost, points: c.points })),
              level2: state.board.level2.map(c => ({ id: c.id, cost: c.cost, points: c.points })),
              level3: state.board.level3.map(c => ({ id: c.id, cost: c.cost, points: c.points })),
          },
          difficulty: state.difficulty
      })}
      
      Suggest the best move. 
      - TAKE_GEMS: List 3 unique colors that help buy a specific goal card.
      - BUY_CARD: If affordable.
      - RESERVE_CARD: To block or secure a card.
      Provide only the JSON action.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: ACTION_SCHEMA,
      }
    });

    const action = JSON.parse(response.text) as Action;
    // Basic validation of AI response
    if (action.type === 'TAKE_GEMS' && (!action.gems || action.gems.length === 0)) {
        // Fallback to taking some gems manually if AI failed schema
        const bank = state.board.bank;
        const neededGems = [GemType.WHITE, GemType.BLUE, GemType.GREEN, GemType.RED, GemType.BLACK].filter(g => bank[g] > 0).slice(0, 3);
        return { type: 'TAKE_GEMS', gems: neededGems };
    }
    return action;
  } catch (error) {
    console.error("Gemini Move Error:", error);
    // Emergency fallback
    const bank = state.board.bank;
    const gems = [GemType.WHITE, GemType.BLUE, GemType.GREEN, GemType.RED, GemType.BLACK].filter(g => bank[g] > 0).slice(0, 3);
    return { type: 'TAKE_GEMS', gems };
  }
};
