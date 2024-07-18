const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
carCanvas.height = window.innerHeight; // Set initial height

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;
networkCanvas.height = window.innerHeight; // Set initial height

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

let road;
let cars = [];
let bestCar;
let traffic = [];
let animationFrameId;

function startTraining() {
  const N = parseInt(document.getElementById("carCountInput").value);
  if (isNaN(N) || N <= 0) {
    alert("Please enter a valid number of cars.");
    return;
  }

  // Cancel the previous animation frame if it exists
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // Clear the canvas before starting a new simulation
  carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
  networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

  road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

  cars = generateCars(N);
  bestCar = cars[0];
  if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
      cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
      if (i !== 0) {
        NeuralNetwork.mutate(cars[i].brain, 0.1);
      }
    }
  }

  traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2),
  ];

  // Start the animation
  animate();
}

function stopSimulation() {
  cancelAnimationFrame(animationFrameId);
}

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  // Request a new animation frame and store its ID
  animationFrameId = requestAnimationFrame(animate);
}

// Initial drawing of the canvases before starting the simulation
carCanvas.height = window.innerHeight;
networkCanvas.height = window.innerHeight;
