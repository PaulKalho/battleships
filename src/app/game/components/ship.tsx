"use client";
import { constrainedMemory } from "process";
import { ReactComponentElement, ReactElement, ReactHTML } from "react";
import Field from "./field";

type ShipData = {
  name: string;
  length: number;
};

function boatfields(length: number): Array<any> {
  var arr: Array<any> = [];
  for (var i = 0; i < length; i++) {
    arr.push(<Field isShip={true} isBombed={false} />);
  }

  return arr;
}

export default function Ship({ name, length }: ShipData) {
  function log(name: string): void {
    console.log(name);
  }

  return (
    <main>
      <div style={{ marginBottom: "50px" }} onClick={() => log(name)}>
        {boatfields(length).map((item) => (
          <div draggable="false" style={{ display: "inline-block" }}>
            {item}
          </div>
        ))}
      </div>
    </main>
  );
}
