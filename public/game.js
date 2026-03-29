// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
let level = 1;
let gameRunning = true;

// Player object
const player = {
  x: 50,
  y: 450,
  width: 30,
  height: 40,
  velocityY: 0,
  velocityX: 0,
  speed: 5,
  jumpPower: 12,
  isJumping: false,
  color: '#FF6B6B'
};

// Input handling
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  " ": false
};

window.addEventListener('keydown', (e) => {
  if (e.key in keys) {
    keys[e.key] = true;
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key in keys) {
    keys[e.key] = false;
  }
});

// Platform class
class Platform {
  constructor(x, y, width, height, color = '#4ECDC4') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  collidesWith(player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y + player.height >= this.y &&
      player.y + player.height <= this.y + this.height + player.velocityY &&
      player.velocityY >= 0
    );
  }
}

// Moving Platform class
class MovingPlatform {
  constructor(x, y, width, height, minX, maxX, minY, maxY, speed, color = '#FF8C42') {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.width = width;
    this.height = height;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.speed = speed;
    this.color = color;
    this.movingRight = true;
    this.movingDown = false;
  }

  update() {
    if (this.minX < this.maxX) {
      // Horizontal movement
      if (this.movingRight) {
        this.x += this.speed;
        if (this.x >= this.maxX) {
          this.x = this.maxX;
          this.movingRight = false;
        }
      } else {
        this.x -= this.speed;
        if (this.x <= this.minX) {
          this.x = this.minX;
          this.movingRight = true;
        }
      }
    }

    if (this.minY < this.maxY) {
      // Vertical movement
      if (this.movingDown) {
        this.y += this.speed;
        if (this.y >= this.maxY) {
          this.y = this.maxY;
          this.movingDown = false;
        }
      } else {
        this.y -= this.speed;
        if (this.y <= this.minY) {
          this.y = this.minY;
          this.movingDown = true;
        }
      }
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    // Draw dots to show it's moving
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x + 5, this.y + this.height / 2 - 2, 4, 4);
    ctx.fillRect(this.x + this.width - 9, this.y + this.height / 2 - 2, 4, 4);
  }

  collidesWith(player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y + player.height >= this.y &&
      player.y + player.height <= this.y + this.height + player.velocityY &&
      player.velocityY >= 0
    );
  }
}

// Barrier class (obstacles)
class Barrier {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    // Draw barrier with spikes
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = '#C0392B';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Draw spikes
    ctx.strokeStyle = '#C0392B';
    ctx.lineWidth = 1;
    for (let i = 0; i < this.width; i += 8) {
      ctx.beginPath();
      ctx.moveTo(this.x + i, this.y);
      ctx.lineTo(this.x + i + 4, this.y - 5);
      ctx.lineTo(this.x + i + 8, this.y);
      ctx.stroke();
    }
  }

  collidesWith(player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}

