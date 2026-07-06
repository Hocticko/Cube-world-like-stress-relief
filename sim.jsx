import { useState, useEffect, useRef, useMemo } from "react";

// ─── constants ────────────────────────────────────────────────────────────────
const SCALE = 3;
const CW = 40; // canvas width in pixels
const CH = 36; // canvas height in pixels
const GROUND = 28; // y of feet (ground surface)

// ─── pixel drawing ────────────────────────────────────────────────────────────
function dot(ctx, s, x, y, c = "#1a2a0a") {
  const px = Math.round(x);
  const py = Math.round(y);
  if (px < 0 || px >= CW || py < 0 || py >= CH) return;
  ctx.fillStyle = c;
  ctx.fillRect(px * s, py * s, s, s);
}

function drawGround(ctx, s) {
  ctx.fillStyle = "#7aaa50";
  for (let x = 0; x < CW; x++) dot(ctx, s, x, GROUND, "#7aaa50");
  for (let x = 0; x < CW; x++) dot(ctx, s, x, GROUND + 1, "#5a8a30");
  for (let x = 0; x < CW; x++) dot(ctx, s, x, GROUND + 2, "#4a7a20");
}

// ─── stickman renderer ────────────────────────────────────────────────────────
function jumpYOff(f) {
  const phase = f % 12;
  if (phase < 3) return -phase;
  if (phase < 7) return -3;
  return -(12 - phase);
}

function drawMan(ctx, s, x, y, f, action, dir = 1) {
  const flip = dir < 0;
  const fx = (ox) => (flip ? -ox : ox);
  const headYOff = action === "jump" ? jumpYOff(f) : 0;

  function body(ox, oy, c = "#1a2a0a") {
    dot(ctx, s, x + fx(ox), y + oy + headYOff, c);
  }

  // HEAD
  body(0, -12); body(1, -12); body(-1, -12);
  body(-2, -11); body(2, -11);
  body(-2, -10); body(2, -10);
  body(0, -9);  body(1, -9);  body(-1, -9);

  if (action === "idle") drawIdle(ctx, s, x, y, f, fx);
  else if (action === "walk") drawWalk(ctx, s, x, y, f, fx);
  else if (action === "run") drawRun(ctx, s, x, y, f, fx);
  else if (action === "jump") drawJump(ctx, s, x, y, f, fx);
  else if (action === "wave") drawWave(ctx, s, x, y, f, fx);
  else if (action === "sit") drawSit(ctx, s, x, y, f, fx);
  else if (action === "spin") drawSpin(ctx, s, x, y, f, fx);
  else if (action === "pushup") drawPushup(ctx, s, x, y, f, flip);
  else if (action === "dance") drawDance(ctx, s, x, y, f, fx);
  else if (action === "greet") drawGreet(ctx, s, x, y, f, fx);
  else if (action === "lift") drawLift(ctx, s, x, y, f, fx);
  else if (action === "guitar") drawGuitar(ctx, s, x, y, f, fx);
}

function torso(ctx, s, x, y) {
  for (let i = 0; i < 6; i++) dot(ctx, s, x, y - 8 + i);
}

function drawIdle(ctx, s, x, y, f, fx) {
  torso(ctx, s, x, y);
  const bob = Math.floor(f / 8) % 2 === 0 ? 0 : -1;
  dot(ctx, s, x + fx(-1), y - 7 + bob);
  dot(ctx, s, x + fx(-2), y - 5 + bob);
  dot(ctx, s, x + fx(1), y - 7 + bob);
  dot(ctx, s, x + fx(2), y - 5 + bob);
  dot(ctx, s, x + fx(-1), y - 2);
  dot(ctx, s, x + fx(-1), y - 1);
  dot(ctx, s, x + fx(-2), y);
  dot(ctx, s, x + fx(1), y - 2);
  dot(ctx, s, x + fx(1), y - 1);
  dot(ctx, s, x + fx(2), y);
}

