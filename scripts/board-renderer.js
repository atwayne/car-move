import { CELL_GAP, CELL_SIZE, GRID_SIZE } from "./config.js";
import { listCars } from "./state.js";

function toPixel(cell) {
  return cell * (CELL_SIZE + CELL_GAP);
}

function carDimensions(car) {
  const widthCells = car.orientation === "horizontal" ? car.length : 1;
  const heightCells = car.orientation === "vertical" ? car.length : 1;

  return {
    width: widthCells * CELL_SIZE + (widthCells - 1) * CELL_GAP,
    height: heightCells * CELL_SIZE + (heightCells - 1) * CELL_GAP,
  };
}

export function renderBoard(garageElement, onCellClick) {
  garageElement.replaceChildren();

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.addEventListener("click", () => onCellClick(row, col));
      garageElement.append(cell);
    }
  }

  const carLayer = document.createElement("div");
  carLayer.className = "car-layer";
  garageElement.append(carLayer);
}

export function renderCars(garageElement) {
  const layer = garageElement.querySelector(".car-layer");
  if (!layer) {
    return;
  }
  layer.replaceChildren();

  for (const car of listCars()) {
    const carElement = document.createElement("div");
    carElement.className = `car${car.isPolice ? " police" : ""}`;
    carElement.style.left = `${toPixel(car.col)}px`;
    carElement.style.top = `${toPixel(car.row)}px`;
    const { width, height } = carDimensions(car);
    carElement.style.width = `${width}px`;
    carElement.style.height = `${height}px`;
    carElement.style.background = car.color;
    carElement.title = car.isPolice ? "Police car" : car.id;
    layer.append(carElement);
  }
}