// Collectible class
class Collectible {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.collected = false;
  }

  draw() {
    if (!this.collected) {
      ctx.fillStyle = '#FFD93D';
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  collidesWith(player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }
}

// Game levels
const levels = [
  {
    platforms: [
      new Platform(0, 550, 800, 50, '#2C3E50'), // ground
      new Platform(150, 480, 150, 20),
      new Platform(400, 420, 150, 20),
      new Platform(100, 350, 150, 20),
      new Platform(500, 300, 150, 20),
      new Platform(250, 230, 150, 20),
      new Platform(600, 180, 150, 20)
    ],
    movingPlatforms: [
      new MovingPlatform(300, 400, 100, 20, 200, 450, 400, 400, 2, '#FF8C42')
    ],
    barriers: [
      new Barrier(450, 340, 80, 30)
    ],
    collectibles: [
      new Collectible(175, 450),
      new Collectible(425, 390),
      new Collectible(625, 150)
    ]
  },
  {
    platforms: [
      new Platform(0, 550, 800, 50, '#2C3E50'),
      new Platform(100, 480, 120, 20),
      new Platform(280, 450, 120, 20),
      new Platform(460, 420, 120, 20),
      new Platform(640, 390, 120, 20),
      new Platform(200, 330, 120, 20),
      new Platform(450, 280, 120, 20),
      new Platform(100, 200, 200, 20),
      new Platform(550, 150, 200, 20)
    ],
    movingPlatforms: [
      new MovingPlatform(300, 380, 120, 20, 150, 600, 380, 380, 3, '#9B59B6'),
      new MovingPlatform(250, 250, 100, 20, 250, 250, 150, 350, 2.5, '#1ABC9C')
    ],
    barriers: [
      new Barrier(350, 490, 70, 25),
      new Barrier(600, 310, 70, 25)
    ],
    collectibles: [
      new Collectible(110, 450),
      new Collectible(290, 420),
      new Collectible(470, 390),
      new Collectible(750, 360),
      new Collectible(210, 300),
      new Collectible(460, 250),
      new Collectible(200, 170),
      new Collectible(630, 120)
    ]
  }
];

let currentLevel = 0;
let currentPlatforms = [...levels[currentLevel].platforms];
let currentMovingPlatforms = [...levels[currentLevel].movingPlatforms];
let currentBarriers = [...levels[currentLevel].barriers];
let currentCollectibles = [...levels[currentLevel].collectibles];

// Physics
const GRAVITY = 0.6;
const GROUND_Y = 550;

// Update game state
function update() {
  // Apply gravity
  player.velocityY += GRAVITY;

  // Horizontal movement
  player.velocityX = 0;
  if (keys['ArrowLeft']) player.velocityX = -player.speed;
  if (keys['ArrowRight']) player.velocityX = player.speed;

  // Update position
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Boundary checking
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // Update moving platforms
  currentMovingPlatforms.forEach(platform => {
    platform.update();
  });

  // Platform collision
  let isOnGround = false;
  currentPlatforms.forEach(platform => {
    if (platform.collidesWith(player)) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      isOnGround = true;
      player.isJumping = false;
    }
  });

  // Moving platform collision
  currentMovingPlatforms.forEach(platform => {
    if (platform.collidesWith(player)) {
      player.y = platform.y - player.height;
      player.velocityY = 0;
      isOnGround = true;
      player.isJumping = false;
    }
  });

  // Barrier collision
  currentBarriers.forEach(barrier => {
    if (barrier.collidesWith(player)) {
      // Player dies/resets
      resetLevel();
    }
  });

  // Jump
  if (keys[' '] && isOnGround && !player.isJumping) {
    player.velocityY = -player.jumpPower;
    player.isJumping = true;
  }

  // Collectible collision
  currentCollectibles.forEach((collectible, index) => {
    if (!collectible.collected && collectible.collidesWith(player)) {
      collectible.collected = true;
      score += 10;
      document.getElementById('score').textContent = score;
    }
  });

  // Check if player fell off and level complete
  if (player.y > canvas.height) {
    resetLevel();
  }

  // Check if all collectibles collected
  if (currentCollectibles.every(c => c.collected)) {
    nextLevel();
  }
}

// Draw game
function draw() {
  // Clear canvas
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw platforms
  currentPlatforms.forEach(platform => platform.draw());

  // Draw moving platforms
  currentMovingPlatforms.forEach(platform => platform.draw());

  // Draw barriers
  currentBarriers.forEach(barrier => barrier.draw());

  // Draw collectibles
  currentCollectibles.forEach(collectible => collectible.draw());

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x, player.y, player.width, player.height);

  // Draw eyes
  ctx.fillStyle = '#000';
  ctx.fillRect(player.x + 8, player.y + 10, 5, 5);
  ctx.fillRect(player.x + 18, player.y + 10, 5, 5);
}

// Reset level
function resetLevel() {
  player.x = 50;
  player.y = 450;
  player.velocityY = 0;
  player.velocityX = 0;
  player.isJumping = false;
  score = Math.max(0, score - 5);
  document.getElementById('score').textContent = score;
}

// Next level
function nextLevel() {
  currentLevel++;
  if (currentLevel < levels.length) {
    level++;
    document.getElementById('level').textContent = level;
    currentPlatforms = levels[currentLevel].platforms.map(p => 
      new Platform(p.x, p.y, p.width, p.height, p.color)
    );
    currentMovingPlatforms = levels[currentLevel].movingPlatforms.map(p =>
      new MovingPlatform(p.x, p.y, p.width, p.height, p.minX, p.maxX, p.minY, p.maxY, p.speed, p.color)
    );
    currentBarriers = levels[currentLevel].barriers.map(b =>
      new Barrier(b.x, b.y, b.width, b.height)
    );
    currentCollectibles = levels[currentLevel].collectibles.map(c => 
      new Collectible(c.x, c.y)
    );
    player.x = 50;
    player.y = 450;
    player.velocityY = 0;
    player.velocityX = 0;
    player.isJumping = false;
  } else {
    alert(`Congratulations! You completed all ${levels.length} levels!\nFinal Score: ${score}`);
    currentLevel = 0;
    level = 1;
    score = 0;
    document.getElementById('level').textContent = level;
    document.getElementById('score').textContent = score;
    currentPlatforms = [...levels[currentLevel].platforms];
    currentMovingPlatforms = [...levels[currentLevel].movingPlatforms];
    currentBarriers = [...levels[currentLevel].barriers];
    currentCollectibles = [...levels[currentLevel].collectibles];
    player.x = 50;
    player.y = 450;
    player.velocityY = 0;
    player.velocityX = 0;
    player.isJumping = false;
  }
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
