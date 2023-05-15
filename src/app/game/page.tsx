"use client";

import Board from "./components/board";
import Inventory from "./components/inventory";
import { FIELD, INVENTORY } from "@/utils/constants";
import { useState } from "react";
import { collisionHandler } from "@/utils/utilityfunctions";
export default function Home() {
  const [boardDataS, setBoardDataS] = useState([...FIELD]);
  const [inventory, setInventory] = useState([...INVENTORY]);
  const [shipPositions, setShipPositions] = useState([]);
  const [currentShip, setCurrentShip] = useState({
    name: "default",
    length: 0,
    horizontal: true,
  });

  function handleDropOnBoard(
    e: React.DragEvent<HTMLSpanElement>,
    colNum: number,
    rowNum: number
  ): void {
    //In this function we place a ship on the board

    //TODO: Implement a rules handler
    if (collisionHandler(boardDataS, currentShip, colNum, rowNum)) {
      var workBoard = [...boardDataS];
      const shipLength = currentShip.length;
      var shipPositionsWork = []; //Contains the position of the ship

      if (currentShip.horizontal) {
        //Edit the workBoard(we want to draw the ship horizontally)
        for (let i = 0; i < shipLength; i++) {
          shipPositionsWork.push({ y: rowNum, x: colNum + i });
          workBoard[rowNum][colNum + i] = {
            isShip: true,
            isBombed: false,
            shipIndex: shipPositions.length,
          };
        }
      } else {
        //Draw it vertically
        for (let i = 0; i < shipLength; i++) {
          shipPositionsWork.push({ x: rowNum + i, y: colNum });
          workBoard[rowNum + i][colNum] = {
            isShip: true,
            isBombed: false,
            shipIndex: shipPositions.length,
          };
        }
        console.log(workBoard);
      }
      var shipPositionsNew = [...shipPositions];
      shipPositionsNew.push(shipPositionsWork);
      setShipPositions(shipPositionsNew);

      setBoardDataS(workBoard);
      //And finally delete the used Ship from the inventory

      var workInventory = [...inventory];
      workInventory = workInventory.filter((item) => item !== currentShip);
      console.log(workInventory);
      setInventory(workInventory);
    } else {
      //Do nothin
    }
  }

  return (
    <div>
      <Board boardData={boardDataS} handleDrop={handleDropOnBoard} />
      <Inventory
        inventory={inventory}
        setInventory={setInventory}
        setCurrentShip={setCurrentShip}
      />
    </div>
  );
}
