"use client";

import Board from "./components/board";
import Inventory from "./components/inventory";
import { FIELD, INVENTORY } from "@/utils/constants";
import { useEffect, useState } from "react";
import { collisionHandler } from "@/utils/utilityfunctions";
import { FieldProps, Coordinates } from "./types";
import { io } from "socket.io-client";

export default function Home() {
  const playerField = FIELD.map((i) => [...i]);
  const opponentField = FIELD.map((i) => [...i]);
  const [boardDataS, setBoardDataS] = useState(playerField);
  const [boardDataAttacker, setBoardDataAttacker] = useState(opponentField);

  const [inventory, setInventory] = useState([...INVENTORY]);
  const [shipPositions, setShipPositions] = useState([[{ x: 0, y: 0 }]]);
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
    console.log(boardDataAttacker);
    //TODO: Implement a rules handler
    if (collisionHandler(boardDataS, currentShip, colNum, rowNum)) {
      var workBoard: Array<Array<FieldProps>> = [...boardDataS];
      const shipLength = currentShip.length;
      var shipPositionsWork: Array<Coordinates> = []; //Contains the position of the ship

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
        console.log(workBoard);
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
      var shipPositionsNew: Array<Array<Coordinates>> = [...shipPositions];
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

  function handleOnClick(
    e: React.MouseEvent,
    colNum: number,
    rowNum: number
  ): void {
    var workBoard: Array<Array<FieldProps>> = [...boardDataAttacker];

    workBoard[rowNum][colNum] = {
      isShip: false,
      isBombed: true,
      shipIndex: workBoard[rowNum][colNum].shipIndex,
    };

    setBoardDataAttacker(workBoard);
  }

  function handleDropAttacker(
    e: React.DragEvent<HTMLSpanElement>,
    colNum: number,
    rowNum: number
  ): void {}
  return (
    <div>
      <div style={{ display: "flex", width: "100%" }}>
        <Board
          boardData={boardDataS}
          handleDrop={handleDropOnBoard}
          handleClick={(e) => {
            e.preventDefault();
          }}
        />
        <Inventory
          inventory={inventory}
          setInventory={setInventory}
          setCurrentShip={setCurrentShip}
        />
      </div>
      <div
        style={{
          width: "100%",
        }}
      >
        {/* The opponent-Board: */}
        Feind:
        <Board
          boardData={boardDataAttacker}
          handleDrop={handleDropAttacker}
          handleClick={handleOnClick}
        />
      </div>
    </div>
  );
}
