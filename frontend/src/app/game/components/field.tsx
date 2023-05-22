import React from "react";

type FieldProps = {
  isShip: boolean;
  isBombed: boolean;
  isHit: boolean;
};

const Field = ({ isShip, isBombed, isHit }: FieldProps): React.ReactElement => {
  let fieldColor = "lightblue";

  if (isBombed && isShip) {
    fieldColor = "red"; // Feld mit getroffenem Schiff
  } else if (isBombed) {
    fieldColor = "gray"; // Feld ohne Schiff, aber getroffen
  } else if (isShip) {
    fieldColor = "darkblue"; // Feld mit Schiff, nicht getroffen
  } else if (isHit) {
    fieldColor = "green";
  }
  const fieldStyle = {
    background: fieldColor,
    border: "1px solid black",
    width: "50px",
    height: "50px",
  };

  return <div className="field" style={fieldStyle}></div>;
};

export default Field;
