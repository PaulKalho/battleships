import { type FieldProps } from "../types";

export default function Field({ isShip, isBombed }: FieldProps) {
  return (
    <span
      style={{
        display: "inline-block",
        border: "1px solid black",
        padding: "15px",
        color: isShip ? "red" : "white",
        margin: "1px",
        width: "25px",
        height: "25px",
      }}
    >
      {isShip ? <span>S</span> : isBombed ? "X" : 0}
    </span>
  );
}
