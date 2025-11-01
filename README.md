# 🎮 Juicy Platformer - Year 8 Coding Session

Welcome! This is a simple platformer game where you'll learn about **chain reactions in code** and how to make games feel awesome!

## 🎯 What You'll Learn

1. **How web pages work** - HTML (structure), CSS (style), JavaScript (behavior)
2. **Chain reactions in code** - How one action triggers a cascade of functions
3. **Game feel ("juice")** - Small touches that make games satisfying
4. **Experimentation** - Changing values to see what happens

## 🎲 The Game (So Far)

Right now it's very basic:
- A blue square (you!) that can move and jump
- Some platforms to jump between
- That's it! But we'll make it awesome...

## 🧪 Your Mission

You'll work in groups to experiment with the code and make this game feel amazing!

### Part 1: Experiment with Physics (5-10 minutes)

At the top of `game.js`, you'll find config variables. Try changing them:

```javascript
const GRAVITY = 0.5;           // Try: 0.2 (moon), 1.5 (heavy)
const JUMP_POWER = 12;         // Try: 8 (low), 20 (super jump)
const PLAYER_SPEED = 5;        // Try: 2 (slow), 10 (fast)
const FRICTION = 0.8;          // Try: 0.95 (ice), 0.5 (sticky)
const PLAYER_SIZE = 30;        // Try: 15 (tiny), 60 (huge)
const PLAYER_COLOR = '#3498db'; // Try: '#e74c3c' (red), '#2ecc71' (green)
```

**Questions to explore:**
- What gravity value feels most "game-like"?
- Can you make it feel like you're on the moon?
- What happens if FRICTION is 1.0? Or 0.0?

### Part 2: Add Coins & Scoring (10 minutes)

**Step 1:** In `index.html`, uncomment the score display (around line 24-27)

**Step 2:** In `game.js`, find these two lines and uncomment them:
- In the `checkCollisions()` function: `// checkCoinCollisions();`
- In the `render()` function: `// drawCoins();`

Now you have collectible coins! They spawn randomly each time you refresh!

**Experiment with:**
- `NUMBER_OF_COINS = 5` (try 3, 10, 20!)
- `POINTS_PER_COIN = 100` (try 1, 1000, 9999!)
- `COIN_SIZE = 20` (bigger or smaller coins)
- `COIN_COLOR = '#f39c12'` (change the color)

**Advanced: Add specific coins**
```javascript
// Add a coin at position (400, 300)
addCoin(400, 300);

// Add 5 more random coins
for (let i = 0; i < 5; i++) {
  addRandomCoin();
}
```

### Part 3: Make It Juicy! (Coming next...)

We'll add special effects like:
- Screen shake when you jump or collect coins
- Particle explosions
- Sound effects
- Floating score text
- And more!

## 🔄 The Chain Reaction

When you collect a coin, watch what happens in the code:

```
checkCoinCollisions()
  → finds a coin touching the player
  → calls collectCoin()
  → adds points to score
  → updates the display
  → (soon: plays sound, shakes screen, spawns particles!)
```

One action triggers many functions - that's a **chain reaction**!

## 🛠️ How to Use This Code

### Option 1: Test Locally (For You - The Teacher!)

**Quick start:**
```bash
cd school-coding
npm start
# OR just run: python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

**Why use a local server?**
- Edit files in VS Code or any editor you like
- Refresh browser to see changes instantly
- Use browser dev tools for debugging
- Test before sharing with students

**File structure:**
```
school-coding/
├── index.html    (Structure - the bones)
├── style.css     (Style - the skin)
├── game.js       (Behavior - the brain)
└── README.md     (This file!)
```

### Option 2: CodePen (For Students!)

**To create a CodePen version:**
1. Go to https://codepen.io/pen/
2. In the **HTML** tab: Copy everything from `index.html` EXCEPT the `<!DOCTYPE>`, `<html>`, `<head>`, and `<body>` tags
   - Just copy from `<h1>Juicy Platformer</h1>` down to `<script src="game.js"></script>` (but remove the `<script>` tag)
3. In the **CSS** tab: Copy all of `style.css`
4. In the **JS** tab: Copy all of `game.js`
5. Save it (create free account if needed)
6. Share the URL with students - they can fork it!

**CodePen advantages for students:**
- Instant preview - no setup needed
- Clear separation of HTML/CSS/JS
- Easy to fork and share their versions
- Can't break the original

### Option 3: Cloudflare Pages (Coming Soon!)

Students will be able to submit their code and see it live on a real website!

## 📝 Tips

- **Don't worry about breaking things!** You can always undo or refresh
- **Experiment!** Try weird values and see what happens
- **Read the comments** - They explain what each part does
- **Ask questions!** If something doesn't make sense, ask

## 🎨 What's Next?

After you've experimented with physics and added coins, we'll:
1. Add "juice" functions (screen shake, particles, sounds)
2. Add a goal to reach
3. Make winning feel epic!

## 🤔 Discussion Questions

- Why does changing `GRAVITY` change how the game feels?
- What happens if you put `screenShake()` in the game loop? (We'll try this later!)
- What makes a game feel "good" to play?

---

**Have fun! Remember: The best way to learn coding is to experiment and break things!**
