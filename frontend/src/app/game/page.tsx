"use client";

import Board from "./components/board";
import Inventory from "./components/inventory";
import { FIELD, OPPONENT_FIELD, INVENTORY } from "@/utils/constants";
import { useEffect, useState } from "react";
import { collisionHandler } from "@/utils/utilityfunctions";
import { FieldProps, Coordinates } from "./types";
import { useGlobalContext } from "../context/store";
import { useSearchParams, useRouter } from "next/navigation";
import { textSpanIntersectsWithTextSpan } from "typescript";

/**
 *
 * This component is the game-board
 */
export default function Home() {
  const opponentField = OPPONENT_FIELD.map((i) => [...i]);
  const playerField = FIELD.map((i) => [...i]);

  const { socket } = useGlobalContext();
  const searchParams = useSearchParams();

  const [boardDataS, setBoardDataS] = useState(playerField);
  const [gameId, setGameId] = useState<string>();
  const [boardDataAttacker, setBoardDataAttacker] = useState(opponentField);
  const [inventory, setInventory] = useState([...INVENTORY]);
  const [shipPositions, setShipPositions] = useState<Array<any>>([]);
  const [waiting, setWaiting] = useState(true);
  const [currentShip, setCurrentShip] = useState({
    name: "default",
    length: 0,
    horizontal: true,
  });

  type wasBombedParams = {
    rowNum: number;
    colNum: number;
  };

  useEffect(() => {
    //Generate Game ID:
    var val = Math.floor(1000 + Math.random() * 9000);

    if (searchParams.get("id") === null) setGameId(val.toString());
    else setGameId(searchParams.get("id"));

    //Check if Game starts:
    socket.on("start-game", () => {
      setWaiting(false);
      // Its this clients turn
    });

    socket.on("was-bombed", ({ rowNum, colNum }: wasBombedParams) => {
      var workBoard = [...boardDataS];

      workBoard[rowNum][colNum].isBombed = true;

      setBoardDataS(workBoard);
      setWaiting(false);
    });
  }, [shipPositions]);

  function handleDropOnBoard(
    e: React.DragEvent<HTMLSpanElement>,
    colNum: number,
    rowNum: number
  ): void {
    //In this function we place a ship on the board

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
      }
      var shipPositionsNew: Array<Array<Coordinates>> = [...shipPositions];
      shipPositionsNew.push(shipPositionsWork);
      console.log(shipPositionsNew);
      setShipPositions(shipPositionsNew);
      setBoardDataS(workBoard);

      //And finally delete the used Ship from the inventory
      var workInventory = [...inventory];
      workInventory = workInventory.filter((item) => item !== currentShip);
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
    if (waiting === false) {
      var workBoard: Array<Array<FieldProps>> = [...boardDataAttacker];

      workBoard[rowNum][colNum] = {
        isShip: false,
        isBombed: true,
        shipIndex: workBoard[rowNum][colNum].shipIndex,
      };

      setBoardDataAttacker(workBoard);
      //Send Data to socket
      socket.emit("bomb", {
        x: colNum,
        y: rowNum,
      });

      setWaiting(true);
    }
  }

  function joinGame(): void {
    socket.emit("join_game", { gameId: gameId });
  }

  function handleDropAttacker(
    e: React.DragEvent<HTMLSpanElement>,
    colNum: number,
    rowNum: number
  ): void {}
  return (
    <div>
      {waiting ? "Warten" : "Du bsit an der reihe"}
      {gameId}
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
      <div>
        <button className="ready" onClick={joinGame}>
          Bereit
        </button>
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
