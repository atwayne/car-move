import { POLICE_CAR } from "./config.js";

const state = {
  cars: [structuredClone(POLICE_CAR)],
  nextCarNumber: 1,
  isPlaying: false,
  hasWon: false,
};

export function getState() {
  return state;
}

export function listCars() {
  return state.cars;
}

export function getCarById(carId) {
  return state.cars.find((car) => car.id === carId) || null;
}

export function addCar(car) {
  state.cars.push(car);
}

export function removeLastPlacedCar() {
  for (let i = state.cars.length - 1; i >= 0; i -= 1) {
    if (!state.cars[i].isPolice) {
      const [removed] = state.cars.splice(i, 1);
      return removed;
    }
  }
  return null;
}

export function hasPlacedCars() {
  return state.cars.some((car) => !car.isPolice);
}

export function createCarId() {
  const id = `car-${state.nextCarNumber}`;
  state.nextCarNumber += 1;
  return id;
}

export function updateCarPosition(carId, row, col) {
  const car = getCarById(carId);
  if (!car) {
    return false;
  }
  car.row = row;
  car.col = col;
  return true;
}

export function setIsPlaying(value) {
  state.isPlaying = value;
}

export function setHasWon(value) {
  state.hasWon = value;
}
