"use client";

import Board from "./components/board";
import Inventory from "./components/inventory";

import {
  FIELD,
  OPPONENT_FIELD,
  INVENTORY,
  OPPONENT_SHIPS,
  GAME_CONDITIONS,
} from "@/utils/constants";
import { useEffect, useState } from "react";
import { collisionHandler } from "@/utils/utilityfunctions";
import { FieldProps, Coordinates } from "./types";
import { useGlobalContext } from "../context/store";
import { useSearchParams } from "next/navigation";

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
  const [boardDataAttacker, setBoardDataAttacker] = useState(opponentField);

  const [gameStatus, setGameStatus] = useState(GAME_CONDITIONS.SELECT_FIELD);
  const [gameId, setGameId] = useState<string | null>();

  const [inventory, setInventory] = useState([...INVENTORY]);
  const [shipPositions, setShipPositions] = useState<Array<any>>([]);
  const [currentShip, setCurrentShip] = useState({
    name: "default",
    length: 0,
    horizontal: true,
    destroyed: false,
  });
  const [opponentShips, setOpponentShips] = useState([...OPPONENT_SHIPS]);

  type wasBombedParams = {
    rowNum: number;
    colNum: number;
  };

  type shipDestroyedParams = {
    shipLength: number;
  };

  useEffect(() => {
    //Generate Game ID:
    var val = Math.floor(1000 + Math.random() * 9000);

    if (searchParams.get("id") === null) setGameId(val.toString());
    else setGameId(searchParams.get("id"));

    //Check if Game starts:
    socket.on("start-game", () => {
      // Its this clients turn
      setGameStatus(GAME_CONDITIONS.PLAY);
    });

    // was-bombed -> Opponent bombed a field
    socket.on("was-bombed", ({ rowNum, colNum }: wasBombedParams) => {
      var workBoard = [...boardDataS];

      workBoard[rowNum][colNum].isBombed = true;

      setBoardDataS([...workBoard]);
      setGameStatus(GAME_CONDITIONS.PLAY);
    });

    // was-a-hit -> Player hit a ship on opponent Field
    socket.on("was-a-hit", ({ rowNum, colNum }: wasBombedParams) => {
      var workBoard = [...boardDataAttacker];

      workBoard[rowNum][colNum] = {
        isShip: false,
        isBombed: false,
        shipIndex: undefined,
        isHit: true,
      };

      setBoardDataAttacker([...workBoard]);
    });

    //ship-destroyed -> Player destroyed a ship
    socket.on("ship-destroyed", ({ shipLength }: shipDestroyedParams) => {
      //TODO: Remove the destroyed ship from the opponentShips array!

      if (opponentShips.length === 0) {
        //GAME WON!!!!
        console.log("DU GEWINNST");
      }
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
            isHit: false,
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
            isHit: false,
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
    if (gameStatus === GAME_CONDITIONS.PLAY) {
      var workBoard: Array<Array<FieldProps>> = [...boardDataAttacker];

      workBoard[rowNum][colNum] = {
        isShip: false,
        isBombed: true,
        shipIndex: workBoard[rowNum][colNum].shipIndex,
        isHit: false,
      };

      setBoardDataAttacker(workBoard);
      //Send Data to socket
      socket.emit("bomb", {
        x: colNum,
        y: rowNum,
      });

      setGameStatus(GAME_CONDITIONS.WAIT_FOR_BOMB);
    }
  }

  function joinGame(): void {
    socket.emit("join_game", {
      gameId: gameId,
      boardData: boardDataS,
      shipPositions: shipPositions,
    });
    setGameStatus(GAME_CONDITIONS.WAIT_FOR_PLAYER);
  }

  function handleDropAttacker(
    e: React.DragEvent<HTMLSpanElement>,
    colNum: number,
    rowNum: number
  ): void {}
  return (
    <div>
      <h1>{gameStatus.desc}</h1>
      {gameId}
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            opacity: gameStatus === GAME_CONDITIONS.SELECT_FIELD ? "1" : "0.2",
          }}
        >
          <Board
            boardData={boardDataS}
            handleDrop={handleDropOnBoard}
            handleClick={(e: React.MouseEvent) => {
              e.preventDefault();
            }}
          />
        </div>
        <Inventory
          draggable={true}
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
          display: "flex",
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
        {/* A deactivated Inventory which show remaining ships of the opponent */}
        <Inventory
          draggable={false}
          inventory={opponentShips}
          setInventory={() => {}}
          setCurrentShip={() => {}}
        />
      </div>
    </div>
  );
}
