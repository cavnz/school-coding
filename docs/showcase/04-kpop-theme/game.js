// =============================================
// 🛟 ERROR HANDLING (You can ignore this!)
// =============================================
// Catches mistakes and shows helpful error messages

window.addEventListener('error', (e) => {
  alert(`⚠️ Oops! ${e.message}\n\nCheck the console (F12) for details, or refresh to try again.`);
  console.error('Game Error:', e.error);
});


// =============================================
// 🎮 GAME CONFIGURATION - K-POP THEME
// =============================================
// EXPERIMENT WITH THESE VALUES!
// Try changing them to see what happens

// Physics Settings
const GRAVITY = 0.5;           // How fast things fall (try 0.3 or 1.0)
const JUMP_POWER = 13;         // How high you jump (try 8 or 15)
const PLAYER_SPEED = 6;        // How fast you move left/right (try 3 or 8)
const FRICTION = 0.85;          // How slippery the ground is (0.9 = ice, 0.5 = sticky)

// Visual Settings - K-POP COLORS!
const PLAYER_SIZE = 30;          // Size of your character (try 20 or 50)
const PLAYER_COLOR = 'rgb(255, 105, 180)';  // Hot pink!
const PLATFORM_COLOR = 'rgb(138, 43, 226)'; // Purple platforms
const BACKGROUND_COLOR = 'rgb(255, 20, 147)'; // Deep pink gradient base
const ACCENT_COLOR = 'rgb(255, 215, 0)';  // Gold accents

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
const SCORE_COLOR = 'rgb(255, 255, 255)';    // White text with sparkle!
const SCORE_Y_POSITION = 550 + SCORE_SIZE / 2;     // Y position of score (higher = lower on screen)

// Coin Settings - MUSIC NOTES!
const NUMBER_OF_COINS = 7;       // How many coins to spawn (try 3, 10, 20!)
const POINTS_PER_COIN = 100;     // How many points per coin (try 1, 100, 1000!)
const COIN_SIZE = 20;            // Size of coins
const COIN_COLOR = 'rgb(255, 192, 203)';    // Light pink music note color

// Death Settings - LIGHTNING BOLTS!
const BAD_PLATFORM_COLOR = 'rgb(255, 255, 0)';  // Yellow lightning
const RESPAWN_X = 100;           // Where to respawn horizontally
const RESPAWN_Y = 100;           // Where to respawn vertically


// Dangerous platforms (lightning bolts!) - touching these kills you!
// You can add more by copying the format: { x: , y: , width: , height: }
const badPlatforms = [
   { x: 400, y: 440, width: 100, height: 10 }  // Spikes on the ground
];

// Sparkles for background!
const sparkles = [];
for (let i = 0; i < 50; i++) {
  sparkles.push({
    x: Math.random() * 800,
    y: Math.random() * 600,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 2 + 1,
    hue: Math.random() * 60 + 280  // Purple to pink hues
  });
}

// =============================================
// 👤 PLAYER FUNCTIONS
// =============================================

function jump() {

    // Cute jump sound!
    beep(550, 100, 0.2);
    spawnParticles(player.x + player.width / 2, player.y + player.height, ACCENT_COLOR, 5);
    console.log('Jump! ✨');
}

function land() {

  // Landing with sparkle
  beep(350, 50, 0.3);
  screenShake(3);
  spawnParticles(player.x + player.width / 2, player.y + player.height, PLAYER_COLOR, 8);

  console.log('Landed! 💖');
}

function bump() {

  // Bump sound
  beep(450, 80, 0.15);
  screenShake(2);

  console.log('Oops! 🎵');
}

