import Field from "./field";
import { type BoardProps } from "../types";
import { useEffect } from "react";

export default function Board({
  boardData,
  handleDrop,
  handleClick,
}: BoardProps) {
  useEffect(() => {
    console.log(boardData);
  }, []);

  return (
    <div className="game-board">
      {boardData.map((row, y) => (
        <div key={y} className="row" style={{ display: "flex" }}>
          {row.map((field, x) => (
            <div
              key={`${x}-${y}`}
              className={`field ${field.isShip ? "ship" : ""}`}
              onDrop={(e) => handleDrop(e, x, y)}
              onDragOver={(e) => e.preventDefault()}
              onClick={(e) => handleClick(e, x, y)}
            >
              {field.isShip ? (
                <div className={`ship ${field.shipIndex}`}>
                  <Field
                    isBombed={field.isBombed}
                    isShip={field.isShip}
                    isHit={field.isHit}
                  />
                </div>
              ) : (
                <div className="field">
                  <Field
                    isBombed={field.isBombed}
                    isShip={field.isShip}
                    isHit={field.isHit}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