function drawWalk(ctx, s, x, y, f, fx) {
  torso(ctx, s, x, y);
  const phase = Math.floor(f / 4) % 2;
  if (phase === 0) {
    dot(ctx, s, x + fx(-1), y - 7);
    dot(ctx, s, x + fx(-2), y - 5);
    dot(ctx, s, x + fx(1), y - 7);
    dot(ctx, s, x + fx(2), y - 6);
    dot(ctx, s, x + fx(-1), y - 2);
    dot(ctx, s, x + fx(-2), y - 1);
    dot(ctx, s, x + fx(-3), y);
    dot(ctx, s, x + fx(1), y - 2);
    dot(ctx, s, x + fx(1), y - 1);
    dot(ctx, s, x + fx(2), y);
  } else {
    dot(ctx, s, x + fx(-1), y - 7);
    dot(ctx, s, x + fx(-2), y - 6);
    dot(ctx, s, x + fx(1), y - 7);
    dot(ctx, s, x + fx(2), y - 5);
    dot(ctx, s, x + fx(-1), y - 2);
    dot(ctx, s, x + fx(-1), y - 1);
    dot(ctx, s, x + fx(-2), y);
    dot(ctx, s, x + fx(1), y - 2);
    dot(ctx, s, x + fx(2), y - 1);
    dot(ctx, s, x + fx(3), y);
  }
}

function drawRun(ctx, s, x, y, f, fx) {
  torso(ctx, s, x, y);
  const step = f % 6;
  const yOff = (step === 2 || step === 5) ? -1 : 0;
  if (step < 3) {
    dot(ctx, s, x + fx(-1), y - 8 + yOff);
    dot(ctx, s, x + fx(-3), y - 6 + yOff);
    dot(ctx, s, x + fx(1), y - 6 + yOff);
    dot(ctx, s, x + fx(3), y - 4 + yOff);
    dot(ctx, s, x + fx(-1), y - 2 + yOff);
    dot(ctx, s, x + fx(-3), y - 1 + yOff);
    dot(ctx, s, x + fx(-4), y + yOff);
    dot(ctx, s, x + fx(1), y - 2 + yOff);
    dot(ctx, s, x + fx(1), y - 1 + yOff);
    dot(ctx, s, x + fx(2), y + yOff);
  } else {
    dot(ctx, s, x + fx(-1), y - 6 + yOff);
    dot(ctx, s, x + fx(-3), y - 4 + yOff);
    dot(ctx, s, x + fx(1), y - 8 + yOff);
    dot(ctx, s, x + fx(3), y - 6 + yOff);
    dot(ctx, s, x + fx(-1), y - 2 + yOff);
    dot(ctx, s, x + fx(-1), y - 1 + yOff);
    dot(ctx, s, x + fx(-2), y + yOff);
    dot(ctx, s, x + fx(1), y - 2 + yOff);
    dot(ctx, s, x + fx(3), y - 1 + yOff);
    dot(ctx, s, x + fx(4), y + yOff);
  }
}

function drawJump(ctx, s, x, y, f, fx) {
  const yOff = jumpYOff(f);
  torso(ctx, s, x, y + yOff);
  if (yOff < -1) {
    dot(ctx, s, x + fx(-1), y - 8 + yOff);
    dot(ctx, s, x + fx(-3), y - 6 + yOff);
    dot(ctx, s, x + fx(1), y - 8 + yOff);
    dot(ctx, s, x + fx(3), y - 6 + yOff);
    dot(ctx, s, x + fx(-1), y - 1 + yOff);
    dot(ctx, s, x + fx(-3), y - 2 + yOff);
    dot(ctx, s, x + fx(1), y - 1 + yOff);
    dot(ctx, s, x + fx(3), y - 2 + yOff);
  } else {
    dot(ctx, s, x + fx(-1), y - 7 + yOff);
    dot(ctx, s, x + fx(-2), y - 5 + yOff);
    dot(ctx, s, x + fx(1), y - 7 + yOff);
    dot(ctx, s, x + fx(2), y - 5 + yOff);
    dot(ctx, s, x + fx(-1), y - 2 + yOff);
    dot(ctx, s, x + fx(-1), y - 1 + yOff);
    dot(ctx, s, x + fx(-2), y + yOff);
    dot(ctx, s, x + fx(1), y - 2 + yOff);
    dot(ctx, s, x + fx(1), y - 1 + yOff);
    dot(ctx, s, x + fx(2), y + yOff);
  }
}

