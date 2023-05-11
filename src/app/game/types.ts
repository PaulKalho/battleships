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
  setInventory: Function;
  setCurrentShip: Ship;
};

type Ship = {
  name: string;
  length: number;
  horizontal: Boolean;
};

export {
  type FieldProps,
  type BoardProps,
  type ColProps,
  type Ship,
  type InventoryParams,
};
