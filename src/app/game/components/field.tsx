type FieldProps = {
  isShip: Boolean;
  isBombed: Boolean;
};

export default function Field({ isShip, isBombed }: FieldProps) {
  return (
    <span
      style={{
        border: "1px solid black",
        padding: "15px",
        marginRight: "10px",
        color: isShip ? "red" : "white",
      }}
    >
      {isShip ? <span>S</span> : isBombed ? "X" : 0}
    </span>
  );
}
