import { Ship, FieldProps } from "@/app/game/types";
import { BOARD_WIDTH, BOARD_HEIGHT } from "./constants";
export function collisionHandler(
  board: Array<Array<FieldProps>>,
  insertedShip: Ship,
  x: number,
  y: number
) {
  //This function analyzes given data for the game-rules
  //Rules:
  //1. Ship has to be in boundarys (WIDTH, HEIGHT)
  //2. Ships should not collide together
  //3. Ships not directly next to each other

  var allRulesFulfilled = true;
  const insertedShipLength = insertedShip.length;

  //First: I want an array containing all fields a ship is on, and check if its in boundarys
  var boardFieldsCurrentShip = [];

  if (insertedShip.horizontal) {
    for (let i = 0; i < insertedShipLength; i++) {
      if (x + i > BOARD_WIDTH - 1) {
        //1. Ship has to be in boundarys (horizontally)
        allRulesFulfilled = false;
        break;
      }
      boardFieldsCurrentShip.push(board[y][x + i]);
    }
  } else {
    for (let i = 0; i < insertedShipLength; i++) {
      if (y + i > BOARD_HEIGHT - 1) {
        //1. Ship has to be in boundarys (vertically)
        allRulesFulfilled = false;
        break;
      }

      boardFieldsCurrentShip.push(board[y + i][x]);
    }
  }

  //Check if one of the fields i want to put a ship on, has already a ship on it
  for (let i = 0; i < boardFieldsCurrentShip.length; i++) {
    if (boardFieldsCurrentShip[i].isShip) {
      allRulesFulfilled = false;
      break;
    }
    console.log(boardFieldsCurrentShip);
  }

  //Check if neighbors are a ship
  var boardFieldsShipNeighbors = [];
  var test = [];
  if (insertedShip.horizontal) {
    //push the coordinate 1 before the ship:
    if (!(x - 1 < 0)) boardFieldsShipNeighbors.push(board[y][x - 1]);
    for (let i = -1; i <= insertedShipLength; i++) {
      //For-loop starting at - 1 because we want sth like a border around the ship
      // X X X X X
      // X S S S X
      // X X X X X
      //push all coordinates 1 over the ship, if not out of boundary
      if (
        !(y + 1 > BOARD_HEIGHT - 1) &&
        !(x + i < 0) &&
        !(x + 1 > BOARD_WIDTH - 1)
      )
        boardFieldsShipNeighbors.push(board[y + 1][x + i]);

      //push all coordinates 1 below the ship, if not out of boundary
      if (!(y - 1 < 0) && !(x + i < 0) && !(x + 1 > BOARD_WIDTH - 1))
        boardFieldsShipNeighbors.push(board[y - 1][x + i]);
    }
    //push the last coordinate:
    if (!(x + insertedShipLength > BOARD_WIDTH - 1))
      boardFieldsShipNeighbors.push(board[y][x + insertedShipLength]);
  } else {
    for (let i = 0; i < insertedShipLength; i++) {}
  }

  //Traverse through neighbors and check if ship
  for (let i = 0; i < boardFieldsShipNeighbors.length; i++) {
    if (boardFieldsShipNeighbors[i].isShip) {
      allRulesFulfilled = false;
      break;
    }
  }

  //Idea is to add all fields to an array, containing its neighbors and the ship itself, check if nothin isShip === treu
  //Write a function which check if coordinates are in boundary

  return allRulesFulfilled;
}