function drawWave(ctx, s, x, y, f, fx) {
  torso(ctx, s, x, y);
  const up = f % 6 < 3;
  dot(ctx, s, x + fx(-1), y - 7);
  dot(ctx, s, x + fx(-2), y - 5);
  if (up) {
    dot(ctx, s, x + fx(1), y - 8);
    dot(ctx, s, x + fx(2), y - 9);
    dot(ctx, s, x + fx(3), y - 10);
  } else {
    dot(ctx, s, x + fx(1), y - 7);
    dot(ctx, s, x + fx(2), y - 8);
    dot(ctx, s, x + fx(3), y - 8);
  }
  dot(ctx, s, x + fx(-1), y - 2);
  dot(ctx, s, x + fx(-1), y - 1);
  dot(ctx, s, x + fx(-2), y);
  dot(ctx, s, x + fx(1), y - 2);
  dot(ctx, s, x + fx(1), y - 1);
  dot(ctx, s, x + fx(2), y);
}

function drawSit(ctx, s, x, y, f, fx) {
  for (let i = 0; i < 5; i++) dot(ctx, s, x, y - 4 - i);
  dot(ctx, s, x + fx(-1), y - 7);
  dot(ctx, s, x + fx(-2), y - 5);
  dot(ctx, s, x + fx(1), y - 7);
  dot(ctx, s, x + fx(2), y - 5);
  dot(ctx, s, x + fx(-1), y - 3);
  dot(ctx, s, x + fx(-2), y - 3);
  dot(ctx, s, x + fx(-3), y - 3);
  dot(ctx, s, x + fx(1), y - 3);
  dot(ctx, s, x + fx(2), y - 3);
  dot(ctx, s, x + fx(3), y - 3);
  dot(ctx, s, x + fx(-3), y - 2);
  dot(ctx, s, x + fx(3), y - 2);
}

function drawSpin(ctx, s, x, y, f, fx) {
  const phase = f % 8;
  torso(ctx, s, x, y);
  const angles = [
    [[-2,-8],[2,-8]],
    [[-3,-7],[3,-5]],
    [[-3,-5],[3,-7]],
    [[-2,-4],[2,-4]],
    [[-1,-4],[1,-4]],
    [[-3,-5],[3,-7]],
    [[-3,-7],[3,-5]],
    [[-2,-8],[2,-8]]
  ];
  const [la, ra] = angles[phase];
  dot(ctx, s, x + fx(la[0]), y + la[1]);
  dot(ctx, s, x + fx(ra[0]), y + ra[1]);
  dot(ctx, s, x + fx(-1), y - 2);
  dot(ctx, s, x + fx(-1), y - 1);
  dot(ctx, s, x + fx(-2), y);
  dot(ctx, s, x + fx(1), y - 2);
  dot(ctx, s, x + fx(1), y - 1);
  dot(ctx, s, x + fx(2), y);
}

function drawPushup(ctx, s, x, y, f, flip) {
  const down = f % 10 < 5;
  const yOff = down ? 2 : 0;
  const fd = flip ? -1 : 1;
  for (let i = -3; i <= 3; i++) dot(ctx, s, x + i, y - 2 - (down ? 0 : 2));
  dot(ctx, s, x + (fd * 4), y - 3 - yOff);
  dot(ctx, s, x - 2, y - 1 + yOff);
  dot(ctx, s, x - 2, y + yOff);
  dot(ctx, s, x + 2, y - 1 + yOff);
  dot(ctx, s, x + 2, y + yOff);
  dot(ctx, s, x - 3, y - 1);
  dot(ctx, s, x + 3, y - 1);
}

