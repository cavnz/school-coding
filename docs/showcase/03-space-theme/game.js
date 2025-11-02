// =============================================
// 🛟 ERROR HANDLING (You can ignore this!)
// =============================================
// Catches mistakes and shows helpful error messages

window.addEventListener('error', (e) => {
  alert(`⚠️ Oops! ${e.message}\n\nCheck the console (F12) for details, or refresh to try again.`);
  console.error('Game Error:', e.error);
});


// =============================================
// 🎮 GAME CONFIGURATION - SPACE THEME
// =============================================
// EXPERIMENT WITH THESE VALUES!
// Try changing them to see what happens

// Physics Settings
const GRAVITY = 0.3;           // Lower gravity = space feel!
const JUMP_POWER = 12;         // How high you jump (try 8 or 15)
const PLAYER_SPEED = 5;        // How fast you move left/right (try 3 or 8)
const FRICTION = 0.8;          // How slippery the ground is (0.9 = ice, 0.5 = sticky)

// Visual Settings - SPACE COLORS!
const PLAYER_SIZE = 30;          // Size of your character (try 20 or 50)
const PLAYER_COLOR = 'rgb(100, 200, 255)';  // Bright cyan for spaceship
const PLATFORM_COLOR = 'rgb(80, 80, 90)'; // Metallic gray platforms
const BACKGROUND_COLOR = 'rgb(10, 10, 30)'; // Deep space black-blue
const STAR_COLOR = 'white';  // Stars in background!

// Platforms to jump on
const platforms = [
  { x: 0, y: 450, width: 650, height: 50 },      // Ground
  { x: 150, y: 350, width: 150, height: 20 },    // Platform 1
  { x: 350, y: 250, width: 150, height: 20 },    // Platform 2
  { x: 50, y: 200, width: 100, height: 20 },    // Platform 3
  { x: 450, y: 100, width: 120, height: 20 },    // Platform 4
  { x: 200, y: 150, width: 120, height: 20 }     // Platform 5
];


// Score Display Settings
const SCORE_SIZE = 48;            // Font size for score (try 36, 64, 80!)
const SCORE_COLOR = 'rgb(255, 255, 100)';    // Bright yellow for sci-fi feel
const SCORE_Y_POSITION = 550 + SCORE_SIZE / 2;     // Y position of score (higher = lower on screen)

// Coin Settings - ENERGY CRYSTALS!
const NUMBER_OF_COINS = 5;       // How many coins to spawn (try 3, 10, 20!)
const POINTS_PER_COIN = 100;     // How many points per coin (try 1, 100, 1000!)
const COIN_SIZE = 20;            // Size of coins
const COIN_COLOR = 'rgb(0, 255, 200)';    // Cyan energy crystal color

// Death Settings - LASER BEAMS!
const BAD_PLATFORM_COLOR = 'rgb(255, 50, 50)';  // Red lasers
const RESPAWN_X = 100;           // Where to respawn horizontally
const RESPAWN_Y = 100;           // Where to respawn vertically


// Dangerous platforms (laser beams!) - touching these kills you!
// You can add more by copying the format: { x: , y: , width: , height: }
const badPlatforms = [
   { x: 400, y: 440, width: 100, height: 10 }  // Spikes on the ground
];
// Stars for background!
const stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * 800,
    y: Math.random() * 600,
    size: Math.random() * 2,
    twinkle: Math.random() * Math.PI * 2
  });
}

// =============================================
// 👤 PLAYER FUNCTIONS
// =============================================

function jump() {

    // Space thruster sound!
    beep(220, 100, 0.2);
    // Try: screenShake(3)
    console.log('Thrusters engaged!');
}

function land() {

  // Landing thud
  beep(150, 50, 0.3);
  screenShake(4);

  console.log('Landed on platform!');
}

function bump() {

  // Bump sound
  beep(300, 80, 0.15);
  screenShake(2);

  console.log('Hit the ceiling!');
}

function drawPlayer() {
  // Draw spaceship body
  ctx.fillStyle = PLAYER_COLOR;

  // Main body (triangle pointing up)
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y); // Top point
  ctx.lineTo(player.x, player.y + player.height); // Bottom left
  ctx.lineTo(player.x + player.width, player.y + player.height); // Bottom right
  ctx.closePath();
  ctx.fill();

  // Cockpit window
  ctx.fillStyle = 'rgb(150, 200, 255)';
  ctx.beginPath();
  ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 6, 0, Math.PI * 2);
  ctx.fill();

  // Thruster glow when moving
  if (player.velocityY > 0) {
    ctx.fillStyle = 'rgba(255, 150, 50, 0.6)';
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2 - 5, player.y + player.height);
    ctx.lineTo(player.x + player.width / 2 + 5, player.y + player.height);
    ctx.lineTo(player.x + player.width / 2, player.y + player.height + 10);
    ctx.closePath();
    ctx.fill();
  }
}

