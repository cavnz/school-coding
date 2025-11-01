// =============================================
// 🎮 GAME CONFIGURATION
// =============================================
// SUPER JUICY VERSION - ALL EFFECTS ENABLED!

// Physics Settings - CRANKED UP!
const GRAVITY = 0.6;           // Slightly heavier for more satisfying falls
const JUMP_POWER = 13;         // Nice big jumps!
const PLAYER_SPEED = 6;        // Zippy movement
const FRICTION = 0.85;         // Smooth sliding

// Visual Settings - RAINBOW MODE!
const PLAYER_SIZE = 35;          // Bigger player
const PLAYER_COLOR = '#e74c3c';  // Vibrant red player
const PLATFORM_COLOR = '#34495e'; // Dark platforms for contrast
const BACKGROUND_COLOR = '#1a1a2e'; // Deep space background

// Coin Settings - MORE COINS, MORE FUN!
const POINTS_PER_COIN = 500;     // Big points!
const COIN_SIZE = 25;            // Bigger coins
const NUMBER_OF_COINS = 8;       // Lots of coins to collect!
const COIN_COLOR = '#f1c40f';    // Bright yellow

// Platforms to jump on - CHALLENGING LAYOUT!
const platforms = [
  { x: 0, y: 550, width: 800, height: 50 },      // Ground
  { x: 100, y: 480, width: 100, height: 15 },    // Step 1
  { x: 250, y: 420, width: 120, height: 15 },    // Step 2
  { x: 450, y: 360, width: 100, height: 15 },    // Step 3
  { x: 600, y: 300, width: 140, height: 15 },    // Step 4
  { x: 400, y: 240, width: 100, height: 15 },    // Step 5
  { x: 150, y: 180, width: 120, height: 15 },    // Step 6
  { x: 550, y: 120, width: 150, height: 15 }     // Top platform
];

// =============================================
// 👤 PLAYER FUNCTIONS
// =============================================

function jump() {
  if (player.isOnGround) {
    player.velocityY = -JUMP_POWER;
    player.isOnGround = false;

    // JUICE: Jump effects!
    screenShake(4);
    beep(440, 100, 0.25);
    spawnParticles(player.x + player.width / 2, player.y + player.height, PLAYER_COLOR, 8);
  }
}

function land() {
  // JUICE: Landing effects!
  screenShake(6);
  beep(220, 50, 0.3);
  spawnParticles(player.x + player.width / 2, player.y + player.height, '#95a5a6', 12);
}

function bump() {
  player.velocityY = 0;

  // JUICE: Bump effects!
  screenShake(3);
  beep(880, 80, 0.15);
  spawnParticles(player.x + player.width / 2, player.y, '#e67e22', 10);
}

function drawPlayer() {
  // JUICE: Pulsating player with glow!
  const pulse = Math.sin(Date.now() / 200) * 2 + 2;

  // Glow effect
  ctx.shadowBlur = 15;
  ctx.shadowColor = PLAYER_COLOR;

  ctx.fillStyle = PLAYER_COLOR;
  ctx.fillRect(player.x - pulse/2, player.y - pulse/2, player.width + pulse, player.height + pulse);

  // Reset shadow
  ctx.shadowBlur = 0;
}

// =============================================
// 💰 COIN FUNCTIONS
// =============================================

function onCoinCollected(coin) {
  // JUICE: Epic coin collection!
  screenShake(5);
  beep(660, 80, 0.35);

  // Rainbow particles!
  const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
  colors.forEach(color => {
    spawnParticles(coin.x, coin.y, color, 8);
  });

  // Extra sound effect
  setTimeout(() => beep(880, 60, 0.2), 50);
}

function onAllCoinsCollected() {
  // JUICE: MEGA VICTORY CELEBRATION!

  // Multiple screen shakes
  screenShake(15);
  setTimeout(() => screenShake(12), 100);
  setTimeout(() => screenShake(8), 200);

  // Victory fanfare
  beep(523, 150, 0.4); // C
  setTimeout(() => beep(659, 150, 0.4), 160); // E
  setTimeout(() => beep(784, 300, 0.5), 320); // G

  // MASSIVE particle explosion!
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;

  const rainbowColors = ['#e74c3c', '#e67e22', '#f39c12', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6'];

  // Multiple waves of particles
  rainbowColors.forEach((color, i) => {
    setTimeout(() => {
      spawnParticles(centerX, centerY, color, 50);
    }, i * 50);
  });

  // Extra burst after a delay
  setTimeout(() => {
    spawnParticles(centerX, centerY, '#ffffff', 100);
  }, 500);
}

function drawCoins() {
  // JUICE: Spinning, glowing coins!
  const time = Date.now() / 1000;

  for (const coin of coins) {
    const wobble = Math.sin(time * 3 + coin.x) * 3;
    const glow = Math.sin(time * 2 + coin.y) * 5 + 10;

    // Glow effect
    ctx.shadowBlur = glow;
    ctx.shadowColor = COIN_COLOR;

    ctx.fillStyle = COIN_COLOR;
    ctx.beginPath();
    ctx.arc(coin.x, coin.y + wobble, coin.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Inner shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(coin.x - 3, coin.y + wobble - 3, coin.size / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  }
}

// =============================================
// ✨ PARTICLE FUNCTIONS
// =============================================

function spawnParticles(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;

    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: color,
      life: 1.0,
      decay: 0.015 + Math.random() * 0.02,
      size: 2 + Math.random() * 3  // Variable particle size
    });
  }
}

