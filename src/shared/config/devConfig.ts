import { PROD_CONFIG } from ".";
import { ConfigType } from "../../business/types";
import { CELLS_BARRIERS_LIST } from "./walls";

export const DEV_CONFIG: ConfigType = {
  cellsBarrierList: CELLS_BARRIERS_LIST,
  startCoord: { hor: 0, vert: 0 },
  finishCoord: { hor: 11, vert: 11 },
  amountPlayers: 1,
  initialPlayerHealth: 3,
  amountHealthItems: 30,
  amountBoardsItems: 30,
  amountWeaponsItems: 30,
  amountEnemies: 300,
  cardApperance: "open",
  playGridMode: "cssStyle",
};
