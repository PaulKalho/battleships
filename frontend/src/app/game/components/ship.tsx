"use client";
import Field from "./field";
import { type Ship } from "../types";
import { transform } from "typescript";

function boatfields(length: number): Array<any> {
  var arr: Array<any> = [];
  for (var i = 0; i < length; i++) {
    arr.push(
      <div key={i}>
        <Field isShip={true} isBombed={false} />
      </div>
    );
  }

  return arr;
}

export default function Ship({ name, length, horizontal }: Ship) {
  return (
    <div style={{}}>
      {boatfields(length).map((item, index) => (
        <div
          draggable="false"
          style={
            horizontal ? { display: "inline-block" } : { display: "block" }
          }
          key={index}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
