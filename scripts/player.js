import { DEV_MOVE_LIST, POLICE_CAR_ID, STEP_ANIMATION_MS } from "./config.js";
import { renderCars } from "./board-renderer.js";
import { moveCarOneStep } from "./placement.js";
import { getCarById, setHasWon, setIsPlaying } from "./state.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasPoliceWon() {
  const police = getCarById(POLICE_CAR_ID);
  return Boolean(police && police.row === 5 && police.col === 3);
}

export async function playMoves({ garageElement, setStatus, setControlsEnabled, moveList = DEV_MOVE_LIST }) {
  setIsPlaying(true);
  setControlsEnabled(false);
  setStatus("Playing move list...");

  try {
    for (const move of moveList) {
      for (let step = 0; step < move.steps; step += 1) {
        const result = moveCarOneStep(move.carId, move.direction);
        if (!result.ok) {
          setStatus(`Playback stopped: ${result.reason}`);
          return;
        }
        renderCars(garageElement);
        await sleep(STEP_ANIMATION_MS);
      }
    }

    if (hasPoliceWon()) {
      setHasWon(true);
      setStatus("Solved: police car exited through bottom opening.");
      return;
    }

    setStatus("Playback complete.");
  } finally {
    setIsPlaying(false);
    setControlsEnabled(true);
  }
}
