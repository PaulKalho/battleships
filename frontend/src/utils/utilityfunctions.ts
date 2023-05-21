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

  //1. Check if start or end of ship is out of boundary
  if (insertedShip.horizontal) {
    var shipSnE = [x, x + insertedShip.length - 1];
    if (!(isFieldValid(y, shipSnE[0]) && isFieldValid(y, shipSnE[1])))
      return false;
  } else {
    var shipSnE = [y, y + insertedShip.length - 1];
    if (!(isFieldValid(shipSnE[0], x) && isFieldValid(shipSnE[1], x)))
      return false;
  }

  var shipNurroundingFields = [];
  // This array contains all *valid* surronding fields of a ship (Rules 2, 3)
  // X = Field A = Inside Array
  // X X X X X X X
  // X A A A A A X
  // X A A A A A X
  // X A A A A A X
  // X X X X X X X

  if (insertedShip.horizontal) {
    //Check if last or first index is out of boundary
    //Ship goes from x to x+ship.length - 1

    for (let j = -1; j < 2; j++) {
      // row from -1 to 1 (-1: one row above ship) (0: ship row) (1: one row below ship)
      for (let i = -1; i < insertedShip.length + 1; i++) {
        // col from -1 to ship.length + 1 -> Also get field before and after
        if (isFieldValid(y + j, x + i))
          shipNurroundingFields.push(board[y + j][x + i]);
      }
    }
  } else {
    for (let j = -1; j < 2; j++) {
      //This time: col from -1: one left, 0: ship col, 1: one right
      for (let i = -1; i < insertedShip.length + 1; i++) {
        if (isFieldValid(y + i, x + j))
          shipNurroundingFields.push(board[y + i][x + j]);
      }
    }
  }

  for (let i = 0; i < shipNurroundingFields.length; i++) {
    if (shipNurroundingFields[i].isShip) allRulesFulfilled = false;
  }

  return allRulesFulfilled;
}

function isFieldValid(y: number, x: number): Boolean {
  if (x > BOARD_WIDTH - 1 || x < 0) return false;
  if (y > BOARD_HEIGHT - 1 || y < 0) return false;
  return true;
}
