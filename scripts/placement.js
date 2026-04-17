import { EXIT_COLUMN, GRID_SIZE, POLICE_CAR_ID } from "./config.js";
import { addCar, createCarId, getCarById, listCars, updateCarPosition } from "./state.js";

export function getCarCells(car) {
  const cells = [];
  for (let i = 0; i < car.length; i += 1) {
    cells.push({
      row: car.row + (car.orientation === "vertical" ? i : 0),
      col: car.col + (car.orientation === "horizontal" ? i : 0),
    });
  }
  return cells;
}

function isInBounds(row, col) {
  return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
}

function occupiesOutOfBounds(car) {
  return getCarCells(car).some(({ row, col }) => !isInBounds(row, col));
}

function cellsOverlap(cellsA, cellsB) {
  return cellsA.some((a) => cellsB.some((b) => a.row === b.row && a.col === b.col));
}

export function isPlacementValid(candidateCar, { ignoreCarId = null } = {}) {
  if (candidateCar.id === POLICE_CAR_ID) {
    return false;
  }

  if (candidateCar.length !== 2 && candidateCar.length !== 3) {
    return false;
  }

  if (candidateCar.orientation !== "horizontal" && candidateCar.orientation !== "vertical") {
    return false;
  }

  if (occupiesOutOfBounds(candidateCar)) {
    return false;
  }

  const candidateCells = getCarCells(candidateCar);
  for (const car of listCars()) {
    if (car.id === ignoreCarId) {
      continue;
    }
    if (cellsOverlap(candidateCells, getCarCells(car))) {
      return false;
    }
  }

  return true;
}

export function createAndPlaceCar({ length, orientation, color, row, col }) {
  const candidateCar = {
    id: createCarId(),
    length,
    orientation,
    color,
    row,
    col,
    isPolice: false,
  };

  if (!isPlacementValid(candidateCar)) {
    return null;
  }

  addCar(candidateCar);
  return candidateCar;
}

function buildSteppedCandidate(car, direction) {
  const next = { ...car };
  if (direction === "up") {
    next.row -= 1;
  } else if (direction === "down") {
    next.row += 1;
  } else if (direction === "left") {
    next.col -= 1;
  } else if (direction === "right") {
    next.col += 1;
  }
  return next;
}

function canPoliceExit(candidateCar) {
  if (candidateCar.id !== POLICE_CAR_ID) {
    return false;
  }
  if (candidateCar.orientation !== "vertical" || candidateCar.col !== EXIT_COLUMN) {
    return false;
  }

  const headInside = candidateCar.row === GRID_SIZE - 1;
  const tailOutside = candidateCar.row + 1 === GRID_SIZE;
  return headInside && tailOutside;
}

function isCarStepInsideBounds(candidateCar) {
  if (canPoliceExit(candidateCar)) {
    return true;
  }
  return !occupiesOutOfBounds(candidateCar);
}

export function canMoveOneStep(carId, direction) {
  const car = getCarById(carId);
  if (!car) {
    return { ok: false, reason: `Car ${carId} does not exist.` };
  }

  if (car.orientation === "horizontal" && (direction === "up" || direction === "down")) {
    return { ok: false, reason: "Horizontal cars can only move left/right." };
  }

  if (car.orientation === "vertical" && (direction === "left" || direction === "right")) {
    return { ok: false, reason: "Vertical cars can only move up/down." };
  }

  const candidate = buildSteppedCandidate(car, direction);
  if (!isCarStepInsideBounds(candidate)) {
    return { ok: false, reason: "Move would cross a wall." };
  }

  const candidateCells = getCarCells(candidate);
  for (const other of listCars()) {
    if (other.id === car.id) {
      continue;
    }
    if (cellsOverlap(candidateCells, getCarCells(other))) {
      return { ok: false, reason: "Move blocked by another car." };
    }
  }

  return { ok: true, nextRow: candidate.row, nextCol: candidate.col };
}

export function moveCarOneStep(carId, direction) {
  const check = canMoveOneStep(carId, direction);
  if (!check.ok) {
    return check;
  }

  updateCarPosition(carId, check.nextRow, check.nextCol);
  return { ok: true };
}
