# Juicy Platformer - Year 8 Coding Session

An educational web-based 2D platformer game designed to teach Year 8 students (ages 12-13) about code configuration, chain reactions, and game "juice" (visual/audio effects that make games feel satisfying).

**🎮 Try it live:** https://cavnz.github.io/school-coding/

## Project Overview

This project provides a pre-built platformer game where students experiment with configuration values and add special effects to understand:
- How changing constants affects game behavior
- Chain reactions (how one function triggers others)
- Game feel through visual and audio feedback
- The three core web technologies: HTML, CSS, and JavaScript

**Teaching approach:** Students don't build from scratch—they modify and enhance a working game, focusing on experimentation and immediate visual feedback.

## Quick Start

**For students:** Visit the [GitHub Pages site](https://cavnz.github.io/school-coding/) which includes:
- One-click setup to open the game in JSFiddle
- Step-by-step activities and challenges
- Coding concepts explained
- Showcase of example projects

**For teachers (local testing):**
```bash
npm start
# Opens http://localhost:8000
```

## Project Structure

```
docs/
├── index.html           # Landing page with instructions
├── concepts.html        # Coding concepts explained
├── showcase.html        # Student project gallery
├── showcase/
│   ├── 01-starter/      # Base game (minimal juice)
│   ├── 02-full-juice/   # Fully enhanced version
│   └── 03-ultra-juicy/  # Bonus ultra-enhanced version
└── showcase-data.js     # Showcase gallery configuration
```

Each showcase folder contains three files that work together:
- `index.html` - Game structure and score display
- `style.css` - Visual styling
- `game.js` - All game logic (organized top-to-bottom for student accessibility)

## Adding Student Projects

Use the included script to add JSFiddle projects to the showcase:

```bash
./scripts/add-fiddle.sh <jsfiddle-url> <project-name> <author> <description>
```

See [scripts/README.md](scripts/README.md) for details.

## Technical Notes

- **No build process:** Pure HTML/CSS/JS for simplicity
- **JSFiddle compatible:** Code structured to work locally and on JSFiddle
- **Collision detection:** AABB for platforms, circular for coins
- **Audio:** Web Audio API for procedural sound effects
- **Organized for learning:** Student-editable code at top, system mechanics at bottom

See [CLAUDE.md](CLAUDE.md) for detailed architecture and development guidelines.

## License

MIT License - feel free to use and adapt for your own teaching!
