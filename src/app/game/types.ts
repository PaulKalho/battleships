type FieldProps = {
  isShip: Boolean;
  isBombed: Boolean;
};

type BoardProps = {
  boardData: Array<Array<FieldProps>>;
  handleDrop: Function;
};

type ColProps = {
  row: Array<FieldProps>;
  handleDrop: Function;
  rowNum: number;
};

type InventoryParams = {
  inventory: Array<Ship>;
  setCurrentShip: Ship;
};

type Ship = {
  name: string;
  length: number;
};

export {
  type FieldProps,
  type BoardProps,
  type ColProps,
  type Ship,
  type InventoryParams,
};
