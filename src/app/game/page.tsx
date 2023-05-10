"use client";

import Board from "./components/board";
import Inventory from "./components/inventory";
import { FIELD, INVENTORY } from "@/utils/constants";
import { useState } from "react";

export default function Home() {
  const [boardDataS, setBoardDataS] = useState([...FIELD]);
  const [inventory, setInventory] = useState([...INVENTORY]);
  const [currentShip, setCurrentShip] = useState({ length: 0 });

  function handleDropOnBoard(
    e: React.DragEvent<HTMLSpanElement>,
    colNum: number,
    rowNum: number
  ): void {
    //In this function we place a ship on the board

    //TODO: Implement a rules handler

    var workBoard = [...boardDataS];
    const shipLength = currentShip.length;

    //Edit the workBoard(we want to draw the ship)
    for (let i = 0; i < shipLength; i++) {
      workBoard[rowNum][colNum + i] = {
        isShip: true,
        isBombed: false,
      };
    }

    setBoardDataS(workBoard);
    //And finally delete the used Ship from the inventory

    var workInventory = [...inventory];
    workInventory = workInventory.filter((item) => item !== currentShip);
    console.log(workInventory);
    setInventory(workInventory);
  }

  function log(e: MouseEvent): void {
    console.log(currentShip);
  }

  return (
    <div>
      <Board boardData={boardDataS} handleDrop={handleDropOnBoard} />
      <Inventory inventory={inventory} setCurrentShip={setCurrentShip} />
    </div>
  );
}
