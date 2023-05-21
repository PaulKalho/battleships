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

  function handleClick(e: React.MouseEvent, ship: TypeShip): void {
    var work = [...inventory];
    var idx = work.findIndex((shipA) => shipA.name === ship.name);
    work[idx].horizontal = !work[idx].horizontal;

    setInventory(work);
  }

  return (
    <div className="inventory">
      Inventar:
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gridAutoRows: "auto",
        }}
      >
        {inventory.map((ship) => (
          <div
            draggable="true"
            style={{
              width: "max-content",
              marginBottom: "25px",
              padding: "10px",
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
    </div>
  );
}
