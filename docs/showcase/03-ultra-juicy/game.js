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
// ULTRA JUICY VERSION - EVERYTHING MAXED OUT!

// Physics Settings
const GRAVITY = 0.5;           // How fast things fall (try 0.3 or 1.0)
const JUMP_POWER = 12;         // How high you jump (try 8 or 15)
const PLAYER_SPEED = 5;        // How fast you move left/right (try 3 or 8)
const FRICTION = 0.8;          // How slippery the ground is (0.9 = ice, 0.5 = sticky)

// Visual Settings
const PLAYER_SIZE = 30;          // Size of your character (try 20 or 50)
const PLAYER_COLOR = 'rgb(255, 107, 157)';  // Color of player (try 'rgb(231, 76, 60)' or 'rgb(46, 204, 113)')
const PLATFORM_COLOR_START = 'rgb(107, 114, 120)'; // Starting gray color for platforms - BORING!
const PLATFORM_COLOR_END = 'rgb(78, 205, 196)';   // Bright turquoise at high scores - EXCITING!
const BACKGROUND_COLOR = 'rgb(15, 15, 35)'; // Color of background (try 'rgb(44, 62, 80)' or 'rgb(26, 26, 26)')

// Platforms to jump on
// Added originalX and moveSpeed for animation
const platforms = [
  { x: 0, y: 550, width: 800, height: 50, originalX: 0, moveSpeed: 0 },      // Ground (doesn't move)
  { x: 250, y: 450, width: 150, height: 20, originalX: 250, moveSpeed: 0.5 },    // Platform 1
  { x: 450, y: 350, width: 150, height: 20, originalX: 450, moveSpeed: 0.7 },    // Platform 2
  { x: 200, y: 250, width: 100, height: 20, originalX: 200, moveSpeed: 0.6 },    // Platform 3
  { x: 600, y: 200, width: 120, height: 20, originalX: 600, moveSpeed: 0.8 },    // Platform 4
  { x: 300, y: 150, width: 120, height: 20, originalX: 300, moveSpeed: 0.9 }     // Platform 5
];


// Score Display Settings
const SCORE_SIZE = 48;            // Font size for score (try 36, 64, 80!)
const SCORE_COLOR = 'rgb(255, 235, 59)';    // Color of score text (try 'rgb(241, 196, 15)' or 'rgb(46, 204, 113)')
const SCORE_Y_POSITION = 550 + SCORE_SIZE / 2;     // Y position of score (higher = lower on screen)

// Coin Settings
const NUMBER_OF_COINS = 15;      // LOTS of coins for maximum juice!
const POINTS_PER_COIN = 100;     // How many points per coin
const COIN_SIZE = 20;            // Size of coins
const COIN_COLOR = 'rgb(255, 217, 61)';    // Color of coins

// Death Settings
const BAD_PLATFORM_COLOR = 'rgb(255, 51, 102)';  // Color of dangerous platforms
const RESPAWN_X = 100;           // Where to respawn horizontally
const RESPAWN_Y = 100;           // Where to respawn vertically


// Dangerous platforms (spikes, lava, etc.) - touching these kills you!
const badPlatforms = [
   { x: 500, y: 540, width: 100, height: 10 }  // Spikes on the ground
];

// =============================================
// 💫 ULTRA JUICE VARIABLES
// =============================================

// Trail effect for player
const playerTrail = [];
const BASE_TRAIL_LENGTH = 0; // Starts with NO TRAIL - boring!
const MAX_TRAIL_LENGTH = 18; // Can grow to 18 at high scores - exciting!

// Coin rotation animation
let coinRotation = 0;

// Player rotation animation
let playerRotation = 0;

// Chromatic aberration effect
let chromaticIntensity = 0;

// Speed lines for fast movement
const speedLines = [];

// Floating score popups
const scorePopups = [];

// Background pulse
let backgroundPulse = 0;

// Combo system
let comboCount = 0;
let comboTimer = 0;
const COMBO_TIMEOUT = 120; // frames

const SCORE_PROGRESS_TOTAL = NUMBER_OF_COINS * POINTS_PER_COIN * 1.5; // Score at which maximum juice is reached