// =============================================
// 🏆 SCORE DISPLAY FUNCTIONS
// =============================================

function drawScore() {
  // Draw the score in big letters at the bottom of the screen!
  // This makes it easy to see and add juice effects to

  // TODO: Try adding juice here! Ideas:
  // - Make the score pulse when you collect a coin (change size)
  // - Make it shake when you collect a coin (add to position)
  // - Change color based on score (use if statements)
  // - Add a shadow or outline effect

  ctx.fillStyle = SCORE_COLOR;
  ctx.font = `bold ${SCORE_SIZE}px 'Courier New', monospace`;
  ctx.textAlign = 'center';  // Center the text
  ctx.textBaseline = 'middle';

  // Draw at center of canvas, near the bottom
  ctx.fillText(`ENERGY: ${score}`, canvas.width / 2, SCORE_Y_POSITION);
}

function onDeath() {
  // This is called when you touch a laser beam!
  // Add effects here to make it feel dramatic

  screenShake(15);
  beep(100, 300, 0.4);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(255, 100, 50)', 40);

  console.log('Ship destroyed! Respawning...');
}

// =============================================
// ☠️ DANGEROUS PLATFORM FUNCTIONS
// =============================================

function drawBadPlatforms() {
  // Draw the dangerous platforms as laser beams!
  for (const platform of badPlatforms) {
    // Draw glowing laser beam
    ctx.shadowBlur = 20;
    ctx.shadowColor = BAD_PLATFORM_COLOR;
    ctx.fillStyle = BAD_PLATFORM_COLOR;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Add animated scan lines
    const time = Date.now() / 100;
    const scanPos = (time % platform.width);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(platform.x + scanPos, platform.y, 3, platform.height);

    ctx.shadowBlur = 0;
  }
}

// =============================================
// 💰 COIN FUNCTIONS (ENERGY CRYSTALS!)
// =============================================

function onCoinCollected(coin) {
  // This is called when you collect an energy crystal!
  // Add effects and sounds here to make it feel awesome

  screenShake(3);
  beep(660, 80, 0.3);
  spawnParticles(coin.x, coin.y, COIN_COLOR, 20);

  console.log('Energy crystal collected! Score:', score, '- Crystals left:', coins.length);
}

function onAllCoinsCollected() {
  // This is called when all energy crystals are collected!
  // Add a victory celebration here

  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(255, 255, 100)', 100);
  screenShake(12);
  beep(880, 200, 0.5);

  console.log('All crystals collected! Mission success!');
}

function drawCoins() {
  // Draw energy crystals with glow effect!
  for (const coin of coins) {
    const time = Date.now() / 1000;
    const pulse = Math.sin(time * 3 + coin.x) * 0.3 + 0.7;

    // Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = COIN_COLOR;

    // Crystal shape (diamond)
    ctx.fillStyle = COIN_COLOR;
    ctx.globalAlpha = pulse;
    ctx.beginPath();
    ctx.moveTo(coin.x, coin.y - coin.size / 2); // Top
    ctx.lineTo(coin.x + coin.size / 2, coin.y); // Right
    ctx.lineTo(coin.x, coin.y + coin.size / 2); // Bottom
    ctx.lineTo(coin.x - coin.size / 2, coin.y); // Left
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
  }
}

// =============================================
// ✨ PARTICLE FUNCTIONS
// =============================================

function spawnParticles(x, y, color, count = 10) {
  // Create particle explosion at position (x, y)
  // color: particle color (try 'rgb(243, 156, 18)', 'rgb(231, 76, 60)', 'rgb(52, 152, 219)')
  // count: how many particles (try 5, 20, 50)

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;  // Random direction
    const speed = 2 + Math.random() * 4;        // Random speed

    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,  // X velocity
      vy: Math.sin(angle) * speed,  // Y velocity
      color: color,
      life: 1.0,  // Starts at full life
      decay: 0.02 + Math.random() * 0.02  // How fast it fades
    });
  }

  console.log(`Spawned ${count} particles at (${x}, ${y})`);
}

