/**
 * Matrix: a 3 × 3 decision matrix of nine items across three strategic zones.
 * Hovering an item lifts it and aligns it with its priority group.
 * The slider drives the stagger delay, in ms.
 *
 * Rules: 1 (static hit test), 2 (stagger by distance), 5 (designed rest),
 * 8 (tweens & springs), 9 (rounded solids), 10 (no text inside).
 */
const {
  Cam, clamp, facing, fit, poly, open, proj, rings, rrect, run,
  tval, tween, tset, tdone, disposer, mk, pointer, put, register, solid, prism,
} = HL;

const N = 9, W = 22, H = 10;
const X0 = -10, X1 = 160, Y0 = -10, Y1 = 110, WR = 9, WT = 2.2, PB = 5;

// Rest positions for 9 scattered items [x, y, zone]
const ITEMS = [
  { id: 0, z: 0, rx: 12, ry: 14, ax: 16, ay: 16 },
  { id: 1, z: 0, rx: 28, ry: 48, ax: 16, ay: 46 },
  { id: 2, z: 0, rx: 10, ry: 78, ax: 16, ay: 76 },
  { id: 3, z: 1, rx: 66, ry: 18, ax: 68, ay: 16 },
  { id: 4, z: 1, rx: 58, ry: 52, ax: 68, ay: 46 },
  { id: 5, z: 1, rx: 70, ry: 80, ax: 68, ay: 76 },
  { id: 6, z: 2, rx: 122, ry: 16, ax: 120, ay: 16 },
  { id: 7, z: 2, rx: 114, ry: 50, ax: 120, ay: 46 },
  { id: 8, z: 2, rx: 126, ry: 82, ax: 120, ay: 76 },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  const C = Cam(45, 0.5, 1.6);
  fit(C, [[X0, Y0, -PB], [X1, Y1, -PB], [X1, Y0, -PB], [X0, Y1, -PB], [X0, Y0, H + 20], [X1, Y1, H + 20]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);

  // Draw plinth base
  const [pr, pi] = rings(X0, Y0, X1, Y1, WR, WT);
  put(solid(g), prism(P, front, pr, pi, -PB, 0));

  // Subtle zone division creases painted along the board ground
  const col1Line = open([P(50, Y0 + 4, 0.2), P(50, Y1 - 4, 0.2)]);
  const col2Line = open([P(102, Y0 + 4, 0.2), P(102, Y1 - 4, 0.2)]);
  mk("path", { d: col1Line, class: "nf lo" }, g);
  mk("path", { d: col2Line, class: "nf lo" }, g);

  // Items ordered by ascending (x + y) for back-to-front rendering
  const sorted = ITEMS.slice().sort((a, b) => (a.rx + a.ry) - (b.rx + b.ry));
  const blocks = sorted.map((it) => {
    const el = solid(g);
    return {
      ...it,
      el,
      tx: tween(it.rx),
      ty: tween(it.ry),
      tz: tween(0),
    };
  });

  function hit([sx, sy]) {
    // Distance-based hit test onto rest item positions
    let best = -1, minDist = 40;
    blocks.forEach((b, idx) => {
      const sp = P(b.rx + W / 2, b.ry + W / 2, 0);
      const dist = Math.hypot(sx - sp[0], sy - sp[1]);
      if (dist < minDist) {
        minDist = dist;
        best = idx;
      }
    });
    return best;
  }

  function drawBlock(b, x, y, z) {
    const [ring, inner] = rings(x, y, x + W, y + W, 3.2, 1.1);
    put(b.el, prism(P, front, ring, inner, z, z + H));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    blocks.forEach((b) => {
      const curX = tval(b.tx, now), curY = tval(b.ty, now), curZ = tval(b.tz, now);
      drawBlock(b, curX, curY, curZ);
      if (!tdone(b.tx, now) || !tdone(b.ty, now) || !tdone(b.tz, now)) {
        moving = true;
      }
    });
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;

  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    const from = a >= 0 ? a : (act >= 0 ? act : 4);
    act = a;

    blocks.forEach((b, i) => {
      const dist = Math.abs(i - from);
      const delay = dist * stag;

      if (a < 0) {
        // Rest pose
        tset(b.tx, b.rx, now, delay);
        tset(b.ty, b.ry, now, delay);
        tset(b.tz, 0, now, delay);
        b.el.sil.classList.toggle("hi", i === 4);
      } else {
        // Active pose
        const sameZone = blocks[a].z === b.z;
        const targetX = sameZone ? b.ax : b.rx;
        const targetY = sameZone ? b.ay : b.ry;
        const targetZ = i === a ? 16 : (sameZone ? 8 : 0);

        tset(b.tx, targetX, now, delay);
        tset(b.ty, targetY, now, delay);
        tset(b.tz, targetZ, now, delay);
        b.el.sil.classList.toggle("hi", i === a);
      }
    });

    if (a >= 0) {
      const zoneNames = ["input", "focus", "execute"];
      read.textContent = `${zoneNames[blocks[a].z]} 0${(a % 3) + 1}`;
    } else {
      read.textContent = "rest";
    }

    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => setActive(hit(p)),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "matrix",
  means: "A decision matrix of nine items: hovering an item lifts it and aligns it with its priority group.",
  rules: [1, 2, 5, 8, 9, 10],
  range: [0, 40, 90],
  mount,
});
