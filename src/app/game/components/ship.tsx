"use client";
import Field from "./field";
import { type Ship } from "../types";

function boatfields(length: number): Array<any> {
  var arr: Array<any> = [];
  for (var i = 0; i < length; i++) {
    arr.push(
      <div>
        <Field isShip={true} isBombed={false} />
      </div>
    );
  }

  return arr;
}

export default function Ship({ name, length }: Ship) {
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
