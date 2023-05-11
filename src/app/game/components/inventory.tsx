"use client";

import Ship from "./ship";
import { type Ship as TypeShip, type InventoryParams } from "../types";

export default function Inventory({
  inventory,
  setInventory,
  setCurrentShip,
}: InventoryParams) {
  function onDragStart(
    e: React.DragEvent<HTMLDivElement>,
    ship: TypeShip
  ): void {
    console.log(e);
    setCurrentShip(ship);
  }

  function handleClick(e: MouseEvent, ship: TypeShip): void {
    var work = [...inventory];
    var idx = work.findIndex((shipA) => shipA.name === ship.name);
    work[idx].horizontal = !work[idx].horizontal;

    setInventory(work);
  }

  return (
    <main>
      <h1>Inventar:</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gridAutoRows: "auto",
        }}
      >
        {inventory.map((ship) => (
          <div
            draggable="true"
            style={{
              width: "max-content",
              marginBottom: "25px",
            }}
            onDragStart={(e) => onDragStart(e, ship)}
            onClick={(e) => handleClick(e, ship)}
          >
            <Ship
              name={ship.name}
              length={ship.length}
              horizontal={ship.horizontal}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