function drawParticles() {
  // Draw all particles
  for (const p of particles) {
    ctx.globalAlpha = p.life;  // Fade based on life
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;  // Reset alpha
}

// =============================================
// 🌟 BACKGROUND EFFECTS
// =============================================

function drawStars() {
  // Draw twinkling stars!
  const time = Date.now() / 1000;
  for (const star of stars) {
    const twinkle = Math.sin(time + star.twinkle) * 0.5 + 0.5;
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = STAR_COLOR;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
}

// =============================================
// 🎵 SOUND & EFFECTS FUNCTIONS
// =============================================

// Camera shake effect
let shakeAmount = 0;
let shakeDecay = 0.9;

function screenShake(intensity) {
  // Adds camera shake effect
  // intensity: how strong the shake is (try 3, 5, 10)
  shakeAmount = intensity;
  console.log('Screen shake!', intensity);
}


// Simple beep sounds using Web Audio API (no files needed!)
let audioContext = null;

function beep(frequency = 440, duration = 100, volume = 0.3) {
  // Makes a simple beep sound without needing sound files
  // frequency: how high the beep (220 = low, 440 = middle, 880 = high)
  // duration: how long in milliseconds
  // volume: how loud (0.0 to 1.0)

  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'square'; // Try: 'sine', 'square', 'sawtooth', 'triangle'

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);

    console.log('Beep!', frequency + 'Hz');
  } catch (e) {
    console.warn('Could not play beep:', e);
  }
}

// =============================================
// 🔧 GAME MECHANICS (Advanced - be careful!)
// =============================================
// These functions make the game work, but you probably
// don't need to change them unless you're adding new features!

// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
const player = {
  x: 100,
  y: 100,
  width: PLAYER_SIZE,
  height: PLAYER_SIZE,
  velocityX: 0,
  velocityY: 0,
  isOnGround: false,
  wasOnGround: false  // Track previous frame's ground state
};

const keys = {};       // Keyboard input tracking
let score = 0;         // Score tracking
const coins = [];      // All coins in the game
const particles = [];  // All particles for effects

function handleInput() {
  // Left/Right movement
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    player.velocityX = -PLAYER_SPEED;
  } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    player.velocityX = PLAYER_SPEED;
  } else {
    player.velocityX *= FRICTION; // Slow down when no key pressed
  }

  // Jumping
  if (keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']) {

    if (player.isOnGround) {
      player.velocityY = -JUMP_POWER;
      player.isOnGround = false;
      jump();
    }


  }
}

function applyPhysics() {
  // Apply gravity
  player.velocityY += GRAVITY;

  // Update position based on velocity
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Keep player on screen (left/right bounds)
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // Keep player on screen (top/bottom bounds)
  // This is useful when GRAVITY is negative!
  if (player.y < 0) {
    player.y = 0;
    player.velocityY = 0; // Stop moving up
  }
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0; // Stop moving down
  }

  // Reset ground status (will be set to true if colliding with platform)
  player.wasOnGround = player.isOnGround;  // Remember previous state
  player.isOnGround = false;
}

function checkPlatformCollisions() {
  // Check collision with each platform
  for (const platform of platforms) {
    // Check if player is overlapping with platform
    if (player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y + player.height > platform.y) {

      // Player is falling and hits platform from above
      if (player.velocityY > 0 &&
        player.y + player.height - player.velocityY <= platform.y) {
        player.y = platform.y - player.height;
        player.velocityY = 0;  // Stop falling

        // Only call land() if we weren't on ground before (just landed!)
        if (!player.wasOnGround) {
          land();
        }
        player.isOnGround = true;
      }

      // Player is rising and hits platform from below (bumps head)
      if (player.velocityY < 0 &&
        player.y - player.velocityY >= platform.y + platform.height) {
        player.y = platform.y + platform.height;
        player.velocityY = 0;
        bump();
      }
    }
  }
}

function isTooCloseToObject(x, y, objectSize) {
  // Check if a position (x, y) would overlap with platforms or other coins
  // objectSize: the size of the object we're trying to place

  // Check platforms (rectangular collision)
  for (const platform of platforms) {
    // Expand the platform boundaries by half the object size to account for the object's width
    const buffer = objectSize / 2;
    if (x > platform.x - buffer &&
      x < platform.x + platform.width + buffer &&
      y > platform.y - buffer &&
      y < platform.y + platform.height + buffer) {
      return true;  // Too close to a platform!
    }
  }

  // Check bad platforms too - don't spawn coins on dangerous areas!
  for (const badPlatform of badPlatforms) {
    const buffer = objectSize * 3; // Extra buffer for bad platforms
    if (x > badPlatform.x - buffer &&
      x < badPlatform.x + badPlatform.width + buffer &&
      y > badPlatform.y - buffer &&
      y < badPlatform.y + badPlatform.height + buffer) {
      return true;  // Too close to a dangerous platform!
    }
  }

  // Check other coins (circular collision)
  const minDistance = objectSize * 2;  // Objects should be at least 2 widths apart
  for (const coin of coins) {
    const distance = Math.hypot(x - coin.x, y - coin.y);
    if (distance < minDistance) {
      return true;  // Too close to another coin!
    }
  }

  return false;  // All good!
}