function drawParticles() {
  for (const p of particles) {
    // Glow effect on particles
    ctx.globalAlpha = p.life;
    ctx.shadowBlur = 5;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  ctx.shadowBlur = 0;
}

// =============================================
// 🎵 SOUND & EFFECTS FUNCTIONS
// =============================================

let shakeAmount = 0;
let shakeDecay = 0.9;

function screenShake(intensity) {
  shakeAmount = intensity;
}

const sounds = {};

function playSound(soundName, volume = 0.5, pitch = 1.0) {
  if (sounds[soundName]) {
    try {
      const audio = new Audio(sounds[soundName]);
      audio.volume = volume;
      audio.playbackRate = pitch;
      audio.play();
    } catch (e) {
      console.warn('Could not play sound:', soundName, e);
    }
  }
}

let audioContext = null;

function beep(frequency = 440, duration = 100, volume = 0.3) {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
    console.warn('Could not play beep:', e);
  }
}

// =============================================
// 🔧 GAME MECHANICS (Advanced - be careful!)
// =============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
  x: 100,
  y: 100,
  width: PLAYER_SIZE,
  height: PLAYER_SIZE,
  velocityX: 0,
  velocityY: 0,
  isOnGround: false,
  wasOnGround: false
};

const keys = {};
let score = 0;
const coins = [];
const particles = [];

function handleInput() {
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    player.velocityX = -PLAYER_SPEED;
  } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    player.velocityX = PLAYER_SPEED;
  } else {
    player.velocityX *= FRICTION;
  }

  if (keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']) {
    jump();
  }
}

function applyPhysics() {
  player.velocityY += GRAVITY;
  player.x += player.velocityX;
  player.y += player.velocityY;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  if (player.y < 0) {
    player.y = 0;
    player.velocityY = 0;
  }
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
  }

  player.wasOnGround = player.isOnGround;
  player.isOnGround = false;
}

function checkPlatformCollisions() {
  for (const platform of platforms) {
    if (player.x < platform.x + platform.width &&
        player.x + player.width > platform.x &&
        player.y < platform.y + platform.height &&
        player.y + player.height > platform.y) {

      if (player.velocityY > 0 &&
          player.y + player.height - player.velocityY <= platform.y) {
        player.y = platform.y - player.height;
        player.velocityY = 0;

        if (!player.wasOnGround) {
          land();
        }
        player.isOnGround = true;
      }

      if (player.velocityY < 0 &&
          player.y - player.velocityY >= platform.y + platform.height) {
        player.y = platform.y + platform.height;
        bump();
      }
    }
  }
}

function isTooCloseToObject(x, y, objectSize) {
  for (const platform of platforms) {
    const buffer = objectSize / 2;
    if (x > platform.x - buffer &&
        x < platform.x + platform.width + buffer &&
        y > platform.y - buffer &&
        y < platform.y + platform.height + buffer) {
      return true;
    }
  }

  const minDistance = objectSize * 2;
  for (const coin of coins) {
    const distance = Math.hypot(x - coin.x, y - coin.y);
    if (distance < minDistance) {
      return true;
    }
  }

  return false;
}

function addCoin(x, y) {
  coins.push({ x, y, size: COIN_SIZE });
}

function addRandomCoin() {
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
  coins.length = 0;
  for (let i = 0; i < NUMBER_OF_COINS; i++) {
    addRandomCoin();
  }
}

function collectCoin(coin) {
  score += POINTS_PER_COIN;

  const index = coins.indexOf(coin);
  if (index > -1) coins.splice(index, 1);

  const scoreElement = document.getElementById('score');
  if (scoreElement) scoreElement.textContent = score;

  onCoinCollected(coin);

  if (coins.length === 0) {
    onAllCoinsCollected();
    setTimeout(() => spawnCoins(), 1000); // Delay before respawning
  }
}

function checkCoinCollisions() {
  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];

    const distance = Math.hypot(
      (player.x + player.width / 2) - coin.x,
      (player.y + player.height / 2) - coin.y
    );

    if (distance < player.width / 2 + coin.size / 2) {
      collectCoin(coin);
    }
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.life -= p.decay;

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
  updateParticles();
}

function render() {
  ctx.save();

  if (shakeAmount > 0) {
    const shakeX = (Math.random() - 0.5) * shakeAmount;
    const shakeY = (Math.random() - 0.5) * shakeAmount;
    ctx.translate(shakeX, shakeY);
    shakeAmount *= shakeDecay;

    if (shakeAmount < 0.1) shakeAmount = 0;
  }

  // JUICE: Animated background!
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  const time = Date.now() / 5000;
  gradient.addColorStop(0, BACKGROUND_COLOR);
  gradient.addColorStop(1, `hsl(${(time * 50) % 360}, 20%, 15%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw platforms with glow
  ctx.fillStyle = PLATFORM_COLOR;
  ctx.shadowBlur = 3;
  ctx.shadowColor = '#3498db';
  for (const platform of platforms) {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  }
  ctx.shadowBlur = 0;

  drawCoins();
  drawParticles();
  drawPlayer();

  ctx.restore();
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

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// =============================================
// 🚀 START THE GAME!
// =============================================

spawnCoins();
gameLoop();

// =============================================
// 🛟 ERROR HANDLING
// =============================================

window.addEventListener('error', (e) => {
  alert(`⚠️ Oops! ${e.message}\n\nCheck the console (F12) for details, or refresh to try again.`);
  console.error('Game Error:', e.error);
});
