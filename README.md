# Car Move Garage

A static single-page puzzle prototype: a **6×6** garage with walls, one exit at the bottom of column 4 (zero-based index `3`), and a fixed **police car** that must reach the exit. You place extra cars, then either **play** a scripted move list or **solve** the board and watch the solution animate.

## Live

https://atwayne.github.io/car-move

## Requirements

- A modern browser with **JavaScript modules** (`import` / `export`).
- No build step or backend. Everything is plain HTML, CSS, and JavaScript.

## How to run

Because the app uses ES modules, some browsers block `file://` loading of local modules. The reliable approach is to serve the project folder over HTTP.

From the project root (`car-move`):

```bash
python3 -m http.server 8080
```

Then open **http://localhost:8080/index.html** in your browser.

Alternatively, use any static file server (for example `npx serve .`) and open `index.html`.

## Using the app

### Garage

- The board is a **6×6** grid with outer walls and a **gap in the bottom wall** at the fourth column (the exit).
- The **police car** starts at the top of that column (cells `[0,3]` and `[1,3]`), vertical, length 2. You cannot move or remove it by hand; it only moves during **Play** or **Solve** playback.

### Create Car

1. Under **Create Car**, pick a **car type** (length 2 or 3, horizontal or vertical) using the four tiles. The selected tile is highlighted.
2. Pick a **color** from the row of circles.
3. **Click a cell** on the board to place the car’s **top-left** anchor cell. The car extends right (horizontal) or down (vertical) from that cell.
4. Cars cannot overlap or sit out of bounds. Invalid placements show a message in the status line.

### Controls

| Control | What it does |
|--------|----------------|
| **Play** | Runs the developer move list from `scripts/config.js` (`DEV_MOVE_LIST`), one step at a time, with animation. |
| **Solve** | Computes a move sequence for the **current** board, lists it under **Moves**, then plays it automatically. If there is no solution, the status line says so. |
| **Undo Last Placement** | Removes the most recently placed **non-police** car. Disabled when there is nothing to undo or while playback is running. |

### Moves

After a successful **Solve**, the **Moves** panel lists the generated moves (car id, direction, step count). Changing the board (new placement or undo) clears that list until you solve again.

### Win condition

The puzzle is solved when the police car exits through the bottom opening (animation ends with the police car in the winning position). Only the police car may use the exit; other cars must stay fully inside the grid during playback.

## Customization (developers)

- **`scripts/config.js`**  
  - `DEV_MOVE_LIST`: array of `{ carId, direction, steps }` used by **Play**.  
  - `COLOR_PALETTE` and `COLOR_MAP`: configurable colors for new cars.  
  - Grid and timing constants (`GRID_SIZE`, `STEP_ANIMATION_MS`, etc.).

- **`scripts/solver.js`**  
  Contains the automatic solver used by **Solve**.

## Project layout

| Path | Role |
|------|------|
| `index.html` | Main page |
| `styles/app.css` | Styles |
| `scripts/main.js` | UI wiring |
| `scripts/config.js` | Constants and default move list |
| `scripts/state.js` | Game state |
| `scripts/placement.js` | Placement and step validation |
| `scripts/board-renderer.js` | Board and car rendering |
| `scripts/player.js` | Move playback animation |
| `scripts/solver.js` | Solver |

## License

MIT
