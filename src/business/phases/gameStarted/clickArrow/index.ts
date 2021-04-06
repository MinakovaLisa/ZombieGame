import {
  MoveDirection,
  CellType,
  State,
  PlayersListType,
  GameField,
} from "../../../types";
import { ActionType } from "../../../reducer";

import { сhangePlayerCoord } from "./changePlayerCoord";

// TODO: функция слишком громоздкая, разделить на нексколько более явных
const getNewState = (state: State, newPlayerCoord: string) => {
  const { gameField, playersList, numberOfPlayer, dice } = { ...state };

  const newCellWithPlayer = gameField.values[newPlayerCoord];
  const newPlayerList = {
    ...playersList,
    [numberOfPlayer]: {
      ...playersList[numberOfPlayer],
      coord: newPlayerCoord,
    },
  };

  const playerLeftTheField = newCellWithPlayer ? false : true;
  const takeFinish = newCellWithPlayer?.name === "finish";

  const takeHealthCard =
    newCellWithPlayer?.name === "commonCell" &&
    newCellWithPlayer?.cardItem.healthItem !== undefined;

  const metEnemyCard =
    newCellWithPlayer?.name === "commonCell" &&
    state.enemiesList[newPlayerCoord]
      ? true
      : false;

  const isLastStepOfMove = dice === 1;

  const isNextCellOcupied = checkNextCellOccupied(
    playersList,
    newPlayerCoord,
    numberOfPlayer
  );

  const canNotTakeCell = isLastStepOfMove && isNextCellOcupied;

  switch (true) {
    case playerLeftTheField: {
      return state;
    }

    case takeFinish: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameResult: "Вы выиграли",
        playersList: newPlayerList,
      };
      return newState;
    }

    case takeHealthCard: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          type: "gameStarted.takeHealthCard",
        },
        doEffect: { type: "!needOpenHealthCard" },
        playersList: newPlayerList,
      };
      return newState;
    }

    case metEnemyCard: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          type: "gameStarted.interactEnemyCard",
        },
        doEffect: { type: "!needCheckApperanCeEnemyCard" },
        playersList: newPlayerList,
      };
      return newState;
    }

    case canNotTakeCell: {
      console.log("ячейка занята");
      return state;
    }

    case isLastStepOfMove: {
      const newState: State = {
        ...state,
        dice: 0,
        gameState: {
          type: "gameStarted.getOrder",
        },
        doEffect: {
          type: "!getNextPlayer",
        },
        playersList: newPlayerList,
      };
      return newState;
    }

    default: {
      const newState: State = {
        ...state,
        dice: state.dice - 1,
        gameState: {
          type: "gameStarted.clickArrow",
        },
        playersList: newPlayerList,
      };
      return newState;
    }
  }
};


const checkNextCellOccupied = (
  playersList: PlayersListType,
  newCoord: string,
  playersNumber: number
): boolean => {
  const iterablePlayerList = Object.entries(playersList);
  const isCellOccupied = iterablePlayerList.some((player) => {
    const [, playerValue] = player;
    return playerValue.coord === newCoord;
  });
  return isCellOccupied;
};

export const clickArrow = (action: ActionType, state: State): State => {
  switch (action.type) {
    case "arrowPressed": {
      const direction = action.payload;
      const { gameField, playersList, numberOfPlayer } = { ...state };
      const prevPlayerCoord = playersList[numberOfPlayer].coord;
      const newPlayerCoord = сhangePlayerCoord(prevPlayerCoord, direction);

      const isPlayerOnGameField = gameField.values[newPlayerCoord];

      const newState = getNewState(state, newPlayerCoord);
      return newState;
    }

    default: {
      return state;
    }
  }
};
