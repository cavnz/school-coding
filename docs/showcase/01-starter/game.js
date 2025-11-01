// =============================================
// 🛟 ERROR HANDLING (You can ignore this!)
// =============================================
// Catches mistakes and shows helpful error messages

window.addEventListener('error', (e) => {
  alert(`⚠️ Oops! ${e.message}\n\nCheck the console (F12) for details, or refresh to try again.`);
  console.error('Game Error:', e.error);
});


// =============================================
// 🎮 GAME CONFIGURATION
// =============================================
// EXPERIMENT WITH THESE VALUES!
// Try changing them to see what happens

// Physics Settings
const GRAVITY = 0.5;           // How fast things fall (try 0.3 or 1.0)
const JUMP_POWER = 12;         // How high you jump (try 8 or 15)
const PLAYER_SPEED = 5;        // How fast you move left/right (try 3 or 8)
const FRICTION = 0.8;          // How slippery the ground is (0.9 = ice, 0.5 = sticky)

// Visual Settings
const PLAYER_SIZE = 30;          // Size of your character (try 20 or 50)
const PLAYER_COLOR = '#3498db';  // Color of player (try '#e74c3c' or '#2ecc71')
const PLATFORM_COLOR = '#95a5a6'; // Color of platforms (try '#34495e' or '#7f8c8d')
const BACKGROUND_COLOR = '#34495e'; // Color of background (try '#2c3e50' or '#1a1a1a')

// Platforms to jump on
const platforms = [
  { x: 0, y: 550, width: 800, height: 50 },      // Ground
  { x: 250, y: 450, width: 150, height: 20 },    // Platform 1
  { x: 450, y: 350, width: 150, height: 20 },    // Platform 2
  { x: 200, y: 250, width: 100, height: 20 },    // Platform 3
  { x: 600, y: 200, width: 120, height: 20 },    // Platform 4
  { x: 300, y: 150, width: 120, height: 20 }     // Platform 5
];


// Score Display Settings
const SCORE_SIZE = 48;            // Font size for score (try 36, 64, 80!)
const SCORE_COLOR = '#ecf0f1';    // Color of score text (try '#f1c40f' or '#2ecc71')
const SCORE_Y_POSITION = 550 + SCORE_SIZE / 2;     // Y position of score (higher = lower on screen)

// Coin Settings
const NUMBER_OF_COINS = 0;       // How many coins to spawn (try 3, 10, 20!)
const POINTS_PER_COIN = 100;     // How many points per coin (try 1, 100, 1000!)
const COIN_SIZE = 20;            // Size of coins
const COIN_COLOR = '#f39c12';    // Color of coins (try '#f1c40f' or '#e67e22')

// Death Settings
const BAD_PLATFORM_COLOR = '#e74c3c';  // Color of dangerous platforms (try '#c0392b' or '#000000')
const RESPAWN_X = 100;           // Where to respawn horizontally
const RESPAWN_Y = 100;           // Where to respawn vertically


// Dangerous platforms (spikes, lava, etc.) - touching these kills you!
// You can add more by copying the format: { x: , y: , width: , height: }
const badPlatforms = [
   { x: 500, y: 540, width: 100, height: 10 }  // Spikes on the ground
];

// =============================================
// 👤 PLAYER FUNCTIONS
// =============================================

function jump() {
  if (player.isOnGround) {
    player.velocityY = -JUMP_POWER;
    player.isOnGround = false;

    // TODO: Add juice here! What should happen when you jump?
    // Try calling: screenShake(3)
    // Try calling: beep(440, 100, 0.2)

    console.log('Jump!');
  }
}

function land() {
  // This is called ONCE when the player first touches the ground
  // (not every frame while on the ground)

  // TODO: Add juice here! What should happen when you land?
  // Try calling: screenShake(5)
  // Try calling: beep(220, 50, 0.3)

  console.log('Landed!');
}

function bump() {
  player.velocityY = 0;

  // TODO: Add juice here! What should happen when you bump your head?
  // Try calling: screenShake(2)
  // Try calling: beep(880, 80, 0.15)

  console.log('Bump!');
}

