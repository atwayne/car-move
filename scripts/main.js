import { COLOR_MAP, COLOR_PALETTE } from "./config.js";
import { renderBoard, renderCars } from "./board-renderer.js";
import { createAndPlaceCar } from "./placement.js";
import { playMoves } from "./player.js";
import { getState, hasPlacedCars, removeLastPlacedCar } from "./state.js";
import { onSolveClick } from "./solver.js";

const garageElement = document.getElementById("garage");
const carForm = document.getElementById("car-form");
const carTypePicker = document.getElementById("car-type-picker");
const colorPicker = document.getElementById("color-picker");
const statusElement = document.getElementById("status");
const movesSummaryElement = document.getElementById("moves-summary");
const movesListElement = document.getElementById("moves-list");
const playButton = document.getElementById("play-button");
const solveButton = document.getElementById("solve-button");
const undoButton = document.getElementById("undo-button");

const selectedCar = {
  length: 2,
  orientation: "horizontal",
  colorName: COLOR_PALETTE[0],
};

function applyCarTypeSelection(length, orientation) {
  selectedCar.length = length;
  selectedCar.orientation = orientation;
  for (const option of carTypePicker.querySelectorAll(".car-type-option")) {
    const isSelected =
      Number(option.dataset.length) === selectedCar.length &&
      option.dataset.orientation === selectedCar.orientation;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  }
}

function applyColorSelection(colorName) {
  selectedCar.colorName = colorName;
  for (const option of colorPicker.querySelectorAll(".color-option")) {
    const isSelected = option.dataset.color === selectedCar.colorName;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  }
}

for (const option of carTypePicker.querySelectorAll(".car-type-option")) {
  option.addEventListener("click", () => {
    applyCarTypeSelection(Number(option.dataset.length), option.dataset.orientation);
  });
  option.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      applyCarTypeSelection(Number(option.dataset.length), option.dataset.orientation);
    }
  });
}

for (const colorName of COLOR_PALETTE) {
  const option = document.createElement("div");
  option.className = "color-option";
  option.dataset.color = colorName;
  option.style.backgroundColor = COLOR_MAP[colorName] ?? colorName;
  option.setAttribute("role", "button");
  option.setAttribute("tabindex", "0");
  option.setAttribute("aria-pressed", "false");
  option.setAttribute("aria-label", `${colorName} color`);
  option.addEventListener("click", () => {
    applyColorSelection(colorName);
  });
  option.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      applyColorSelection(colorName);
    }
  });
  colorPicker.append(option);
}

applyCarTypeSelection(selectedCar.length, selectedCar.orientation);
applyColorSelection(selectedCar.colorName);

function setStatus(message) {
  statusElement.textContent = message;
}

function formatMove(move, index) {
  return `${index + 1}. ${move.carId} ${move.direction} x${move.steps}`;
}

function renderMoves(moves) {
  movesListElement.replaceChildren();

  if (!moves || moves.length === 0) {
    movesSummaryElement.textContent = "Solve the puzzle to view generated moves.";
    return;
  }

  movesSummaryElement.textContent = `${moves.length} moves generated for this board.`;
  for (let i = 0; i < moves.length; i += 1) {
    const item = document.createElement("li");
    item.textContent = formatMove(moves[i], i);
    movesListElement.append(item);
  }
}

function setControlsEnabled(enabled) {
  playButton.disabled = !enabled;
  solveButton.disabled = !enabled;
  carForm.classList.toggle("creator-disabled", !enabled);
  undoButton.disabled = !enabled || !hasPlacedCars();
}

function refreshUndoButtonState() {
  undoButton.disabled = getState().isPlaying || !hasPlacedCars();
}

function selectedCarConfig() {
  return {
    length: selectedCar.length,
    orientation: selectedCar.orientation,
    color: COLOR_MAP[selectedCar.colorName] ?? selectedCar.colorName,
  };
}

function handleBoardCellClick(row, col) {
  if (getState().isPlaying) {
    return;
  }

  const result = createAndPlaceCar({
    ...selectedCarConfig(),
    row,
    col,
  });

  if (!result) {
    setStatus("Invalid placement: overlaps, out of bounds, or blocked.");
    return;
  }

  renderCars(garageElement);
  setStatus(`Placed ${result.id}.`);
  renderMoves(null);
  refreshUndoButtonState();
}

playButton.addEventListener("click", async () => {
  if (getState().isPlaying) {
    return;
  }
  await playMoves({ garageElement, setStatus, setControlsEnabled });
});

solveButton.addEventListener("click", async () => {
  if (getState().isPlaying) {
    return;
  }

  const solution = onSolveClick(getState());
  if (!solution || solution.length === 0) {
    setStatus("No solution found for current board.");
    renderMoves(null);
    return;
  }

  renderMoves(solution);
  setStatus(`Solution found (${solution.length} moves). Playing...`);
  await playMoves({
    garageElement,
    setStatus,
    setControlsEnabled,
    moveList: solution,
  });
  refreshUndoButtonState();
});

undoButton.addEventListener("click", () => {
  if (getState().isPlaying) {
    return;
  }

  const removed = removeLastPlacedCar();
  if (!removed) {
    setStatus("No placed car to undo.");
    refreshUndoButtonState();
    return;
  }

  renderCars(garageElement);
  setStatus(`Removed ${removed.id}.`);
  renderMoves(null);
  refreshUndoButtonState();
});

renderBoard(garageElement, handleBoardCellClick);
renderCars(garageElement);
renderMoves(null);
refreshUndoButtonState();
