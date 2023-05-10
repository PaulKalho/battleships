"use client";

import { INVENTORY } from "@/utils/constants";
import Ship from "./ship";
import { useState } from "react";

type InventoryParams = {
  inventory: Array<Ship>;
  setCurrentShip: Ship;
};

type Ship = {
  name: string;
  length: number;
};

export default function Inventory({
  inventory,
  setCurrentShip,
}: InventoryParams) {
  function onDragStart(e: React.DragEvent<HTMLDivElement>, ship: Ship): void {
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
