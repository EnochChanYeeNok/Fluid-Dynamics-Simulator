# 2D Fluid Dynamics Simulator

The 2D Fluid Dynamics Simulator is an interactive web application that models fluid flow using particle-based methods, specifically Smoothed Particle Hydrodynamics (SPH). Built with HTML, CSS, and JavaScript, the simulator visually demonstrates how particles interact under fluid dynamics principles, offering an engaging way to explore fluid behavior.

## Features

- **Interactive Fluid Simulation:** Users can add fluid particles by clicking and dragging on the canvas, allowing for dynamic fluid interaction.
- **Particle-Based Modeling:** Utilizes SPH to compute forces, pressure, and density between particles, providing a realistic simulation.
- **Responsive Design:** The canvas automatically adjusts to the full size of the browser window, ensuring an immersive experience.
- **Visual Enhancements:** Particles change color based on their speed, creating a visually appealing gradient effect that highlights fluid movement.

## How to Use the Simulator

1. **Access the Simulator:** Open the HTML file (`index.html`) in a modern web browser that supports HTML5 Canvas and JavaScript.
2. **Interact with the Fluid:**
    - **Add Particles:** Click and hold the left mouse button on the canvas. While holding, move the mouse around to continuously add particles at the cursor's position.
    - **Observe Fluid Behavior:** Release the mouse button to stop adding particles. Watch how the particles interact, flow, and settle due to simulated gravity and pressure forces.
3. **Explore Different Interactions:**
    - **Multiple Streams:** Click and drag in different areas to create multiple streams or blobs of fluid that will interact with each other.
    - **Continuous Flow:** Move the mouse rapidly while holding down the button to create a continuous flow of particles.
    - **Static Particles:** Click without moving the mouse to add particles in a concentrated spot, then observe how they disperse.
4. **Resize the Canvas:** The simulator adjusts to the size of the browser window. To change the simulation area, resize the browser window, and the canvas will automatically fit the new dimensions.
5. **Performance Tips:**
    - **Particle Limit:** Be mindful of the number of particles added. Excessive particles may slow down the simulation due to increased computational load.
    - **Adjust Particle Addition Rate:** Modify the `PARTICLE_ADD_INTERVAL` in the `script.js` file to control how quickly particles are added when the mouse is held down.

## Technical Overview

The simulator consists of three main components:

- **HTML (`index.html`):** Sets up the canvas element where the simulation is rendered.
- **CSS (`styles.css`):** Defines the visual styling of the canvas and ensures it covers the full viewport.
- **JavaScript (`script.js`):** Contains the core simulation logic, including particle initialization, SPH computations, user interaction handling, and rendering.

### Core Simulation Logic

- **Particle Class:** Defines individual particles with properties like position, velocity, acceleration, density, and pressure.
- **SPH Functions:**
    - **Density and Pressure Calculation:** Computes each particle's density and pressure based on neighboring particles.
    - **Force Computation:** Calculates pressure and viscosity forces acting on each particle.
- **Particle Update:** Updates positions and velocities based on computed forces and applies boundary conditions.
- **Rendering:** Particles are drawn on the canvas using circles whose colors vary based on their speed, creating a dynamic visual effect.
- **Animation Loop (`animate` function):** Updates the simulation state and renders frames at approximately 60 frames per second using `requestAnimationFrame`.

### User Interaction

- **Mouse Events:**
    - **mousedown:** Sets a flag to begin adding particles.
    - **mouseup:** Clears the flag to stop adding particles.
    - **mousemove:** Updates the mouse position used for adding particles.
- **Particle Addition Control:** Particles are added at the mouse position when the mouse is held down, with a controllable interval to manage the rate of addition.

## Customization

- **Adjust Simulation Parameters:** Modify constants like `NUM_PARTICLES`, `PARTICLE_SIZE`, `REST_DENSITY`, `GAS_CONSTANT`, `VISCOSITY`, and `GRAVITY` in the `script.js` file to change the fluid behavior.
- **Change Visual Appearance:** Update the `draw` method in the `Particle` class to alter how particles are rendered, such as changing colors or sizes.
- **Performance Optimization:** Implement spatial partitioning or reduce the total number of particles to improve performance for larger simulations.
