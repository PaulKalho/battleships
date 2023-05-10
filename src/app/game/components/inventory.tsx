"use client";

import Ship from "./ship";
import { type Ship as TypeShip, type InventoryParams } from "../types";

export default function Inventory({
  inventory,
  setCurrentShip,
}: InventoryParams) {
  function onDragStart(
    e: React.DragEvent<HTMLDivElement>,
    ship: TypeShip
  ): void {
    console.log(e);
    setCurrentShip(ship);
  }

  return (
    <main>
      <h1>Inventar:</h1>
      {inventory.map((ship) => (
        <div draggable="true" onDragStart={(e) => onDragStart(e, ship)}>
          <Ship name={ship.name} length={ship.length} />
        </div>
      ))}
    </main>
  );
}