function drawPlayer() {
  ctx.fillStyle = PLAYER_COLOR;
  ctx.fillRect(player.x, player.y, player.width, player.height);
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
  ctx.font = `bold ${SCORE_SIZE}px Arial`;
  ctx.textAlign = 'center';  // Center the text
  ctx.textBaseline = 'middle';

  // Draw at center of canvas, near the bottom
  ctx.fillText(`Score: ${score}`, canvas.width / 2, SCORE_Y_POSITION);
}

function onDeath() {
  // This is called when you touch a dangerous platform!
  // Add effects here to make it feel dramatic

  // TODO: Add juice here! What should happen when you die?
  // Try calling: screenShake(10)
  // Try calling: beep(110, 200, 0.4)
  // Try calling: spawnParticles(player.x + player.width / 2, player.y + player.height / 2, PLAYER_COLOR, 30)

  console.log('You died! Respawning...');
}

// =============================================
// ☠️ DANGEROUS PLATFORM FUNCTIONS
// =============================================

function drawBadPlatforms() {
  // Draw the dangerous platforms as spikes!
  ctx.fillStyle = BAD_PLATFORM_COLOR;
  for (const platform of badPlatforms) {
    // Draw spikes across the width of the platform
    const spikeWidth = 20;  // How wide each spike is
    const numSpikes = Math.ceil(platform.width / spikeWidth);

    for (let i = 0; i < numSpikes; i++) {
      const x = platform.x + i * spikeWidth;
      const y = platform.y;

      // Draw triangle spike
      ctx.beginPath();
      ctx.moveTo(x, y + platform.height);  // Bottom left
      ctx.lineTo(x + spikeWidth / 2, y);   // Top point
      ctx.lineTo(x + spikeWidth, y + platform.height);  // Bottom right
      ctx.closePath();
      ctx.fill();
    }
  }
}

// =============================================
// 💰 COIN FUNCTIONS
// =============================================

function onCoinCollected(coin) {
  // This is called when you collect a coin!
  // Add effects and sounds here to make it feel awesome

  // TODO: Add juice here! What should happen when you collect a coin?
  // Try calling: screenShake(3)
  // Try calling: beep(660, 80, 0.3)
  // Try calling: spawnParticles(coin.x, coin.y, COIN_COLOR, 15)
  // Try calling: playSound('coin')

  console.log('Coin collected! Score:', score, '- Coins left:', coins.length);
}

function onAllCoinsCollected() {
  // This is called when all coins are collected!
  // Add a victory celebration here

  // TODO: Make it epic! Try:
  // spawnParticles(player.x + player.width / 2, player.y + player.height / 2, '#2ecc71', 100);
  // screenShake(10);
  // beep(880, 200, 0.5);

  console.log('All coins collected! New round!');
}

function drawCoins() {
  ctx.fillStyle = COIN_COLOR;
  for (const coin of coins) {
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// =============================================
// ✨ PARTICLE FUNCTIONS
// =============================================

function spawnParticles(x, y, color, count = 10) {
  // Create particle explosion at position (x, y)
  // color: particle color (try '#f39c12', '#e74c3c', '#3498db')
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

// Sound system for loading sound files
const sounds = {
  // You can add sound files here later!
  // Format: 'soundName': 'path/to/sound.mp3'
  // Example:
  // 'jump': 'sounds/jump.wav',
  // 'coin': 'sounds/coin.wav',
  // 'land': 'sounds/land.wav'
};

function playSound(soundName, volume = 0.5, pitch = 1.0) {
  // Plays a sound effect
  // soundName: the name of the sound (must be in sounds object above)
  // volume: how loud (0.0 to 1.0)
  // pitch: how high/low (1.0 = normal, 0.5 = lower, 2.0 = higher)

  if (sounds[soundName]) {
    try {
      const audio = new Audio(sounds[soundName]);
      audio.volume = volume;
      audio.playbackRate = pitch;
      audio.play();
      console.log('Playing sound:', soundName);
    } catch (e) {
      console.warn('Could not play sound:', soundName, e);
    }
  } else {
    // Sound not found - that's okay, just log it
    console.log('Sound not loaded yet:', soundName, '(add it to the sounds object!)');
  }
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
    jump();
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

  // Draw platforms
  ctx.fillStyle = PLATFORM_COLOR;
  for (const platform of platforms) {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
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