function drawPlayer() {
  // Draw K-pop idol character with cute style
  ctx.fillStyle = PLAYER_COLOR;

  // Body (rounded rectangle)
  ctx.beginPath();
  ctx.roundRect(player.x, player.y, player.width, player.height, 8);
  ctx.fill();

  // Face details - Teen anime style!
  // Stylized anime eyes (not too large/cute)
  ctx.fillStyle = 'white';

  // Left eye (almond-shaped, more mature)
  ctx.beginPath();
  ctx.ellipse(player.x + 9, player.y + 11, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Right eye
  ctx.beginPath();
  ctx.ellipse(player.x + 21, player.y + 11, 4, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye pupils (medium size)
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(player.x + 9, player.y + 12, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(player.x + 21, player.y + 12, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Single eye highlight (subtle sparkle)
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(player.x + 8, player.y + 10, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(player.x + 20, player.y + 10, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Subtle lip (more mature than big smile)
  ctx.strokeStyle = 'rgba(255, 150, 180, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(player.x + 12, player.y + 21);
  ctx.quadraticCurveTo(player.x + 15, player.y + 22, player.x + 18, player.y + 21);
  ctx.stroke();

  // Headphones
  ctx.fillStyle = ACCENT_COLOR;
  ctx.strokeStyle = ACCENT_COLOR;
  ctx.lineWidth = 3;

  // Left ear cup (semicircle on side of head, facing outward)
  ctx.beginPath();
  ctx.arc(player.x, player.y + 12, 6, Math.PI / 2, Math.PI * 1.5);
  ctx.fill();

  // Right ear cup (semicircle on side of head, facing outward)
  ctx.beginPath();
  ctx.arc(player.x + 30, player.y + 12, 6, -Math.PI / 2, Math.PI / 2);
  ctx.fill();

  // Headband connecting the ear cups (over the top with vertical sides)
  ctx.beginPath();
  ctx.moveTo(player.x, player.y + 6);  // Start at top of left ear cup
  ctx.lineTo(player.x, player.y);      // Go straight up
  ctx.quadraticCurveTo(
    player.x + player.width / 2, player.y - 8,  // Control point (high over head)
    player.x + 30, player.y                     // Top of right side
  );
  ctx.lineTo(player.x + 30, player.y + 6);      // Go straight down to right ear cup
  ctx.stroke();
}

// =============================================
// 🏆 SCORE DISPLAY FUNCTIONS
// =============================================

function drawScore() {
  // Draw the score with sparkly effects!

  // Pulsing effect
  const time = Date.now() / 1000;
  const pulse = Math.sin(time * 3) * 3 + SCORE_SIZE;

  ctx.fillStyle = SCORE_COLOR;
  ctx.font = `bold ${pulse}px 'Arial Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Glow effect
  ctx.shadowBlur = 15;
  ctx.shadowColor = ACCENT_COLOR;

  // Draw at center of canvas, near the bottom
  ctx.fillText(`♪ ${score} ♪`, canvas.width / 2, SCORE_Y_POSITION);

  ctx.shadowBlur = 0;
}

function onDeath() {
  // This is called when you touch lightning!
  // Add effects here to make it feel dramatic

  screenShake(12);
  beep(150, 250, 0.4);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(255, 255, 0)', 35);

  console.log('⚡ Zapped! Starting over... ⚡');
}

// =============================================
// ☠️ DANGEROUS PLATFORM FUNCTIONS
// =============================================

function drawBadPlatforms() {
  // Draw the dangerous platforms as lightning bolts!
  for (const platform of badPlatforms) {
    const time = Date.now() / 100;

    // Pulsing glow
    ctx.shadowBlur = 25;
    ctx.shadowColor = BAD_PLATFORM_COLOR;
    ctx.fillStyle = BAD_PLATFORM_COLOR;

    // Draw zigzag lightning
    const segments = 5;
    const segmentWidth = platform.width / segments;
    ctx.beginPath();
    ctx.moveTo(platform.x, platform.y);

    for (let i = 0; i <= segments; i++) {
      const x = platform.x + i * segmentWidth;
      const y = platform.y + (i % 2 === 0 ? 0 : platform.height);
      ctx.lineTo(x, y);
    }

    ctx.lineWidth = 6;
    ctx.strokeStyle = BAD_PLATFORM_COLOR;
    ctx.stroke();

    ctx.shadowBlur = 0;
  }
}

// =============================================
// 💰 COIN FUNCTIONS (MUSIC NOTES!)
// =============================================

function onCoinCollected(coin) {
  // This is called when you collect a music note!
  // Add effects and sounds here to make it feel awesome

  screenShake(4);
  beep(880, 80, 0.3);
  spawnParticles(coin.x, coin.y, COIN_COLOR, 25);
  spawnParticles(coin.x, coin.y, ACCENT_COLOR, 10);

  console.log('Music note collected! 🎵 Score:', score, '- Notes left:', coins.length);
}

function onAllCoinsCollected() {
  // This is called when all music notes are collected!
  // Victory celebration!

  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, COIN_COLOR, 80);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, ACCENT_COLOR, 50);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(255, 255, 255)', 30);
  screenShake(15);
  beep(1000, 200, 0.5);

  console.log('ALL NOTES COLLECTED! 🎵✨ PERFECT HARMONY! ✨🎵');
}

function drawCoins() {
  // Draw music notes with sparkle effect!
  const time = Date.now() / 1000;

  for (const coin of coins) {
    const pulse = Math.sin(time * 4 + coin.x) * 0.2 + 1.0;
    const float = Math.sin(time * 2 + coin.x) * 3; // Floating animation

    // Glow
    ctx.shadowBlur = 12;
    ctx.shadowColor = COIN_COLOR;

    ctx.save();
    ctx.translate(coin.x, coin.y + float);
    ctx.scale(pulse, pulse);

    // Draw music note (eighth note)
    ctx.fillStyle = COIN_COLOR;

    // Note head (filled circle)
    ctx.beginPath();
    ctx.ellipse(0, 8, 5, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Note stem (vertical line)
    ctx.fillRect(4, -8, 2, 16);

    // Note flag (curved flag at top)
    ctx.beginPath();
    ctx.moveTo(6, -8);
    ctx.quadraticCurveTo(12, -6, 10, 0);
    ctx.quadraticCurveTo(8, -2, 6, -2);
    ctx.fill();

    ctx.restore();
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
    const speed = 2 + Math.random() * 5;        // Random speed

    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,  // X velocity
      vy: Math.sin(angle) * speed,  // Y velocity
      color: color,
      life: 1.0,  // Starts at full life
      decay: 0.015 + Math.random() * 0.02  // How fast it fades
    });
  }

  console.log(`Spawned ${count} sparkles at (${x}, ${y})`);
}

function drawParticles() {
  // Draw all particles with sparkle effect
  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;

    // Draw as star shape
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const x = Math.cos(angle) * 4;
      const y = Math.sin(angle) * 4;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1.0;
}

// =============================================
// 🌟 BACKGROUND EFFECTS
// =============================================

function drawSparkles() {
  // Draw falling/floating sparkles!
  const time = Date.now() / 1000;

  for (const sparkle of sparkles) {
    // Update position
    sparkle.y += sparkle.speed;
    if (sparkle.y > 600) sparkle.y = 0;

    const twinkle = Math.sin(time * 2 + sparkle.x) * 0.5 + 0.5;
    ctx.globalAlpha = twinkle * 0.6;

    // Rainbow sparkle colors
    ctx.fillStyle = `hsl(${sparkle.hue}, 100%, 70%)`;

    // Draw as small star
    ctx.save();
    ctx.translate(sparkle.x, sparkle.y);
    ctx.rotate(time + sparkle.x);
    ctx.fillRect(-sparkle.size / 2, -sparkle.size / 2, sparkle.size, sparkle.size);
    ctx.restore();
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
    oscillator.type = 'sine'; // Sine wave for softer, cuter sounds

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
    p.vy += 0.15;

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

  // Clear screen with gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, 'rgb(255, 105, 180)');  // Hot pink top
  gradient.addColorStop(0.5, 'rgb(186, 85, 211)'); // Purple middle
  gradient.addColorStop(1, 'rgb(138, 43, 226)');   // Dark purple bottom
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw sparkles first (background layer)
  drawSparkles();

  // Draw platforms with gradient
  for (const platform of platforms) {
    const platformGradient = ctx.createLinearGradient(
      platform.x, platform.y,
      platform.x, platform.y + platform.height
    );
    platformGradient.addColorStop(0, PLATFORM_COLOR);
    platformGradient.addColorStop(1, 'rgb(75, 0, 130)');
    ctx.fillStyle = platformGradient;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Add sparkle highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(platform.x, platform.y, platform.width, 4);
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
