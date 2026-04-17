import { EXIT_COLUMN, GRID_SIZE, POLICE_CAR_ID } from "./config.js";

const DIRECTIONS_BY_ORIENTATION = {
  horizontal: ["left", "right"],
  vertical: ["up", "down"],
};

function cloneCars(cars) {
  return cars.map((car) => ({ ...car }));
}

function cellKey(row, col) {
  return `${row},${col}`;
}

function getCarCells(car) {
  const cells = [];
  for (let i = 0; i < car.length; i += 1) {
    cells.push({
      row: car.row + (car.orientation === "vertical" ? i : 0),
      col: car.col + (car.orientation === "horizontal" ? i : 0),
    });
  }
  return cells;
}

function serializeState(cars, carOrder) {
  return carOrder.map((id) => {
    const car = cars.find((item) => item.id === id);
    return `${id}:${car.row}:${car.col}`;
  }).join("|");
}

function isWinningState(cars) {
  const police = cars.find((car) => car.id === POLICE_CAR_ID);
  return Boolean(police && police.row === GRID_SIZE - 1 && police.col === EXIT_COLUMN);
}

function isCellInsideGrid(row, col) {
  return row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE;
}

function canPoliceOccupyExitCell(car, row, col) {
  if (car.id !== POLICE_CAR_ID) {
    return false;
  }
  if (car.orientation !== "vertical" || car.col !== EXIT_COLUMN) {
    return false;
  }
  return row === GRID_SIZE;
}

function tryMoveOneStep(cars, carIndex, direction) {
  const nextCars = cloneCars(cars);
  const car = nextCars[carIndex];

  if (direction === "up") {
    car.row -= 1;
  } else if (direction === "down") {
    car.row += 1;
  } else if (direction === "left") {
    car.col -= 1;
  } else if (direction === "right") {
    car.col += 1;
  }

  const occupied = new Set();
  for (let i = 0; i < nextCars.length; i += 1) {
    if (i === carIndex) {
      continue;
    }
    for (const cell of getCarCells(nextCars[i])) {
      occupied.add(cellKey(cell.row, cell.col));
    }
  }

  for (const cell of getCarCells(car)) {
    if (!isCellInsideGrid(cell.row, cell.col) && !canPoliceOccupyExitCell(car, cell.row, cell.col)) {
      return null;
    }
    if (occupied.has(cellKey(cell.row, cell.col))) {
      return null;
    }
  }

  return nextCars;
}

function buildStepMoves(path) {
  const result = [];
  for (let i = 0; i < path.length; i += 1) {
    const move = path[i];
    const previous = result[result.length - 1];
    if (previous && previous.carId === move.carId && previous.direction === move.direction) {
      previous.steps += 1;
    } else {
      result.push({ carId: move.carId, direction: move.direction, steps: 1 });
    }
  }
  return result;
}

export function solvePuzzle(state) {
  const initialCars = cloneCars(state.cars);
  const carOrder = initialCars.map((car) => car.id);
  const visited = new Set([serializeState(initialCars, carOrder)]);
  const queue = [{ cars: initialCars, path: [] }];
  let cursor = 0;

  while (cursor < queue.length) {
    const current = queue[cursor];
    cursor += 1;

    if (isWinningState(current.cars)) {
      return buildStepMoves(current.path);
    }

    for (let carIndex = 0; carIndex < current.cars.length; carIndex += 1) {
      const car = current.cars[carIndex];
      const directions = DIRECTIONS_BY_ORIENTATION[car.orientation] || [];

      for (const direction of directions) {
        const nextCars = tryMoveOneStep(current.cars, carIndex, direction);
        if (!nextCars) {
          continue;
        }

        const signature = serializeState(nextCars, carOrder);
        if (visited.has(signature)) {
          continue;
        }
        visited.add(signature);

        queue.push({
          cars: nextCars,
          path: [...current.path, { carId: car.id, direction }],
        });
      }
    }
  }

  return null;
}

export function onSolveClick(state) {
  return solvePuzzle(state);
}