function drawDance(ctx, s, x, y, f, fx) {
  torso(ctx, s, x, y);
  const beat = f % 8;
  if (beat < 2) {
    dot(ctx, s, x + fx(-1), y - 8);
    dot(ctx, s, x + fx(-2), y - 9);
    dot(ctx, s, x + fx(1), y - 6);
    dot(ctx, s, x + fx(2), y - 5);
    dot(ctx, s, x + fx(-1), y - 2);
    dot(ctx, s, x + fx(-2), y - 1);
    dot(ctx, s, x + fx(1), y - 2);
    dot(ctx, s, x + fx(1), y - 1);
    dot(ctx, s, x + fx(2), y);
  } else if (beat < 4) {
    dot(ctx, s, x + fx(-1), y - 6);
    dot(ctx, s, x + fx(-2), y - 5);
    dot(ctx, s, x + fx(1), y - 8);
    dot(ctx, s, x + fx(2), y - 9);
    dot(ctx, s, x + fx(-1), y - 2);
    dot(ctx, s, x + fx(-1), y - 1);
    dot(ctx, s, x + fx(-2), y);
    dot(ctx, s, x + fx(1), y - 2);
    dot(ctx, s, x + fx(2), y - 1);
  } else if (beat < 6) {
    dot(ctx, s, x + fx(-1), y - 8);
    dot(ctx, s, x + fx(-3), y - 7);
    dot(ctx, s, x + fx(1), y - 8);
    dot(ctx, s, x + fx(3), y - 7);
    dot(ctx, s, x + fx(-2), y - 2);
    dot(ctx, s, x + fx(-2), y - 1);
    dot(ctx, s, x + fx(-3), y);
    dot(ctx, s, x + fx(2), y - 2);
    dot(ctx, s, x + fx(2), y - 1);
    dot(ctx, s, x + fx(3), y);
  } else {
    dot(ctx, s, x + fx(-1), y - 7);
    dot(ctx, s, x + fx(-2), y - 6);
    dot(ctx, s, x + fx(1), y - 7);
    dot(ctx, s, x + fx(2), y - 6);
    dot(ctx, s, x + fx(-1), y - 3);
    dot(ctx, s, x + fx(-2), y - 2);
    dot(ctx, s, x + fx(-1), y - 1);
    dot(ctx, s, x + fx(-2), y);
    dot(ctx, s, x + fx(1), y - 3);
    dot(ctx, s, x + fx(2), y - 2);
    dot(ctx, s, x + fx(1), y - 1);
    dot(ctx, s, x + fx(2), y);
  }
}

function drawGreet(ctx, s, x, y, f, fx) {
  torso(ctx, s, x, y);
  const bounce = f % 4 < 2 ? 0 : -1;
  dot(ctx, s, x + fx(-1), y - 7 + bounce);
  dot(ctx, s, x + fx(-2), y - 7 + bounce);
  dot(ctx, s, x + fx(-3), y - 6 + bounce);
  dot(ctx, s, x + fx(1), y - 7 + bounce);
  dot(ctx, s, x + fx(2), y - 7 + bounce);
  dot(ctx, s, x + fx(3), y - 6 + bounce);
  dot(ctx, s, x + fx(-1), y - 2);
  dot(ctx, s, x + fx(-1), y - 1);
  dot(ctx, s, x + fx(-2), y);
  dot(ctx, s, x + fx(1), y - 2);
  dot(ctx, s, x + fx(1), y - 1);
  dot(ctx, s, x + fx(2), y);
}

function drawLift(ctx, s, x, y, f, fx) {
  const effort = f % 8 < 4 ? 0 : -1;
  torso(ctx, s, x, y + effort);
  dot(ctx, s, x + fx(-1), y - 8 + effort);
  dot(ctx, s, x + fx(-2), y - 9 + effort);
  dot(ctx, s, x + fx(1), y - 8 + effort);
  dot(ctx, s, x + fx(2), y - 9 + effort);
  for (let bx = -4; bx <= 4; bx++) dot(ctx, s, x + fx(bx), y - 10 + effort, "#555");
  dot(ctx, s, x + fx(-4), y - 11 + effort, "#555");
  dot(ctx, s, x + fx(-4), y - 9 + effort, "#555");
  dot(ctx, s, x + fx(4), y - 11 + effort, "#555");
  dot(ctx, s, x + fx(4), y - 9 + effort, "#555");
  dot(ctx, s, x + fx(-1), y - 2 + effort);
  dot(ctx, s, x + fx(-2), y - 1 + effort);
  dot(ctx, s, x + fx(-2), y + effort);
  dot(ctx, s, x + fx(1), y - 2 + effort);
  dot(ctx, s, x + fx(2), y - 1 + effort);
  dot(ctx, s, x + fx(2), y + effort);
}

