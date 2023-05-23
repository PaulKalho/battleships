"use client";

import Ship from "./ship";
import { type Ship as TypeShip, type InventoryParams } from "../types";

export default function Inventory({
  draggable,
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
      {draggable ? "Inventar" : "Restliche gegnerische Schiffe:"}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gridAutoRows: "auto",
        }}
      >
        {inventory.map((ship, index) => (
          <div
            draggable={draggable}
            style={{
              width: "max-content",
              marginBottom: "25px",
              padding: "10px",
            }}
            onDragStart={(e) => onDragStart(e, ship)}
            onClick={(e) => handleClick(e, ship)}
            key={index}
          >
            <Ship
              name={ship.name}
              length={ship.length}
              horizontal={ship.horizontal}
              destroyed={ship.destroyed}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
