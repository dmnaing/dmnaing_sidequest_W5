class WorldLevel {
  constructor(levelJson) {
    this.name = levelJson.name ?? "Level";

    this.theme = Object.assign(
      { bg: "#2C3442", platform: "#C8C8C8", blob: "#1478FF" },
      levelJson.theme ?? {},
    );

    this.gravity = levelJson.gravity ?? 0.65;
    this.jumpV = levelJson.jumpV ?? -11.0;
    this.camLerp = levelJson.camera?.lerp ?? 0.12;

    this.w = levelJson.world?.w ?? 2400;
    this.h = levelJson.world?.h ?? 360;
    this.deathY = levelJson.world?.deathY ?? this.h + 200;

    this.start = Object.assign({ x: 80, y: 220, r: 26 }, levelJson.start ?? {});

    this.platforms = (levelJson.platforms ?? []).map(
      (p) => new Platform(p.x, p.y, p.w, p.h),
    );

    // 🌧 Rain
    this.rain = [];
    for (let i = 0; i < 140; i++) {
      this.rain.push({
        x: random(this.w),
        y: random(this.h),
        speed: random(2, 4),
      });
    }
  }

  drawWorld(emotion = "sad") {
    // 🎨 Background reacts
    if (emotion === "happy") {
      background(60, 90, 120); // lighter blue
    } else {
      background(44, 52, 66); // darker sad tone
    }

    // Platforms
    push();
    rectMode(CORNER);
    noStroke();
    fill(this.theme.platform);
    for (const p of this.platforms) {
      rect(p.x, p.y, p.w, p.h);
    }
    pop();

    // 🌧 Rain reacts to emotion
    let rainSpeed = emotion === "happy" ? 1.2 : 3;
    let rainAlpha = emotion === "happy" ? 60 : 120;

    stroke(180, 220, 255, rainAlpha);

    for (let drop of this.rain) {
      drop.y += rainSpeed;

      if (drop.y > this.h) {
        drop.y = 0;
        drop.x = random(this.w);
      }

      line(drop.x, drop.y, drop.x, drop.y + 8);
    }

    noStroke();
  }
}
