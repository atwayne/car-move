export const GRID_SIZE = 6;
export const EXIT_COLUMN = 3;
export const CELL_SIZE = 64;
export const CELL_GAP = 6;
export const STEP_ANIMATION_MS = 240;

export const POLICE_CAR_ID = "police-car";

export const POLICE_CAR = {
  id: POLICE_CAR_ID,
  length: 2,
  orientation: "vertical",
  row: 0,
  col: 3,
  color: "#134686",
  isPolice: true,
};

// Developer-editable move list placeholder.
export const DEV_MOVE_LIST = [
  { carId: POLICE_CAR_ID, direction: "down", steps: 4 },
];

export const COLOR_MAP = {
  maroon: "#810000",
  red: "#CE2626",
  peach: "#E97171",
  orange: "#FF4400",
  brown: "#8B4513",
  beige:"#F5F5DC",
  yellow: "#F8DE22",
  sage: "#B2AC88",
  green: "#6BCB77",
  teal: "#03AED2",
  mint: "#A2D5C6",
  blue: "#0079FF",
  navy: "#0D1164",
  purple: "#7E1891",
  pink: "#D12052",
  black: "#040303",
  grey: "#808080",
  white: "#F0F0F0"
};

export const COLOR_PALETTE = Object.keys(COLOR_MAP);