function drawGuitar(ctx, s, x, y, f, fx) {
  torso(ctx, s, x, y);
  dot(ctx, s, x + fx(-1), y - 7);
  dot(ctx, s, x + fx(-2), y - 7);
  dot(ctx, s, x + fx(-3), y - 6);
  const strum = f % 4;
  dot(ctx, s, x + fx(1), y - 5);
  dot(ctx, s, x + fx(2), y - 4 + strum % 2);
  for (let dy = -4; dy <= -1; dy++) {
    dot(ctx, s, x + fx(0), y + dy, "#5a3010");
    dot(ctx, s, x + fx(1), y + dy, "#5a3010");
  }
  dot(ctx, s, x + fx(-1), y - 3, "#5a3010");
  dot(ctx, s, x + fx(2), y - 3, "#5a3010");
  dot(ctx, s, x + fx(-1), y - 2, "#5a3010");
  dot(ctx, s, x + fx(2), y - 2, "#5a3010");
  dot(ctx, s, x + fx(-1), y - 1);
  dot(ctx, s, x + fx(-1), y);
  dot(ctx, s, x + fx(-2), y + 1);
  dot(ctx, s, x + fx(1), y - 1);
  dot(ctx, s, x + fx(1), y);
  dot(ctx, s, x + fx(2), y + 1);
}

// ─── emotion captions ─────────────────────────────────────────────────────────
const ACTION_CAPTIONS = {
  idle: ["chillin", "loitering", "standing"],
  walk: ["stroll", "walking", "ambling"],
  run: ["sprinting", "running", "racing"],
  jump: ["leaping", "jumping", "hopping"],
  wave: ["waving", "greeting", "hi"],
  sit: ["resting", "sitting", "chilling"],
  spin: ["spinning", "twirling", "dizzy!"],
  pushup: ["pushups", "exercising", "flexing"],
  dance: ["dancing", "grooving", "moves"],
  greet: ["hello", "greeting", "nodding"],
  lift: ["lifting", "working out", "strong!"],
  guitar: ["jamming", "strumming", "rock!"],
};

// ─── behavior system ──────────────────────────────────────────────────────────
const SOLO_BEHAVIORS = ["idle","idle","walk","walk","run","jump","wave","sit","spin","dance","lift","guitar","pushup"];
const MEET_BEHAVIORS = ["greet","dance","jump","wave"];

function randomBehavior(exclude = []) {
  const pool = SOLO_BEHAVIORS.filter(b => !exclude.includes(b));
  return pool[Math.floor(Math.random() * pool.length)];
}

const CHAR_COLORS = ["#ff5522", "#2277ff"];
const CUBE_COLORS = ["#ff5522", "#2277ff"];
const CHAR_NAMES = ["Strum", "Flex"];

function initChars() {
  return [
    { cubeIdx: 0, x: 20, dir: 1,  action: "idle", actionTimer: 60, velocity: 0, caption: "", captionTimer: 0 },
    { cubeIdx: 1, x: 20, dir: -1, action: "idle", actionTimer: 80, velocity: 0, caption: "", captionTimer: 0 },
  ];
}

