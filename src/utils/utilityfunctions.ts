import { Ship, FieldProps } from "@/app/game/types";

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
}
