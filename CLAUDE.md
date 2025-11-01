# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an educational web-based 2D platformer game designed for a Year 8 (12-year-old) coding session. The primary teaching goal is to demonstrate **chain reactions in code** (how one function triggers others) and **game "juice"** (visual/audio effects that make games feel satisfying).

**Session constraints:**
- 1-hour session duration
- Students have Scratch experience but limited JavaScript knowledge
- Most code must be pre-built; students experiment with values and add effects
- Deploy via CodePen for students; teacher tests locally

## Running the Project

```bash
npm start
# Opens HTTP server at http://localhost:8000
# Equivalent to: python3 -m http.server 8000
```

Simply open `index.html` in a browser after starting the server.

## Code Architecture

### File Organization (3 files)

All three files are designed to work both locally AND on CodePen:

- **index.html** - Canvas element, score display (commented out initially), game container
- **style.css** - Dark theme styling, canvas layout, score display styling
- **game.js** - All game logic with specific organizational structure (see below)

### Critical: game.js Organization Pattern

The file has a **strict organizational structure** that must be maintained:

```
TOP (Student-Friendly Zone)
├── Configuration constants (GRAVITY, JUMP_POWER, colors, etc.)
├── Platforms array (students may add/modify platforms)
├── Player functions (jump, land, bump, drawPlayer)
├── Coin functions (onCoinCollected, onAllCoinsCollected, drawCoins)
├── Particle functions (spawnParticles, drawParticles)
└── Sound & effects (screenShake, beep, playSound)

BOTTOM (Game Mechanics - Advanced)
├── Canvas setup (canvas, ctx)
├── Game state (player object, keys, score, coins, particles)
├── System functions (handleInput, applyPhysics, collision detection)
├── Coin spawning logic (addCoin, addRandomCoin, spawnCoins, collectCoin)
├── Update/render/gameLoop
└── Error handling
```

**Why this matters:** Students should only modify the top section. All technical plumbing goes to the bottom. This pattern has been refined through multiple iterations based on user feedback.

### Key Separation: "Juice" vs. System Functions

Student-facing "juice" functions are separated from system mechanics:

- `onCoinCollected(coin)` - Students add effects here (particles, sounds, shake)
- `onAllCoinsCollected()` - Students add victory celebration here
- `collectCoin(coin)` - System function that handles score, array removal, and calls the above

This pattern is used for player actions too:
- `jump()`, `land()`, `bump()` - Student-editable with TODO comments
- The physics/collision system calls these functions automatically

### Collision Detection

- **Platforms:** AABB (Axis-Aligned Bounding Box) rectangular collision
- **Coins:** Circular collision using distance calculation
- **Spawning:** `isTooCloseToObject(x, y, objectSize)` unified function that:
  - Checks platforms with buffer for object radius
  - Checks other coins with minimum distance (2x object size)
  - Returns true if too close, false if valid spawn position

### Chain Reaction Example

When a coin is collected, this cascade occurs:
```
checkCoinCollisions() → collectCoin(coin)
  ├── Update score
  ├── Remove coin from array
  ├── Update DOM score display
  ├── Call onCoinCollected(coin) [students add effects here]
  └── If all coins gone:
      ├── Call onAllCoinsCollected() [students add celebration]
      └── Call spawnCoins()
```

This is the core teaching concept - showing how functions trigger other functions.

## Development Commands

**Local testing:**
```bash
npm start  # Start server
```

**CodePen deployment (for students):**
- HTML tab: Copy `index.html` body content only (no doctype/html/head/body tags)
- CSS tab: Copy entire `style.css`
- JS tab: Copy entire `game.js`
- Remove `<script src="game.js"></script>` line from HTML

## Important Constraints

1. **Never remove TODO comments** - These guide students on what to experiment with
2. **Keep configuration constants at the very top** - Students need easy access
3. **Student-editable functions stay in top section** - Do not move to bottom
4. **System mechanics go to bottom** - Canvas setup, game state, physics engine
5. **Error handling is intentionally minimal** - Was reduced from ~30 lines to 8 lines because it was "overwhelming" for students
6. **Comments should encourage experimentation** - Use "Try:" suggestions liberally

## Code Patterns to Follow

**Adding new student-editable effects:**
```javascript
// TOP SECTION
function onNewEvent() {
  // TODO: Add juice here! What should happen?
  // Try calling: screenShake(5)
  // Try calling: beep(440, 100, 0.3)
  console.log('Event happened!');
}

// BOTTOM SECTION
function systemFunctionThatTriggersIt() {
  // ... system logic ...
  onNewEvent();  // Call the juice function
}
```

**Particle system usage:**
```javascript
spawnParticles(x, y, color, count);
// Automatically handles physics (gravity, velocity, life, decay)
```

**Sound effects:**
```javascript
beep(frequency, duration, volume);  // Procedural beep using Web Audio API
playSound('soundName');             // File-based (requires sounds object setup)
```

## Teaching Philosophy Reflected in Code

- **Pre-built, not scaffolded:** Students experiment with a working game, not build from scratch
- **Visual feedback over console logs:** Screen shake, particles, sounds > text output
- **Constants over magic numbers:** Everything tweakable is a named constant at the top
- **Comments as teaching:** TODOs suggest what to try, not just what code does
- **Separation shows architecture:** Top/bottom organization teaches code structure