// Helper function to interpolate between two colors based on score
function getPlatformColor() {
  // Gradually transitions from gray to turquoise as score increases
  // 0 points = fully gray, total+ points = fully colorful
  const progress = Math.min(score / SCORE_PROGRESS_TOTAL, 1.0);

  // Parse start color (gray)
  const r1 = 107, g1 = 114, b1 = 120; // #6b7278
  // Parse end color (turquoise)
  const r2 = 78, g2 = 205, b2 = 196;  // #4ecdc4

  // Interpolate
  const r = Math.round(r1 + (r2 - r1) * progress);
  const g = Math.round(g1 + (g2 - g1) * progress);
  const b = Math.round(b1 + (b2 - b1) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}

// =============================================
// 👤 PLAYER FUNCTIONS
// =============================================

function jump() {
  if (player.isOnGround) {
    player.velocityY = -JUMP_POWER;
    player.isOnGround = false;

    // ULTRA JUICY JUMP! Particles grow with score
    const jumpParticles = 5 + Math.floor(score / 100); // Start at 5, grows to 20+ at high scores
    screenShake(3 + Math.min(score / 200, 5));
    beep(440, 100, 0.3);
    beep(554, 100, 0.2); // Add harmony!
    spawnParticles(player.x + player.width / 2, player.y + player.height, PLAYER_COLOR, jumpParticles);
    spawnParticles(player.x + player.width / 2, player.y + player.height, 'rgb(255, 138, 193)', Math.floor(jumpParticles * 0.6));

    // Add speed lines! Grow with score
    const numSpeedLines = Math.max(0, Math.floor(score / 200)); // Start with 0, gain more at high scores
    for (let i = 0; i < numSpeedLines; i++) {
      speedLines.push({
        x: player.x + player.width / 2,
        y: player.y + player.height,
        length: 20 + Math.random() * 20,
        angle: Math.PI / 2, // Point down
        life: 1.0,
        width: 2
      });
    }

    // Chromatic aberration burst!
    chromaticIntensity = 5;

    console.log('💨 SUPER JUMP!');
  }
}

function land() {
  // ULTRA JUICY LANDING! Particles grow with score
  const landingForce = Math.abs(player.velocityY) / 2;
  const landParticles = 8 + Math.floor(score / 80); // Start at 8, grows to 30+ at high scores
  screenShake(Math.min(landingForce + score / 150, 12));
  beep(220, 80, 0.4);
  beep(165, 80, 0.3); // Lower harmony

  // Dust cloud grows with score!
  const platformColor = getPlatformColor();
  spawnParticles(player.x + player.width / 2, player.y + player.height, platformColor, landParticles);
  spawnParticles(player.x + player.width / 2, player.y + player.height, 'rgb(110, 231, 223)', Math.floor(landParticles * 0.6));

  // Landing shockwave effect - grows with score
  const shockwaveLines = Math.max(0, Math.floor(score / 150)); // Start with 0, gain more at high scores
  for (let i = 0; i < shockwaveLines; i++) {
    const angle = (i / Math.max(shockwaveLines, 1)) * Math.PI * 2;
    speedLines.push({
      x: player.x + player.width / 2,
      y: player.y + player.height,
      length: 30,
      angle: angle,
      life: 1.0,
      width: 3
    });
  }

  // Background pulse
  backgroundPulse = 0.3;

  console.log('💥 EPIC LANDING!');
}

function bump() {
  player.velocityY = 0;

  // ULTRA JUICY HEAD BUMP! Particles grow with score
  const bumpParticles = 5 + Math.floor(score / 120); // Start at 5, grows with score
  screenShake(2 + Math.min(score / 250, 4));
  beep(880, 100, 0.2);
  beep(1100, 100, 0.15);
  const platformColor = getPlatformColor();
  spawnParticles(player.x + player.width / 2, player.y, platformColor, bumpParticles);
  spawnParticles(player.x + player.width / 2, player.y, 'rgb(110, 231, 223)', Math.floor(bumpParticles * 0.6));

  // Stars circling the head! Grow with score
  const numStars = Math.max(0, Math.floor(score / 200)); // Start with 0, gain more at high scores
  for (let i = 0; i < numStars; i++) {
    const angle = (i / Math.max(numStars, 1)) * Math.PI * 2;
    particles.push({
      x: player.x + player.width / 2,
      y: player.y,
      vx: Math.cos(angle) * 3,
      vy: Math.sin(angle) * 3 - 2,
      color: 'rgb(255, 235, 59)',
      life: 1.5,
      decay: 0.015,
      size: 5
    });
  }

  chromaticIntensity = 3;

  console.log('⭐ BONK!');
}

function drawPlayer() {
  // Draw trail effect with rounded corners
  for (let i = 0; i < playerTrail.length; i++) {
    const trail = playerTrail[i];
    ctx.save();
    ctx.globalAlpha = trail.alpha;

    // Apply rotation to trail if it has rotation property
    if (trail.rotation !== undefined) {
      ctx.translate(trail.x + player.width / 2, trail.y + player.height / 2);
      ctx.rotate(trail.rotation);
      ctx.translate(-(trail.x + player.width / 2), -(trail.y + player.height / 2));
    }

    ctx.fillStyle = PLAYER_COLOR;

    // Rounded rectangle for trail
    const radius = 8;
    ctx.beginPath();
    ctx.roundRect(trail.x, trail.y, player.width, player.height, radius);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1.0;

  // Save context for rotation
  ctx.save();

  // Translate to player center, rotate, then translate back
  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;
  ctx.translate(centerX, centerY);
  ctx.rotate(playerRotation);
  ctx.translate(-centerX, -centerY);

  // Glow intensity increases with score! Starts minimal, grows to intense
  const glowIntensity = 0 + Math.min(score / 40, 40); // Starts at 0 (no glow), max 40 glow at high scores
  ctx.shadowBlur = glowIntensity;
  ctx.shadowColor = PLAYER_COLOR;
  ctx.fillStyle = PLAYER_COLOR;

  const radius = 8;
  ctx.beginPath();
  ctx.roundRect(player.x, player.y, player.width, player.height, radius);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Add a lighter color on top for depth
  const gradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.height);
  gradient.addColorStop(0, 'rgb(255, 138, 193)');
  gradient.addColorStop(1, PLAYER_COLOR);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(player.x, player.y, player.width, player.height, radius);
  ctx.fill();

  // Add eyes!
  ctx.fillStyle = 'rgb(236, 240, 241)';
  ctx.beginPath();
  ctx.arc(player.x + 11, player.y + 13, 4, 0, Math.PI * 2);
  ctx.arc(player.x + 19, player.y + 13, 4, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = 'rgb(44, 62, 80)';
  ctx.beginPath();
  ctx.arc(player.x + 11, player.y + 13, 2, 0, Math.PI * 2);
  ctx.arc(player.x + 19, player.y + 13, 2, 0, Math.PI * 2);
  ctx.fill();

  // Add a smile!
  ctx.strokeStyle = 'rgb(44, 62, 80)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(player.x + player.width / 2, player.y + 18, 8, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.restore();
}

// =============================================
// 🏆 SCORE DISPLAY FUNCTIONS
// =============================================

// Score pulse animation
let scorePulse = 1.0;
let scoreWobble = 0;
let scoreRotation = 0;

function drawScore() {
  // ULTRA JUICY SCORE DISPLAY!

  // Pulse animation
  if (scorePulse > 1.0) {
    scorePulse -= 0.03;
    if (scorePulse < 1.0) scorePulse = 1.0;
  }

  // Wobble effect
  scoreWobble *= 0.9;
  scoreRotation *= 0.9;

  // Calculate effects
  const pulsingSize = SCORE_SIZE * scorePulse;
  const wobbleX = Math.sin(scoreWobble) * 10;

  // Rainbow color based on score! Gets wilder as score increases!
  let scoreColor = SCORE_COLOR;
  const hue = (score / 5) % 360; // Faster color cycling!
  if (score >= 1000) {
    // ULTRA RAINBOW at high scores - super saturated!
    scoreColor = `hsl(${hue}, 100%, 65%)`;
  } else if (score >= 500) {
    // Vibrant rainbow
    scoreColor = `hsl(${hue}, 85%, 60%)`;
  } else if (score >= 200) {
    // Purple glow
    scoreColor = 'rgb(167, 139, 250)';
  }

  ctx.save();
  ctx.translate(canvas.width / 2 + wobbleX, SCORE_Y_POSITION);
  ctx.rotate(scoreRotation);

  // Glow effect
  ctx.shadowBlur = 20;
  ctx.shadowColor = scoreColor;

  ctx.fillStyle = scoreColor;
  ctx.font = `bold ${pulsingSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(`Score: ${score}`, 0, 0);

  // Add outline
  ctx.strokeStyle = 'rgb(44, 62, 80)';
  ctx.lineWidth = 3;
  ctx.strokeText(`Score: ${score}`, 0, 0);

  ctx.restore();
  ctx.shadowBlur = 0;

  // Draw combo meter
  if (comboCount > 0) {
    const comboX = canvas.width / 2;
    const comboY = SCORE_Y_POSITION - 50;

    ctx.save();
    ctx.translate(comboX, comboY);

    // Combo background
    ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
    ctx.fillRect(-60, -20, 120, 40);

    // Combo text
    ctx.fillStyle = 'rgb(236, 240, 241)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`COMBO x${comboCount}`, 0, 0);

    ctx.restore();
  }
}

function onDeath() {
  // ULTRA DRAMATIC DEATH!
  screenShake(25);

  // Death sound sequence
  beep(880, 50, 0.4);
  setTimeout(() => beep(660, 50, 0.4), 50);
  setTimeout(() => beep(440, 50, 0.4), 100);
  setTimeout(() => beep(220, 50, 0.4), 150);
  setTimeout(() => beep(110, 400, 0.5), 200);

  // MASSIVE particle explosion
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, PLAYER_COLOR, 100);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(255, 51, 102)', 80);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(255, 235, 59)', 60);

  // Explosion rings
  for (let ring = 0; ring < 3; ring++) {
    setTimeout(() => {
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        speedLines.push({
          x: player.x + player.width / 2,
          y: player.y + player.height / 2,
          length: 50,
          angle: angle,
          life: 1.0,
          width: 4
        });
      }
    }, ring * 100);
  }

  // Maximum chromatic aberration
  chromaticIntensity = 20;

  // Screen flash
  backgroundPulse = 1.0;

  // Reset combo
  comboCount = 0;

  console.log('💀 SPECTACULAR DEATH!');
}

// =============================================
// ☠️ DANGEROUS PLATFORM FUNCTIONS
// =============================================

function drawBadPlatforms() {
  // Draw animated spikes!
  const time = Date.now() / 1000;

  for (const platform of badPlatforms) {
    const spikeWidth = 20;
    const numSpikes = Math.ceil(platform.width / spikeWidth);

    for (let i = 0; i < numSpikes; i++) {
      const x = platform.x + i * spikeWidth;
      const y = platform.y;

      // Pulsing effect
      const pulseOffset = Math.sin(time * 3 + i * 0.5) * 2;

      // Gradient for spikes
      const gradient = ctx.createLinearGradient(x, y, x, y + platform.height);
      gradient.addColorStop(0, 'rgb(255, 51, 102)');
      gradient.addColorStop(1, 'rgb(255, 26, 77)');
      ctx.fillStyle = gradient;

      // Draw triangle spike
      ctx.beginPath();
      ctx.moveTo(x, y + platform.height);
      ctx.lineTo(x + spikeWidth / 2, y + pulseOffset);
      ctx.lineTo(x + spikeWidth, y + platform.height);
      ctx.closePath();
      ctx.fill();

      // Add glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgb(255, 51, 102)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
}

// =============================================
// 💰 COIN FUNCTIONS
// =============================================

function onCoinCollected(coin) {
  // ULTRA JUICY COIN COLLECTION!

  // Increment combo
  comboCount++;
  comboTimer = COMBO_TIMEOUT;

  const comboMultiplier = comboCount;
  const points = POINTS_PER_COIN * comboMultiplier;

  screenShake(3 + comboCount);

  // Musical scale that goes up with combo!
  const baseFreq = 660;
  const noteFreq = baseFreq * Math.pow(1.06, comboCount % 12);
  beep(noteFreq, 100, 0.3);

  // Particle explosion grows with score!
  const coinParticles = 10 + Math.floor(score / 60); // Start at 10, grows to 40+ at high scores
  spawnParticles(coin.x, coin.y, COIN_COLOR, coinParticles);
  spawnParticles(coin.x, coin.y, 'rgb(255, 235, 59)', Math.floor(coinParticles * 0.65));
  spawnParticles(coin.x, coin.y, 'rgb(255, 167, 38)', Math.floor(coinParticles * 0.5));
  spawnParticles(coin.x, coin.y, 'rgb(255, 249, 196)', Math.floor(coinParticles * 0.3));

  // Shockwave grows with score!
  const shockwaveCount = 4 + Math.floor(score / 100); // Start at 4, grows to 16+ at high scores
  for (let i = 0; i < shockwaveCount; i++) {
    const angle = (i / shockwaveCount) * Math.PI * 2;
    speedLines.push({
      x: coin.x,
      y: coin.y,
      length: 40,
      angle: angle,
      life: 1.0,
      width: 3
    });
  }

  // Floating score popup - more colors based on combo!
  let popupColor = COIN_COLOR;
  if (comboCount > 10) popupColor = 'rgb(255, 51, 102)';
  else if (comboCount > 5) popupColor = 'rgb(167, 139, 250)';

  scorePopups.push({
    x: coin.x,
    y: coin.y,
    text: `+${points}`,
    life: 1.0,
    vy: -2,
    scale: 1.5,
    color: popupColor
  });

  // HUGE score pulse for combos
  scorePulse = 1.2 + (comboCount * 0.1);
  scoreWobble = comboCount * 0.5;
  scoreRotation = (Math.random() - 0.5) * 0.2;

  // Chromatic aberration
  chromaticIntensity = 5 + comboCount;

  // Background pulse
  backgroundPulse = 0.2;

  console.log(`🪙 COIN! Combo x${comboCount}! +${points} points!`);
}

function onAllCoinsCollected() {
  // 🎆 ULTIMATE VICTORY CELEBRATION! 🎆

  // MASSIVE SCORE BONUS for completing all coins!
  const completionBonus = 1000;
  score += completionBonus;

  screenShake(30);

  // Epic musical fanfare!
  beep(880, 150, 0.5);
  setTimeout(() => beep(1047, 150, 0.5), 150);
  setTimeout(() => beep(1319, 150, 0.5), 300);
  setTimeout(() => beep(1760, 400, 0.6), 450);

  // Rainbow fireworks!
  const colors = ['rgb(255, 51, 102)', 'rgb(255, 167, 38)', 'rgb(255, 217, 61)', 'rgb(78, 205, 196)', 'rgb(255, 107, 157)', 'rgb(167, 139, 250)', 'rgb(255, 235, 59)'];

  for (let burst = 0; burst < 5; burst++) {
    setTimeout(() => {
      const burstX = 200 + Math.random() * 400;
      const burstY = 100 + Math.random() * 300;

      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 5;
        particles.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 2.0,
          decay: 0.01 + Math.random() * 0.01,
          size: 4
        });
      }

      // Add sparkles
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        particles.push({
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: 'rgb(236, 240, 241)',
          life: 1.5,
          decay: 0.02,
          size: 2
        });
      }
    }, burst * 200);
  }

  // Player celebration explosion
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(78, 205, 196)', 100);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(255, 107, 157)', 80);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(255, 217, 61)', 80);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(255, 51, 102)', 60);
  spawnParticles(player.x + player.width / 2, player.y + player.height / 2, 'rgb(167, 139, 250)', 60);

  // Radial shockwaves
  for (let wave = 0; wave < 3; wave++) {
    setTimeout(() => {
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        speedLines.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          length: 100,
          angle: angle,
          life: 1.5,
          width: 6
        });
      }
    }, wave * 150);
  }

  // HUGE floating bonus popup!
  scorePopups.push({
    x: canvas.width / 2,
    y: canvas.height / 2 - 100,
    text: `+${completionBonus} BONUS!`,
    life: 2.0,
    vy: -1,
    scale: 2.5,
    color: 'rgb(78, 205, 196)'
  });

  // MEGA score effects
  scorePulse = 3.0;
  scoreWobble = 10;

  // Maximum chromatic aberration
  chromaticIntensity = 30;

  // Screen flash
  backgroundPulse = 1.5;

  console.log(`🎆🎇🎆 ULTIMATE VICTORY! ALL COINS! +${completionBonus} BONUS! 🎆🎇🎆`);
}

function drawCoins() {
  // Animated coins with rotation and glow!
  coinRotation += 0.05;

  for (const coin of coins) {
    ctx.save();
    ctx.translate(coin.x, coin.y);

    // Pulsing scale
    const scale = 1 + Math.sin(Date.now() / 200 + coin.x) * 0.1;
    ctx.scale(scale, scale);

    // Glow effect increases with score! Starts subtle, grows intense
    const coinGlowIntensity = 0 + Math.min(score / 50, 25); // Starts at 0 (no glow), max 25 at high scores
    ctx.shadowBlur = coinGlowIntensity;
    ctx.shadowColor = COIN_COLOR;

    // Draw coin with gradient
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coin.size / 2);
    gradient.addColorStop(0, 'rgb(255, 235, 59)');
    gradient.addColorStop(0.5, COIN_COLOR);
    gradient.addColorStop(1, 'rgb(255, 167, 38)');
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(0, 0, coin.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Add sparkle
    const sparkleAngle = coinRotation * 3 + coin.x;
    const sparkleX = Math.cos(sparkleAngle) * (coin.size / 3);
    const sparkleY = Math.sin(sparkleAngle) * (coin.size / 3);
    ctx.fillStyle = 'rgb(236, 240, 241)';
    ctx.beginPath();
    ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.shadowBlur = 0;
  }
}

function updateCoins() {
  // Coins randomly emit sparks! Frequency increases with score
  const baseSparkChance = 0.005; // 0.5% chance per frame per coin at start
  const scoreBonus = Math.min(score / 2000, 0.045); // Up to +4.5% at high scores
  const sparkChance = baseSparkChance + scoreBonus;

  for (const coin of coins) {
    if (Math.random() < sparkChance) {
      // Emit a small spark!
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      particles.push({
        x: coin.x,
        y: coin.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5, // Slight upward bias
        color: Math.random() > 0.5 ? COIN_COLOR : 'rgb(255, 235, 59)',
        life: 0.8,
        decay: 0.02 + Math.random() * 0.02,
        size: 2 + Math.random()
      });
    }
  }
}

// =============================================
// ✨ PARTICLE FUNCTIONS
// =============================================

function spawnParticles(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;

    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: color,
      life: 1.0,
      decay: 0.015 + Math.random() * 0.02,
      size: 3 + Math.random() * 2
    });
  }

  console.log(`✨ ${count} particles spawned!`);
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;

    // Add glow to particles
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
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
  shakeAmount = Math.max(shakeAmount, intensity);
  console.log('📳 MEGA SHAKE!', intensity);
}

const sounds = {};

function playSound(soundName, volume = 0.5, pitch = 1.0) {
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
    console.log('Sound not loaded yet:', soundName);
  }
}

let audioContext = null;
let backgroundMusicGain = null;
let musicPlaying = false;

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

    console.log('🔊', frequency + 'Hz');
  } catch (e) {
    console.warn('Could not play beep:', e);
  }
}

// Background music system - procedurally generated!
function startBackgroundMusic() {
  if (musicPlaying) return;

  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    musicPlaying = true;

    // Create a gain node for volume control
    backgroundMusicGain = audioContext.createGain();
    backgroundMusicGain.gain.setValueAtTime(0.15, audioContext.currentTime);
    backgroundMusicGain.connect(audioContext.destination);

    // Musical scale: C major (full scale for better melody!)
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C D E F G A B C

    // Chord progression (I - V - vi - IV) - Classic pop progression!
    const chordProgression = [
      { root: 0, notes: [0, 2, 4] },  // C major (C E G)
      { root: 4, notes: [4, 6, 1] },  // G major (G B D)
      { root: 5, notes: [5, 0, 2] },  // A minor (A C E)
      { root: 3, notes: [3, 5, 0] }   // F major (F A C)
    ];

    // Catchy melody line (indexes into scale)
    const melody = [
      4, 5, 7, 5, 4, 2, 0, 2,  // First phrase
      4, 5, 7, 5, 4, 2, 4, 4,  // Second phrase
      5, 5, 4, 4, 2, 2, 0, 0,  // Third phrase
      7, 5, 4, 2, 4, 5, 4, 2   // Fourth phrase
    ];

    let chordIndex = 0;
    let melodyIndex = 0;
    let beatCount = 0;
    const baseBeatDuration = 0.35; // Faster base tempo for more energy

    function playChord() {
      if (!musicPlaying) return;

      // Dynamic music based on score!
      const scoreMultiplier = 1 + (score / 2000); // Speeds up as score increases
      const volumeBoost = 1 + (score / 1500); // Gets louder as score increases
      const beatDuration = baseBeatDuration / scoreMultiplier;

      // Update master volume dynamically
      backgroundMusicGain.gain.setValueAtTime(0.15 * Math.min(volumeBoost, 2.5), audioContext.currentTime);

      const chord = chordProgression[chordIndex % chordProgression.length];
      const now = audioContext.currentTime;

      // Play melody note (louder and more prominent)
      const melodyNote = melody[melodyIndex % melody.length];
      const melodyOsc = audioContext.createOscillator();
      const melodyGain = audioContext.createGain();

      melodyOsc.connect(melodyGain);
      melodyGain.connect(backgroundMusicGain);

      melodyOsc.frequency.setValueAtTime(scale[melodyNote] * 2, now); // Octave higher
      melodyOsc.type = 'square'; // Brighter, more video-game sound

      // Envelope for melody
      melodyGain.gain.setValueAtTime(0, now);
      melodyGain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      melodyGain.gain.exponentialRampToValueAtTime(0.01, now + beatDuration * 1.5);

      melodyOsc.start(now);
      melodyOsc.stop(now + beatDuration * 1.5);

      // Play chord on downbeats (every 2 beats)
      if (beatCount % 2 === 0) {
        chord.notes.forEach((noteIndex) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();

          osc.connect(gain);
          gain.connect(backgroundMusicGain);

          osc.frequency.setValueAtTime(scale[noteIndex], now);
          osc.type = 'sine'; // Soft, musical tone

          // Envelope: fade in and out
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, now + beatDuration * 4);

          osc.start(now);
          osc.stop(now + beatDuration * 4);
        });

        // Play bass note (octave lower)
        const bassOsc = audioContext.createOscillator();
        const bassGain = audioContext.createGain();

        bassOsc.connect(bassGain);
        bassGain.connect(backgroundMusicGain);

        bassOsc.frequency.setValueAtTime(scale[chord.root] / 2, now);
        bassOsc.type = 'triangle';

        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + beatDuration * 4);

        bassOsc.start(now);
        bassOsc.stop(now + beatDuration * 4);
      }

      // Advance counters
      melodyIndex++;
      beatCount++;

      // Change chord every 8 beats
      if (beatCount % 8 === 0) {
        chordIndex++;
      }

      // Schedule next beat (timing speeds up with score!)
      setTimeout(playChord, beatDuration * 1000);
    }

    // Start the music!
    playChord();

    console.log('🎵 Dynamic background music started!');
  } catch (e) {
    console.warn('Could not start background music:', e);
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

  // Check bad platforms too - don't spawn coins on dangerous areas!
  for (const badPlatform of badPlatforms) {
    const buffer = objectSize * 3; // Extra buffer for bad platforms
    if (x > badPlatform.x - buffer &&
      x < badPlatform.x + badPlatform.width + buffer &&
      y > badPlatform.y - buffer &&
      y < badPlatform.y + badPlatform.height + buffer) {
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
  if (coins.length > 0) {
    coins.length = 0;
  }

  for (let i = 0; i < NUMBER_OF_COINS; i++) {
    addRandomCoin();
  }
}

function collectCoin(coin) {
  score += POINTS_PER_COIN * comboCount;

  const index = coins.indexOf(coin);
  if (index > -1) coins.splice(index, 1);

  onCoinCollected(coin);

  if (coins.length === 0) {
    onAllCoinsCollected();
    spawnCoins();
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

function checkBadPlatformCollisions() {
  for (const platform of badPlatforms) {
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
  onDeath();

  player.x = RESPAWN_X;
  player.y = RESPAWN_Y;
  player.velocityX = 0;
  player.velocityY = 0;
  player.isOnGround = false;
  player.wasOnGround = false;

  score = 0;

  spawnCoins();
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

function updateTrail() {
  // Trail length and opacity increase with score!
  const currentMaxTrail = BASE_TRAIL_LENGTH + Math.floor(Math.min(score / 80, MAX_TRAIL_LENGTH - BASE_TRAIL_LENGTH));
  const trailOpacity = 0 + Math.min(score / 1200, 0.6); // Starts invisible (0), max 0.6 at high scores

  // Add current position to trail with rotation
  playerTrail.unshift({
    x: player.x,
    y: player.y,
    alpha: trailOpacity,
    rotation: playerRotation
  });

  // Fade trail
  for (let i = 0; i < playerTrail.length; i++) {
    playerTrail[i].alpha *= 0.85;
  }

  // Remove old trail - length increases with score!
  while (playerTrail.length > currentMaxTrail) {
    playerTrail.pop();
  }
}

function updateSpeedLines() {
  for (let i = speedLines.length - 1; i >= 0; i--) {
    const line = speedLines[i];
    line.life -= 0.05;
    line.length *= 0.95;

    if (line.life <= 0) {
      speedLines.splice(i, 1);
    }
  }
}

function updateScorePopups() {
  for (let i = scorePopups.length - 1; i >= 0; i--) {
    const popup = scorePopups[i];
    popup.y += popup.vy;
    popup.vy *= 0.95;
    popup.life -= 0.02;
    popup.scale += 0.02;

    if (popup.life <= 0) {
      scorePopups.splice(i, 1);
    }
  }
}

function updateCombo() {
  if (comboCount > 0) {
    comboTimer--;
    if (comboTimer <= 0) {
      comboCount = 0;
    }
  }
}

function updateEffects() {
  // Decay effects
  if (chromaticIntensity > 0) {
    chromaticIntensity *= 0.9;
    if (chromaticIntensity < 0.1) chromaticIntensity = 0;
  }

  if (backgroundPulse > 0) {
    backgroundPulse *= 0.95;
    if (backgroundPulse < 0.01) backgroundPulse = 0;
  }

  // Update player rotation when in air
  if (!player.isOnGround) {
    // Rotation speed increases with score! Starts slow, gets wild
    const baseRotationSpeed = 0.03; // Much slower starting rotation
    const scoreBonus = Math.min(score / SCORE_PROGRESS_TOTAL, 0.37); // Max +0.37 at high scores (more dramatic growth)
    const rotationSpeed = baseRotationSpeed + scoreBonus;

    // Rotate in the direction of movement
    if (player.velocityX > 0) {
      playerRotation += rotationSpeed;
    } else if (player.velocityX < 0) {
      playerRotation -= rotationSpeed;
    } else {
      // Slow forward rotation when no horizontal movement
      playerRotation += rotationSpeed * 0.5;
    }
  } else {
    // Smoothly return to upright when on ground
    playerRotation *= 0.8;
    if (Math.abs(playerRotation) < 0.01) playerRotation = 0;
  }
}

let platformTime = 0;

function updatePlatforms() {
  // Animate platforms moving side to side!
  platformTime += 0.02;

  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    if (platform.moveSpeed > 0) {
      // Use sine wave for smooth back-and-forth motion

      const progress = 1 + Math.min(score / SCORE_PROGRESS_TOTAL, 1.0);

      const offset = Math.sin(platformTime * platform.moveSpeed * progress) * 30;
      platform.x = platform.originalX + offset;

      // Move player with platform if standing on it
      if (player.isOnGround) {
        // Check if player is on this specific platform
        if (player.y + player.height === platform.y &&
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x) {
          player.x += offset - Math.sin((platformTime - 0.02) * platform.moveSpeed) * 30;
        }
      }
    }
  }
}

function update() {
  handleInput();
  applyPhysics();
  updatePlatforms();
  checkPlatformCollisions();
  checkCoinCollisions();
  checkBadPlatformCollisions();
  updateParticles();
  updateCoins();
  updateTrail();
  updateSpeedLines();
  updateScorePopups();
  updateCombo();
  updateEffects();
}

function drawSpeedLines() {
  for (const line of speedLines) {
    ctx.globalAlpha = line.life;
    ctx.strokeStyle = 'rgb(236, 240, 241)';
    ctx.lineWidth = line.width;
    ctx.lineCap = 'round';

    const endX = line.x + Math.cos(line.angle) * line.length;
    const endY = line.y + Math.sin(line.angle) * line.length;

    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;
}

function drawScorePopups() {
  for (const popup of scorePopups) {
    ctx.save();
    ctx.globalAlpha = popup.life;
    ctx.translate(popup.x, popup.y);
    ctx.scale(popup.scale, popup.scale);

    // Outline
    ctx.strokeStyle = 'rgb(44, 62, 80)';
    ctx.lineWidth = 3;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.strokeText(popup.text, 0, 0);

    // Fill
    ctx.fillStyle = popup.color;
    ctx.fillText(popup.text, 0, 0);

    ctx.restore();
  }
  ctx.globalAlpha = 1.0;
}

function applyChromatic() {
  if (chromaticIntensity > 0.5) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const offset = Math.floor(chromaticIntensity);

    // This creates the chromatic aberration effect by offsetting color channels
    // (simplified version - full implementation would be more complex)
    ctx.globalAlpha = 0.7;
  }
}

// Background animation variables
let backgroundStars = [];
let backgroundTime = 0;

// Initialize background stars
function initBackground() {
  for (let i = 0; i < 100; i++) {
    backgroundStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      brightness: Math.random()
    });
  }
}

function drawAnimatedBackground() {
  backgroundTime += 0.02;

  // Background color changes with score! Gets more colorful at high scores
  let bgColor = BACKGROUND_COLOR;

  if (score >= SCORE_PROGRESS_TOTAL) {
    // ULTRA RAINBOW background at very high scores!
    const hue = (score / 10 + backgroundTime * 20) % 360;
    const pulseAmount = backgroundPulse * 30;
    bgColor = `hsl(${hue}, 70%, ${15 + pulseAmount}%)`;
  } else if (score >= SCORE_PROGRESS_TOTAL * 0.75) {
    // Purple/pink tint at high scores
    const pulseAmount = backgroundPulse * 50;
    bgColor = `rgb(${30 + pulseAmount}, ${15 + pulseAmount}, ${60 + pulseAmount})`;
  } else if (score >= SCORE_PROGRESS_TOTAL * 0.5) {
    // Slight purple tint at medium scores
    const pulseAmount = backgroundPulse * 50;
    bgColor = `rgb(${20 + pulseAmount}, ${15 + pulseAmount}, ${45 + pulseAmount})`;
  } else if (backgroundPulse > 0) {
    // Just pulse on impacts
    const pulseAmount = Math.floor(backgroundPulse * 100);
    bgColor = `rgb(${15 + pulseAmount}, ${15 + pulseAmount}, ${35 + pulseAmount})`;
  }

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Animated grid pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 50;
  const gridOffset = backgroundTime * 20;

  for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x + (gridOffset % gridSize), 0);
    ctx.lineTo(x + (gridOffset % gridSize), canvas.height);
    ctx.stroke();
  }

  for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + (gridOffset % gridSize));
    ctx.lineTo(canvas.width, y + (gridOffset % gridSize));
    ctx.stroke();
  }

  // Twinkling stars
  for (const star of backgroundStars) {
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }

    const twinkle = Math.sin(backgroundTime * 3 + star.x) * 0.5 + 0.5;
    const alpha = star.brightness * twinkle * 0.6;

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Gradient overlay for depth
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function render() {
  ctx.save();

  // CONTINUOUS background shake based on score!
  const continuousShake = Math.min(score / 300, 3); // Max 3px shake at high scores
  let totalShakeX = (Math.random() - 0.5) * continuousShake;
  let totalShakeY = (Math.random() - 0.5) * continuousShake;

  // Add impact shake on top
  if (shakeAmount > 0) {
    totalShakeX += (Math.random() - 0.5) * shakeAmount;
    totalShakeY += (Math.random() - 0.5) * shakeAmount;
    shakeAmount *= shakeDecay;

    if (shakeAmount < 0.1) shakeAmount = 0;
  }

  ctx.translate(totalShakeX, totalShakeY);

  // Draw animated background
  drawAnimatedBackground();

  // Draw platforms with glow - color changes with score!
  // Starts gray and boring, gets colorful and exciting!
  let platformColor = getPlatformColor();
  let platformGlow = 2 + Math.min(score / 100, 8); // Starts at 2, grows to 10

  if (score >= SCORE_PROGRESS_TOTAL) {
    // Rainbow platforms at very high scores!
    const hue = (score / 8 + backgroundTime * 15) % 360;
    platformColor = `hsl(${hue}, 75%, 65%)`;
    platformGlow = 15;
  } else if (score >= SCORE_PROGRESS_TOTAL * 0.5) {
    // Full turquoise achieved!
    platformColor = PLATFORM_COLOR_END;
  }

  ctx.shadowBlur = platformGlow;
  ctx.shadowColor = platformColor;
  ctx.fillStyle = platformColor;
  for (const platform of platforms) {
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
  }
  ctx.shadowBlur = 0;

  drawBadPlatforms();
  drawSpeedLines();
  drawCoins();
  drawParticles();
  drawPlayer();
  drawScorePopups();

  ctx.restore();

  // Chromatic aberration (drawn outside save/restore)
  applyChromatic();

  // Draw score (no shake)
  drawScore();
}

// =============================================
// ⌨️ INPUT HANDLING
// =============================================

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  // Start music on first keypress (browsers require user interaction)
  if (!musicPlaying) {
    startBackgroundMusic();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Also try to start music on first click
window.addEventListener('click', () => {
  if (!musicPlaying) {
    startBackgroundMusic();
  }
}, { once: true });

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

initBackground();
spawnCoins();
gameLoop();