export default function CubeWorld() {
  const [frame, setFrame] = useState(0);
  const [connected, setConnected] = useState(false);
  const [charSnap, setCharSnap] = useState(initChars());
  const [pressed, setPressed] = useState([false, false]);

  const stateRef = useRef({ chars: initChars(), connected: false });

  useEffect(() => {
    let raf, last = 0, f = 0;

    function tick(ts) {
      raf = requestAnimationFrame(tick);
      if (ts - last < 80) return;
      last = ts;
      f++;

      const { chars, connected } = stateRef.current;

      chars.forEach((c, i) => {
        c.actionTimer--;
        if (c.captionTimer > 0) c.captionTimer--;

        // pick new behavior
        if (c.actionTimer <= 0) {
          const next = randomBehavior([c.action]);
          c.action = next;
          c.actionTimer = 40 + Math.floor(Math.random() * 80);
          if (next === "walk" || next === "run") {
            c.dir = Math.random() < 0.5 ? 1 : -1;
            c.velocity = next === "run" ? 1.2 : 0.5;
          } else {
            c.velocity = 0;
          }
          // Set caption for new action
          const captions = ACTION_CAPTIONS[next] || ["..."];
          c.caption = captions[Math.floor(Math.random() * captions.length)];
          c.captionTimer = 60 + Math.floor(Math.random() * 60);
        }

        // movement
        if (c.action === "walk" || c.action === "run") {
          c.x += c.velocity * c.dir;

          if (connected) {
            if (c.cubeIdx === 0 && c.x > CW + 4) { c.cubeIdx = 1; c.x = -4; }
            else if (c.cubeIdx === 1 && c.x < -4) { c.cubeIdx = 0; c.x = CW + 4; }
            else if (c.x < 3  && c.cubeIdx === 0) { c.dir = 1;  c.x = 3; }
            else if (c.x > CW - 3 && c.cubeIdx === 1) { c.dir = -1; c.x = CW - 3; }
          } else {
            if (c.x < 3)      { c.dir = 1;  c.x = 3; }
            if (c.x > CW - 3) { c.dir = -1; c.x = CW - 3; }
            if (c.cubeIdx !== i) {
              c.cubeIdx = i; c.x = 20; c.action = "idle"; c.actionTimer = 30; c.velocity = 0;
            }
          }
        }

        // meeting
        const other = chars[1 - i];
        if (connected && c.cubeIdx === other.cubeIdx) {
          const dist = Math.abs(c.x - other.x);
          if (dist < 8 && c.action !== "greet" && c.action !== "dance") {
            c.action = MEET_BEHAVIORS[Math.floor(Math.random() * MEET_BEHAVIORS.length)];
            c.actionTimer = 30 + Math.floor(Math.random() * 30);
            c.velocity = 0;
            c.dir = c.x < other.x ? 1 : -1;
            const captions = ACTION_CAPTIONS[c.action] || ["..."];
            c.caption = captions[Math.floor(Math.random() * captions.length)];
            c.captionTimer = 60 + Math.floor(Math.random() * 30);
          }
        }
      });

      setFrame(f);
      setCharSnap(chars.map(c => ({ ...c })));
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function toggleConnect() {
    const next = !stateRef.current.connected;
    stateRef.current.connected = next;
    if (!next) {
      stateRef.current.chars.forEach((c, i) => {
        c.cubeIdx = i; c.x = 20; c.action = "idle"; c.actionTimer = 30; c.velocity = 0;
        c.caption = ""; c.captionTimer = 0;
      });
    }
    setConnected(next);
  }

  function handleBtn(cubeIdx) {
    setPressed(p => { const n = [...p]; n[cubeIdx] = true; return n; });
    setTimeout(() => setPressed(p => { const n = [...p]; n[cubeIdx] = false; return n; }), 300);
    stateRef.current.chars.forEach(c => {
      if (c.cubeIdx === cubeIdx) {
        c.action = ["jump","dance","spin","wave"][Math.floor(Math.random() * 4)];
        c.actionTimer = 45;
        c.velocity = 0;
        const captions = ACTION_CAPTIONS[c.action] || ["..."];
        c.caption = captions[Math.floor(Math.random() * captions.length)];
        c.captionTimer = 60;
      }
    });
  }

  const makeDraw = useMemo(() => (cubeIdx) => (ctx, s) => {
    ctx.fillStyle = "#b8c8a0";
    ctx.fillRect(0, 0, CW * s, CH * s);
    drawGround(ctx, s);
    charSnap.forEach(c => {
      if (c.cubeIdx !== cubeIdx) return;
      drawMan(ctx, s, Math.round(c.x), GROUND, frame, c.action, c.dir);
    });
  }, [frame, charSnap]);

  function PixelCanvas({ drawFn }) {
    const ref = useRef(null);
    useEffect(() => {
      const ctx = ref.current.getContext("2d");
      ctx.clearRect(0, 0, CW * SCALE, CH * SCALE);
      drawFn(ctx, SCALE);
    }, [drawFn]);
    return (
      <canvas ref={ref} width={CW * SCALE} height={CH * SCALE}
        style={{ imageRendering: "pixelated", display: "block" }} />
    );
  }

  function CaptionBubble({ text, color, visible }) {
    if (!visible || !text) return null;
    return (
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        background: color,
        color: "#000",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: "bold",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 4px rgba(0,0,0,.5)",
        zIndex: 10,
      }}>
        {text}
      </div>
    );
  }

  const cubeStyle = (color, i, conn) => ({
    border: `3px solid ${color}`,
    borderRadius: conn ? (i === 0 ? "8px 0 0 0" : "0 8px 0 0") : 8,
    background: "#1a1a1a", padding: 6,
    boxShadow: "0 0 0 2px #000, 0 4px 16px rgba(0,0,0,.6)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    userSelect: "none", transition: "border-radius .3s, border-color .3s",
  });

  const screenStyle = {
    border: "3px solid #333", borderRadius: 4, overflow: "hidden",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,.8), 0 0 0 1px #555",
  };

  const btnStyle = (active, color) => ({
    width: 18, height: 18, borderRadius: "50%",
    background: active ? color : "#444",
    border: `2px solid ${active ? color : "#222"}`,
    cursor: "pointer",
    boxShadow: active ? `0 0 8px ${color}` : "inset 0 1px 3px rgba(0,0,0,.6)",
    transition: "all .1s",
  });

  const connectorStyle = {
    width: connected ? 4 : 0,
    height: connected ? CH * SCALE * 0.6 : 0,
    background: "linear-gradient(#666,#999,#666)",
    transition: "all .3s", alignSelf: "center",
  };

  const connectBtnStyle = {
    background: "none",
    border: `1px solid ${connected ? "#9ab870" : "#444"}`,
    color: connected ? "#9ab870" : "#666",
    padding: "8px 24px", borderRadius: 4, cursor: "pointer",
    fontSize: 14, letterSpacing: 3, textTransform: "uppercase", transition: "all .2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0d0d1a 0%,#141428 60%,#0d1a2e 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Courier New', monospace", gap: 20,
    }}>
      <div style={{ color: "#9ab870", fontSize: 16, letterSpacing: 6, opacity: .6 }}>
        CUBE WORLD LIKE
      </div>

      <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
        {[0, 1].map(i => (
          <div key={i} style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <div style={cubeStyle(CUBE_COLORS[i], i, connected)} className={connected ? (i === 0 ? "cube left" : "cube right") : ""}>
              <div style={{ color: CHAR_COLORS[i], fontSize: 12, letterSpacing: 3 }}>
                {CHAR_NAMES[i].toUpperCase()}
              </div>
              <div style={screenStyle}>
                <PixelCanvas drawFn={makeDraw(i)} />
                <CaptionBubble text={charSnap[i]?.caption} color={CHAR_COLORS[i]} visible={charSnap[i]?.captionTimer > 0} />
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                <div style={btnStyle(pressed[i], CHAR_COLORS[i])} onClick={() => handleBtn(i)} />
                <div style={btnStyle(false, "#444")} />
                <div style={btnStyle(false, "#444")} />
              </div>
            </div>
            {i === 0 && <div style={connectorStyle} />}
          </div>
        ))}
      </div>

      <button onClick={toggleConnect} style={connectBtnStyle}>
        {connected ? "DISCONNECT" : "CONNECT"}
      </button>

      <div style={{ color: "#444", fontSize: 12, letterSpacing: 2, textAlign: "center", lineHeight: 1.8 }}>
        CONNECT · WATCH THEM ROAM · PRESS BUTTON TO EXCITE
      </div>
    </div>
  );
}
