import React from "react";

type FieldProps = {
  isShip: boolean;
  isBombed: boolean;
};

const Field = ({ isShip, isBombed }: FieldProps): React.ReactElement => {
  const fieldStyle = {
    background: isShip ? "darkgrey" : isBombed ? "red" : "lightblue",
    border: "1px solid black",
    width: "50px",
    height: "50px",
  };

  return <div className="field" style={fieldStyle}></div>;
};

export default Field;
