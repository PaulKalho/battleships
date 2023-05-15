import { ReactElement, useState } from "react";
import Field from "./field";
import { type BoardProps } from "../types";

export default function Board({ boardData, handleDrop }: BoardProps) {
  const [draggedElements, setDraggedElements] = useState<HTMLElement[]>([]);

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    const groupElements = Array.from(
      document.getElementsByClassName("ship " + index)
    ) as HTMLElement[];

    groupElements.forEach((element) => {
      element.classList.add("dragging");
      element.style.transform = "translate(0px, 0px)";
    });

    e.dataTransfer.setData("text/plain", "");
    setDraggedElements(groupElements);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const offsetX = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const offsetY = e.clientY - e.currentTarget.getBoundingClientRect().top;

    draggedElements.forEach((element) => {
      element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  };

  const handleDragEnd = () => {
    draggedElements.forEach((element) => {
      element.classList.remove("dragging");
      element.style.transform = ""; // Zurücksetzen der Transformationswerte
    });

    setDraggedElements([]);
  };

  return (
    <div className="game-board">
      {boardData.map((row, y) => (
        <div key={y} className="row" style={{ display: "flex" }}>
          {row.map((field, x) => (
            <div
              key={`${x}-${y}`}
              className={`field ${field.isShip ? "ship" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, x, y)}
            >
              {field.isShip ? (
                <div
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, field.shipIndex)}
                  onDrag={(e) => handleDrag(e)}
                  onDragEnd={handleDragEnd}
                  className={`ship ${field.shipIndex}`}
                >
                  <Field isBombed={field.isBombed} isShip={field.isShip} />
                </div>
              ) : (
                <div className="field">
                  <Field isBombed={field.isBombed} isShip={field.isShip} />
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      <style>
        {`.dragging {
            position: relative;
            z-index: 9999;
          }`}
      </style>
    </div>
  );
}
