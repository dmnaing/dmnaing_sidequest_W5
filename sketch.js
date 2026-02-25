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

let hopeLevel = 0;
const MAX_HOPE = 5;

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
  hopeLevel = 0;
}

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
  player.update(level);

  // Fall death
  if (player.y - player.r > level.deathY) {
    loadLevel(levelIndex);
    return;
  }

  // Reset cycle when reaching end
  if (player.x > level.w - 100) {
    hopeLevel = 0;
    generateEnergies();
    player.x = 50; // move player back left smoothly
  }

  cam.followSideScrollerX(player.x, level.camLerp);
  cam.y = 0;
  cam.clampToWorld(level.w, level.h);

  cam.begin();

  level.drawWorld(hopeLevel);

  drawEnergies();
  checkEnergyCollision();

  player.setEmotion(hopeLevel > 2 ? "happy" : "sad");
  player.draw(level.theme.blob);

  cam.end();

  drawHUD();
}

function checkEnergyCollision() {
  for (let e of energies) {
    if (!e.collected) {
      let d = dist(player.x, player.y, e.x, e.y);
      if (d < player.r + e.r) {
        e.collected = true;
        hopeLevel = min(MAX_HOPE, hopeLevel + 1);
      }
    }
  }
}

function drawEnergies() {
  for (let e of energies) {
    if (!e.collected) {
      fill(80, 255, 120);
      ellipse(e.x, e.y, e.r * 2);

      fill(0, 255, 120, 90);
      ellipse(e.x, e.y, e.r * 4);
    }
  }
}

function drawHUD() {
  fill(0);
  noStroke();
  text("Hope Level: " + hopeLevel + " / 5", 10, 18);
}

function keyPressed() {
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.tryJump();
  }
}
