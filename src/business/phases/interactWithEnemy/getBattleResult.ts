import { State } from "../../types";

export const getBattleResult = (state: State): State => {
  const { dice } = state;

  switch (dice) {
    case 1:
    case 2: {
      return getStatePlayerCanFight(state);
    }

    case 3: {
      return getStatePlayetLoseHealth(state);
    }

    case 4: {
      return getStatePlayerRunsAway(state);
    }
    default:
      return state;
  }
};

const getStatePlayerCanFight = (state: State): State => {
  //Player can use weapon or rethrow dice
  return {
    ...state,
    dice: 0,
    gameState: { type: "interactWithEnemy.makeBattleAction" },
  };
};

const getStatePlayerRunsAway = (state: State): State => {
  return {
    ...state,
    dice: 0,
    gameState: {
      type: "gameStarted.trownDice",
    },
  };
};

const getStatePlayetLoseHealth = (state: State): State => {
  const { playerList, numberOfPlayer } = state;
  const newPlayerHealth = playerList[numberOfPlayer].health - 1;
  const isPlayerAlive = newPlayerHealth > 0 ? true : false;

  const newPlayerList = {
    ...playerList,
    [numberOfPlayer]: {
      ...playerList[numberOfPlayer],
      health: playerList[numberOfPlayer].health - 1,
    },
  };

  if (isPlayerAlive) {
    const newState: State = {
      ...state,
      dice: 0,
      gameState: { type: "interactWithEnemy.throwBattleDice" },
      playerList: newPlayerList,
    };

    return newState;
  } else {
    console.log(`игрок №${numberOfPlayer} погиб`);

    return {
      ...state,
      gameState: { type: "endGame" },
      gameResult: "Вы проиграли",
      doEffect: null,
    };
  }
};