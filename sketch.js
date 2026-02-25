/*
Week 5 — Example 5: Side-Scroller Platformer with JSON Levels + Modular Camera

Course: GBDA302 | Instructors: Dr. Karen Cochrane & David Han
Date: Feb. 12, 2026

Move: WASD/Arrows | Jump: Space

Learning goals:
- Build a side-scrolling platformer using modular game systems
- Load complete level definitions from external JSON (LevelLoader + levels.json)
- Separate responsibilities across classes (Player, Platform, Camera, World)
- Implement gravity, jumping, and collision with platforms
- Use a dedicated Camera2D class for smooth horizontal tracking
- Support multiple levels and easy tuning through data files
- Explore scalable project architecture for larger games
*/

const VIEW_W = 800;
const VIEW_H = 480;

let allLevelsData;
let levelIndex = 0;

let level;
let player;
let cam;

let emotion = "sad";
let emotionTimer = 0;
const HAPPY_DURATION = 3000;

// --- energy system ---
let energies = [];

function preload() {
  allLevelsData = loadJSON("levels.json");
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  textFont("sans-serif");
  textSize(14);

  cam = new Camera2D(width, height);
  loadLevel(levelIndex);
}

function loadLevel(i) {
  level = LevelLoader.fromLevelsJson(allLevelsData, i);

  player = new BlobPlayer();
  player.spawnFromLevel(level);

  cam.x = player.x - width / 2;
  cam.y = 0;
  cam.clampToWorld(level.w, level.h);

  generateEnergies();
}

// --- generate 1 energy per screen ---
function generateEnergies() {
  energies = [];
  const screens = Math.floor(level.w / VIEW_W);

  for (let i = 1; i <= screens; i++) {
    energies.push({
      x: i * VIEW_W - VIEW_W / 2,
      y: random(180, 300),
      r: 12,
      collected: false,
    });
  }
}

function draw() {
  // --- game state ---
  player.update(level);

  // Fall death → respawn
  if (player.y - player.r > level.deathY) {
    loadLevel(levelIndex);
    return;
  }

  // --- emotion timeout ---
  if (emotion === "happy") {
    if (millis() - emotionTimer > HAPPY_DURATION) {
      emotion = "sad";
    }
  }

  // --- view state ---
  cam.followSideScrollerX(player.x, level.camLerp);
  cam.y = 0;
  cam.clampToWorld(level.w, level.h);

  // --- draw world ---
  cam.begin();
  level.drawWorld();

  drawEnergies();
  checkEnergyCollision();

  player.setEmotion(emotion);
  player.draw(level.theme.blob);

  cam.end();

  // --- HUD ---
  fill(0);
  noStroke();
  text(level.name + " (Sad → Energy → Happy → Sad)", 10, 18);
}

function drawEnergies() {
  for (let e of energies) {
    if (!e.collected) {
      // light yellow glow
      fill(255, 240, 120);
      ellipse(e.x, e.y, e.r * 2);

      fill(255, 255, 200, 120);
      ellipse(e.x, e.y, e.r * 3);
    }
  }
}

function checkEnergyCollision() {
  for (let e of energies) {
    if (!e.collected) {
      let d = dist(player.x, player.y, e.x, e.y);
      if (d < player.r + e.r) {
        e.collected = true;
        emotion = "happy";
        emotionTimer = millis();
      }
    }
  }
}

function keyPressed() {
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.tryJump();
  }
  if (key === "r" || key === "R") loadLevel(levelIndex);
}
