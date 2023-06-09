type FieldProps = {
  isShip: boolean;
  isBombed: boolean;
  isHit: boolean;
  shipIndex: any;
};

type Coordinates = {
  x: number;
  y: number;
};

type BoardProps = {
  boardData: Array<Array<FieldProps>>;
  handleDrop: Function;
  handleClick: Function;
};

type ColProps = {
  row: Array<FieldProps>;
  handleDrop: Function;
  rowNum: number;
};

type InventoryParams = {
  draggable: boolean;
  inventory: Array<Ship>;
  setInventory: Function;
  setCurrentShip: Function;
};

type Ship = {
  name: string;
  length: number;
  horizontal: Boolean;
  destroyed: boolean;
};

export {
  type FieldProps,
  type BoardProps,
  type ColProps,
  type Ship,
  type InventoryParams,
  type Coordinates,
};
