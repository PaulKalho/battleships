"use client";

import {
  DragEventHandler,
  ReactComponentElement,
  ReactElement,
  useState,
} from "react";
import Field from "./field";
import { handleClientScriptLoad } from "next/script";
import { getConfigFileParsingDiagnostics } from "typescript";

type FieldData = {
  isShip: Boolean;
  isBombed: Boolean;
};

type BoardProps = {
  boardData: Array<Array<FieldData>>;
  handleDrop: Function;
};

type ColProps = {
  row: Array<FieldData>;
  handleDrop: Function;
  rowNum: number;
};

function getIndexes(startField: EventTarget): Array<number> {
  return [1, 2, 3];
}

function Cols({ row, handleDrop, rowNum }: ColProps): ReactElement {
  function handleDragOver(e: React.DragEvent<HTMLSpanElement>) {
    e.preventDefault();
  }
  // function handleDrop(e: React.DragEvent<HTMLSpanElement>) {
  //   e.preventDefault();
  //   const startField = e.target;

  //   getIndexes(startField);

  //   //we have to draw the ship on the startField
  //   //get ShipInfo
  //   console.log(e);
  // }
  return (
    <div style={{ marginBottom: "45px" }}>
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
