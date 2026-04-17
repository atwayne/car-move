export const GRID_SIZE = 6;
export const EXIT_COLUMN = 3;
export const CELL_SIZE = 64;
export const CELL_GAP = 6;
export const STEP_ANIMATION_MS = 240;

export const COLOR_PALETTE = ["red", "green", "yellow", "purple", "black", "blue"];

export const POLICE_CAR_ID = "police-car";

export const POLICE_CAR = {
  id: POLICE_CAR_ID,
  length: 2,
  orientation: "vertical",
  row: 0,
  col: 3,
  color: "#8aa2c8",
  isPolice: true,
};

// Developer-editable move list placeholder.
export const DEV_MOVE_LIST = [
  { carId: POLICE_CAR_ID, direction: "down", steps: 4 },
];

export const COLOR_MAP = {
  red: "#cf4a4a",
  green: "#4caf6f",
  yellow: "#ceb454",
  purple: "#9a62c8",
  black: "#212832",
  blue: "#4f80dd",
};
