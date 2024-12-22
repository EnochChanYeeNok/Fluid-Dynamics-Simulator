// Get the canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Parameters
const NUM_PARTICLES = 500;
const PARTICLE_SIZE = 2;
const REST_DENSITY = 1000;
const GAS_CONSTANT = 2000;
const TIME_STEP = 0.016; // ~60fps
const VISCOSITY = 250;
const GRAVITY = { x: 0, y: 9.81 };

// Arrays to hold particle data
let particles = [];

// Particle class
class Particle {
  constructor(x, y) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.density = 0;
    this.pressure = 0;
  }

  update() {
    // Update velocity and position
    this.vel.x += this.acc.x * TIME_STEP;
    this.vel.y += this.acc.y * TIME_STEP;

    this.pos.x += this.vel.x * TIME_STEP;
    this.pos.y += this.vel.y * TIME_STEP;

    // Boundary conditions
    if (this.pos.x < PARTICLE_SIZE) {
      this.pos.x = PARTICLE_SIZE;
      this.vel.x *= -0.5;
    }
    if (this.pos.x > canvas.width - PARTICLE_SIZE) {
      this.pos.x = canvas.width - PARTICLE_SIZE;
      this.vel.x *= -0.5;
    }
    if (this.pos.y < PARTICLE_SIZE) {
      this.pos.y = PARTICLE_SIZE;
      this.vel.y *= -0.5;
    }
    if (this.pos.y > canvas.height - PARTICLE_SIZE) {
      this.pos.y = canvas.height - PARTICLE_SIZE;
      this.vel.y *= -0.5;
    }
  }

  // In Particle.draw()
  draw() {
    let speed = Math.hypot(this.vel.x, this.vel.y);
    let maxSpeed = 50;
    let intensity = Math.min(speed / maxSpeed, 1);
    let color = `hsl(${200 - intensity * 200}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, PARTICLE_SIZE, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

// Initialize particles
function initParticles() {
  for (let i = 0; i < NUM_PARTICLES; i++) {
    // Create particles in a random area
    let x = Math.random() * canvas.width * 0.5 + canvas.width * 0.25;
    let y = Math.random() * canvas.height * 0.5 + canvas.height * 0.25;
    particles.push(new Particle(x, y));
  }
}

// SPH core functions
function computeDensityPressure() {
  for (let i = 0; i < NUM_PARTICLES; i++) {
    let p_i = particles[i];
    p_i.density = 0;
    for (let j = 0; j < NUM_PARTICLES; j++) {
      let p_j = particles[j];
      let dx = p_j.pos.x - p_i.pos.x;
      let dy = p_j.pos.y - p_i.pos.y;
      let dist = Math.hypot(dx, dy);
      if (dist < PARTICLE_SIZE * 5) {
        // Kernel function (Poly6)
        let q = dist / (PARTICLE_SIZE * 5);
        let densityContr = (1 - q * q * q) ** 3;
        p_i.density += densityContr;
      }
    }
    p_i.density *= REST_DENSITY;
    p_i.pressure = GAS_CONSTANT * (p_i.density - REST_DENSITY);
  }
}

function computeForces() {
  for (let i = 0; i < NUM_PARTICLES; i++) {
    let p_i = particles[i];
    let pressureForce = { x: 0, y: 0 };
    let viscosityForce = { x: 0, y: 0 };

    for (let j = 0; j < NUM_PARTICLES; j++) {
      if (i === j) continue;
      let p_j = particles[j];
      let dx = p_j.pos.x - p_i.pos.x;
      let dy = p_j.pos.y - p_i.pos.y;
      let dist = Math.hypot(dx, dy);

      if (dist < PARTICLE_SIZE * 5 && dist > 0) {
        // Pressure force
        let q = dist / (PARTICLE_SIZE * 5);
        let pressureTerm = -0.5 * (p_i.pressure + p_j.pressure) * (1 - q);
        pressureForce.x += pressureTerm * dx / dist;
        pressureForce.y += pressureTerm * dy / dist;

        // Viscosity force
        let viscosityTerm = VISCOSITY * (1 - q);
        viscosityForce.x += viscosityTerm * (p_j.vel.x - p_i.vel.x);
        viscosityForce.y += viscosityTerm * (p_j.vel.y - p_i.vel.y);
      }
    }

    // Combine forces
    p_i.acc.x = (pressureForce.x + viscosityForce.x) / p_i.density + GRAVITY.x;
    p_i.acc.y = (pressureForce.y + viscosityForce.y) / p_i.density + GRAVITY.y;
  }
}

function updateParticles() {
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles[i].update();
  }
}

function renderParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles[i].draw();
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  computeDensityPressure();
  computeForces();
  updateParticles();
  renderParticles();
}

// Start the simulation
initParticles();
animate();