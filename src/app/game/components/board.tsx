"use client";

import { ReactElement } from "react";
import Field from "./field";
import { type BoardProps, type ColProps } from "../types";

function Cols({ row, handleDrop, rowNum }: ColProps): ReactElement {
  function handleDragOver(e: React.DragEvent<HTMLSpanElement>) {
    e.preventDefault();
  }

  return (
    <div>
      {row.map((col, colNum) => (
        <span
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, colNum, rowNum)}
        >
          <Field isBombed={col.isBombed} isShip={col.isShip} />
        </span>
      ))}
    </div>
  );
}

export default function Board({ boardData, handleDrop }: BoardProps) {
  return (
    <main>
      {boardData.map((row, index) => (
        <Cols row={row} handleDrop={handleDrop} rowNum={index} />
      ))}
    </main>
  );
}