function addCoin(x, y) {
  // Add a coin at a specific position
  coins.push({ x, y, size: COIN_SIZE });
}

function addRandomCoin() {
  // Add a coin at a random position in the world
  // Keeps it away from edges, platforms, and other coins

  const margin = 50;
  let randomX, randomY;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    randomX = margin + Math.random() * (canvas.width - margin * 2);
    randomY = margin + Math.random() * (canvas.height - margin * 2);
    attempts++;
  } while (isTooCloseToObject(randomX, randomY, COIN_SIZE) && attempts < maxAttempts);

  if (attempts < maxAttempts) {
    addCoin(randomX, randomY);
  }
}

function spawnCoins() {
  // Create all the coins
  if (coins.length > 0) {
    coins.length = 0; // Clear existing coins
  }

  for (let i = 0; i < NUMBER_OF_COINS; i++) {
    addRandomCoin();
  }
}

function collectCoin(coin) {
  // System function that handles coin collection mechanics
  score += POINTS_PER_COIN;

  // Remove from array
  const index = coins.indexOf(coin);
  if (index > -1) coins.splice(index, 1);

  // Call the juice function
  onCoinCollected(coin);

  // Check if all coins collected
  if (coins.length === 0) {
    onAllCoinsCollected();
    spawnCoins();
  }
}

function checkCoinCollisions() {
  // Loop through coins backwards so we can safely remove them
  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];

    // Check if player touches coin
    const distance = Math.hypot(
      (player.x + player.width / 2) - coin.x,
      (player.y + player.height / 2) - coin.y
    );

    if (distance < player.width / 2 + coin.size / 2) {
      collectCoin(coin);
    }
  }
}

function checkBadPlatformCollisions() {
  // Check if player touches any dangerous platforms
  for (const platform of badPlatforms) {
    // Simple AABB (box) collision detection
    if (player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y + player.height > platform.y) {
      respawnPlayer();
      return;
    }
  }
}

function respawnPlayer() {
  // System function that handles respawn mechanics
  onDeath(); // Call the juice function first

  // Reset player position
  player.x = RESPAWN_X;
  player.y = RESPAWN_Y;
  player.velocityX = 0;
  player.velocityY = 0;
  player.isOnGround = false;
  player.wasOnGround = false;

  score = 0; // Reset score on death

  spawnCoins(); // Respawn coins
}

function updateParticles() {
  // Update all particles (called every frame)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Move particle
    p.x += p.vx;
    p.y += p.vy;

    // Apply gravity to particles
    p.vy += 0.2;

    // Fade out
    p.life -= p.decay;

    // Remove dead particles
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function update() {
  handleInput();
  applyPhysics();
  checkPlatformCollisions();
  checkCoinCollisions();
  checkBadPlatformCollisions();
  updateParticles();
}

function render() {
  // Save the canvas state
  ctx.save();

  // Apply screen shake effect
  if (shakeAmount > 0) {
    const shakeX = (Math.random() - 0.5) * shakeAmount;
    const shakeY = (Math.random() - 0.5) * shakeAmount;
    ctx.translate(shakeX, shakeY);
    shakeAmount *= shakeDecay; // Gradually reduce shake

    // Stop shaking when it's small enough
    if (shakeAmount < 0.1) shakeAmount = 0;
  }

  // Clear screen
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars first (background layer)
  drawStars();

  // Draw platforms with metallic look
  ctx.fillStyle = PLATFORM_COLOR;
  for (const platform of platforms) {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Add highlight edge for 3D effect
    ctx.fillStyle = 'rgba(150, 150, 160, 0.3)';
    ctx.fillRect(platform.x, platform.y, platform.width, 3);
    ctx.fillStyle = PLATFORM_COLOR;
  }

  // Draw dangerous platforms
  drawBadPlatforms();

  // Draw game elements
  drawCoins();
  drawParticles();
  drawPlayer();

  // Restore the canvas state (ends screen shake effect)
  ctx.restore();

  // Draw score AFTER restore so it doesn't shake
  // (unless you want the score to shake too - then move this up!)
  drawScore();
}

// =============================================
// ⌨️ INPUT HANDLING
// =============================================

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// =============================================
// 🔁 GAME LOOP
// =============================================

// This is the "chain reaction"!
// Every frame: update → render → repeat
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// =============================================
// 🚀 START THE GAME!
// =============================================

spawnCoins();  // Create coins when game starts
gameLoop();
