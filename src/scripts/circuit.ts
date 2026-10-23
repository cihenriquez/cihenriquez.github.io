// Lays out a random PCB around the crest: traces grow out of the crest's outer pads,
// out of component footprints and out of vias, until they fill the page.
// Everything is in crest pixels (the crest artwork is 1207 px wide); the caller scales it.
import grid from './crest-grid.json';

export const CREST_WIDTH = 1207;
const CREST_HEIGHT = 1212;
export const G = 14; // grid step; the crest grid in crest-grid.json uses the same step
const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const BLOCK = 22; // components and vias are scattered one block at a time

// Every trace and shape carries `root`, the page height where its source sits, and `t`,
// the growth round it appears at. The renderer reveals them as the reader scrolls there.
export interface Trace { pts: number[]; w: number; root: number; top: number; bottom: number }
export type Shape =
  | { kind: 'ring'; x: number; y: number; r: number; w: number; t: number; root: number }
  | { kind: 'via'; x: number; y: number; t: number; root: number }
  | { kind: 'rect'; x: number; y: number; w: number; h: number; t: number; root: number }
  | { kind: 'outline'; x: number; y: number; w: number; h: number; t: number; root: number };
export interface Board { traces: Trace[]; shapes: Shape[] }

type Rand = () => number;
interface Group { rand: Rand; plan: Map<number, number> }
interface Grower {
  id: number;
  parent: number;
  x: number;
  y: number;
  dir: number;
  pref: number;
  base: number;
  run: number;
  jog: number;
  len: number;
  grace: number;
  w: number;
  at: number;
  root: number;
  rand: Rand;
  group?: Group;
  pts: number[];
}
interface Pin { i: number; j: number; dir: number; reach: number }

function random(seed: number): Rand {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (...n: number[]) => n.reduce((h, v) => Math.imul(h ^ v, 0x9e3779b1) ^ (h >>> 15), 0x811c9dc5);
const pick = <T>(rand: Rand, list: T[]) => list[Math.floor(rand() * list.length)];

const mask = Uint8Array.from(atob(grid.mask), (c) => c.charCodeAt(0));
const wrap = (d: number) => ((d % 8) + 8) % 8;
const diff = (a: number, b: number) => Math.min(wrap(a - b), wrap(b - a));
const center = (i: number) => (i + 0.5) * G;

export function circuit(width: number, height: number, seed: number): Board {
  const cols = Math.ceil(width / G);
  const rows = Math.ceil(height / G);
  const owner = new Int32Array(cols * rows);
  const parentOf: number[] = [0];
  const lenOf: number[] = [0];
  const inside = (i: number, j: number) => i >= 0 && j >= 0 && i < cols && j < rows;
  const at = (i: number, j: number) => (inside(i, j) ? owner[j * cols + i] : 0);
  const claim = (i: number, j: number, id: number) => inside(i, j) && !owner[j * cols + i] && (owner[j * cols + i] = id);

  for (let j = 0; j < Math.min(grid.rows, rows); j++)
    for (let i = 0; i < Math.min(grid.cols, cols); i++) {
      const k = j * grid.cols + i;
      if (mask[k >> 3] & (1 << (k & 7))) owner[j * cols + i] = -1;
    }

  const traces: Trace[] = [];
  const shapes: Shape[] = [];
  let active: Grower[] = [];

  const grow = (g: Omit<Grower, 'id' | 'run' | 'jog' | 'len'>) => {
    const t: Grower = { ...g, id: parentOf.length, run: 0, jog: 0, len: 0 };
    parentOf.push(t.parent);
    lenOf.push(0);
    claim(t.x, t.y, t.id);
    return t;
  };

  // Neighbours may only belong to this trace, or to its parent/child right at the fork.
  const canEnter = (t: Grower, i: number, j: number, dir: number) => {
    if (at(i, j) !== 0) return false;
    const [dx, dy] = DIRS[dir];
    if (dx && dy && at(i - dx, j) && at(i, j - dy) && at(i - dx, j) !== t.id) return false;
    if (t.grace > 0) return true;
    for (let v = -1; v <= 1; v++)
      for (let u = -1; u <= 1; u++) {
        const o = at(i + u, j + v);
        if (o === 0 || o === t.id) continue;
        if (o === t.parent && t.len < 4) continue;
        if (o > 0 && parentOf[o] === t.id && lenOf[o] < 4) continue;
        return false;
      }
    return true;
  };

  const free = (i0: number, j0: number, i1: number, j1: number) => {
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if (!inside(i, j) || at(i, j)) return false;
    return true;
  };

  const block = (i0: number, j0: number, i1: number, j1: number) => {
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) claim(i, j, -1);
  };

  const finish = (t: Grower, end: 'pad' | 'via' | 'edge') => {
    t.pts.push(center(t.x), center(t.y), t.at);
    const ys = t.pts.filter((_, k) => k % 3 === 1);
    traces.push({ pts: t.pts, w: t.w, root: t.root, top: Math.min(...ys), bottom: Math.max(...ys) });
    if (end === 'edge') return;
    if (end === 'via') {
      shapes.push({ kind: 'via', x: center(t.x), y: center(t.y), t: t.at, root: t.root });
      block(t.x - 1, t.y - 1, t.x + 1, t.y + 1);
      return;
    }
    const big = roomFor(t);
    const r = big ? 2 : 1;
    shapes.push({ kind: 'ring', x: center(t.x), y: center(t.y), r: big ? 16 : 11, w: t.w, t: t.at, root: t.root });
    block(t.x - r, t.y - r, t.x + r, t.y + r);
  };
  const roomFor = (t: Grower) => {
    for (let v = -2; v <= 2; v++)
      for (let u = -2; u <= 2; u++) {
        const o = at(t.x + u, t.y + v);
        if (o !== 0 && o !== t.id) return false;
      }
    return true;
  };

  // Outer pads of the crest.
  grid.seeds.forEach(([px, py, pr], n) => {
    const a = Math.atan2(py - CREST_HEIGHT / 2, px - CREST_WIDTH / 2);
    const dir = wrap(Math.round(a / (Math.PI / 4)));
    const w = pr > 10 ? 9 : 6;
    const ring = pr + w / 2;
    for (let s = 1; s < 4; s++) {
      const i = Math.floor((px + Math.cos(a) * (ring + s * G)) / G);
      const j = Math.floor((py + Math.sin(a) * (ring + s * G)) / G);
      if (!inside(i, j) || at(i, j)) continue;
      const pts = [px + Math.cos(a) * ring, py + Math.sin(a) * ring, 0, center(i), center(j), 1];
      active.push(grow({ parent: 0, x: i, y: j, dir, pref: dir, base: dir, grace: 2, w, at: 1, root: py, rand: random(hash(seed, n)), pts }));
      break;
    }
  });

  // Footprints, as pads around (0, 0) in grid cells, before rotation.
  type Part = { pads: [number, number, number, number, number][]; pins: Pin[]; body?: number[]; buses: number[][] };
  const parts: ((rand: Rand) => Part)[] = [
    (rand) => {
      // 0805-style resistor or capacitor
      const side = rand() < 0.5;
      return {
        pads: [[0, 0, 1.6, 1.9, 0], [3, 0, 1.6, 1.9, 0]],
        pins: [{ i: 0, j: 0, dir: side ? 6 : 4, reach: 2 }, { i: 3, j: 0, dir: side ? 2 : 0, reach: 2 }],
        buses: [],
      };
    },
    () => ({
      // SOT-23
      pads: [[1, 0, 1.2, 1.6, 0], [0, 3, 1.2, 1.6, 0], [2, 3, 1.2, 1.6, 0]],
      pins: [{ i: 1, j: 0, dir: 6, reach: 2 }, { i: 0, j: 3, dir: 2, reach: 2 }, { i: 2, j: 3, dir: 2, reach: 2 }],
      body: [-0.6, 0.9, 2.6, 2.1],
      buses: [[1, 2]],
    }),
    (rand) => {
      // SOIC
      const n = 4 + Math.floor(rand() * 4);
      const pads: Part['pads'] = [];
      const pins: Pin[] = [];
      for (let k = 0; k < n; k++) {
        pads.push([2 * k, 0, 1.1, 2.3, 0], [2 * k, 5, 1.1, 2.3, 0]);
        pins.push({ i: 2 * k, j: 0, dir: 6, reach: 2 }, { i: 2 * k, j: 5, dir: 2, reach: 2 });
      }
      const top = pins.map((_, k) => k).filter((k) => k % 2 === 0);
      return { pads, pins, body: [-1, 1.4, 2 * n - 1, 3.6], buses: [top, top.map((k) => k + 1)] };
    },
    (rand) => {
      // QFN
      const n = 3 + Math.floor(rand() * 2);
      const s = 2 * n + 2;
      const pads: Part['pads'] = [];
      const pins: Pin[] = [];
      const buses: number[][] = [[], [], [], []];
      for (let k = 0; k < n; k++) {
        const c = 2 + 2 * k;
        for (const [i, j, dir, w, h, b] of [[c, 0, 6, 1, 2, 0], [s, c, 0, 2, 1, 1], [c, s, 2, 1, 2, 2], [0, c, 4, 2, 1, 3]]) {
          buses[b].push(pins.length);
          pads.push([i, j, w, h, 0]);
          pins.push({ i, j, dir, reach: 2 });
        }
      }
      pads.push([s / 2, s / 2, s - 3.5, s - 3.5, 0]);
      return { pads, pins, body: [0.9, 0.9, s - 0.9, s - 0.9], buses };
    },
    (rand) => {
      // pin header
      const n = 3 + Math.floor(rand() * 4);
      const pads: Part['pads'] = [];
      const pins: Pin[] = [];
      for (let k = 0; k < n; k++) {
        pads.push([2 * k, 0, 0.75, 0, 1]);
        pins.push({ i: 2 * k, j: 0, dir: rand() < 0.5 ? 2 : 6, reach: 2 });
      }
      return { pads, pins, body: [-1, -1, 2 * n - 1, 1], buses: [] };
    },
  ];

  const place = (rand: Rand, i0: number, j0: number, key: number) => {
    const part = pick(rand, parts)(rand);
    const turn = Math.floor(rand() * 4);
    const rot = (i: number, j: number): [number, number] => {
      for (let k = 0; k < turn; k++) [i, j] = [-j, i];
      return [i, j];
    };
    const cells = part.pads.map(([i, j]) => rot(i, j));
    const starts = part.pins.map((p) => rot(p.i + DIRS[p.dir][0] * p.reach, p.j + DIRS[p.dir][1] * p.reach));
    const all = [...cells, ...starts];
    const lo = [Math.min(...all.map((c) => c[0])), Math.min(...all.map((c) => c[1]))];
    const hi = [Math.max(...all.map((c) => c[0])), Math.max(...all.map((c) => c[1]))];
    const ox = i0 - lo[0];
    const oy = j0 - lo[1];
    if (!free(ox + lo[0] - 3, oy + lo[1] - 3, ox + hi[0] + 3, oy + hi[1] + 3)) return;

    const root = center(oy + (lo[1] + hi[1]) / 2);
    for (const [k, [i, j]] of cells.entries()) {
      const [, , w, h, round] = part.pads[k];
      const [pw, ph] = turn % 2 ? [h, w] : [w, h];
      if (round) shapes.push({ kind: 'ring', x: center(ox + i), y: center(oy + j), r: w * G, w: 7, t: 0, root });
      else shapes.push({ kind: 'rect', x: center(ox + i) - (pw * G) / 2, y: center(oy + j) - (ph * G) / 2, w: pw * G, h: ph * G, t: 0, root });
    }
    if (part.body) {
      const [a, b] = rot(part.body[0], part.body[1]);
      const [c, d] = rot(part.body[2], part.body[3]);
      const x = (ox + Math.min(a, c) + 0.5) * G;
      const y = (oy + Math.min(b, d) + 0.5) * G;
      shapes.push({ kind: 'outline', x, y, w: Math.abs(c - a) * G, h: Math.abs(d - b) * G, t: 0, root });
    }
    block(ox + lo[0] - 1, oy + lo[1] - 1, ox + hi[0] + 1, oy + hi[1] + 1);
    for (const [i, j] of starts) owner[(oy + j) * cols + ox + i] = 0;

    const groups = part.buses.map((): Group => ({ rand: random(hash(seed, key, 7)), plan: new Map() }));
    const w = rand() < 0.3 ? 9 : 6;
    part.pins.forEach((p, k) => {
      if (rand() < 0.2) return;
      const [pi, pj] = rot(p.i, p.j);
      const [si, sj] = starts[k];
      const dir = wrap(p.dir + 2 * turn);
      const group = groups[part.buses.findIndex((b) => b.includes(k))];
      const pts = [center(ox + pi), center(oy + pj), 0, center(ox + si), center(oy + sj), 1];
      active.push(grow({ parent: 0, x: ox + si, y: oy + sj, dir, pref: dir, base: dir, grace: 1, w, at: 1, root, rand: random(hash(seed, key, k)), group, pts }));
    });
  };

  const via = (rand: Rand, i: number, j: number, key: number) => {
    if (!free(i - 3, j - 3, i + 3, j + 3)) return;
    const root = center(j);
    shapes.push({ kind: 'via', x: center(i), y: center(j), t: 0, root });
    claim(i, j, -1);
    const first = Math.floor(rand() * 8);
    const count = 1 + Math.floor(rand() * 3);
    for (let k = 0; k < count; k++) {
      const dir = wrap(first + k * (2 + Math.floor(rand() * 2)));
      const pts = [center(i), center(j), 0, center(i + DIRS[dir][0]), center(j + DIRS[dir][1]), 1];
      active.push(grow({ parent: 0, x: i + DIRS[dir][0], y: j + DIRS[dir][1], dir, pref: dir, base: dir, grace: 1, w: 6, at: 1, root, rand: random(hash(seed, key, k)), pts }));
    }
  };

  for (let bj = 0; bj * BLOCK < rows; bj++)
    for (let bi = 0; bi * BLOCK < cols; bi++) {
      const key = hash(seed, bi, bj);
      const rand = random(key);
      const spot = () => [bi * BLOCK + Math.floor(rand() * BLOCK), bj * BLOCK + Math.floor(rand() * BLOCK)];
      if (rand() < 0.55) {
        const [i, j] = spot();
        place(rand, i, j, key);
      }
      for (let n = rand() < 0.5 ? 1 : 2; n > 0; n--) {
        const [i, j] = spot();
        via(rand, i, j, key + n);
      }
    }

  // Turns: 45-degree jogs that come back, or 90-degree turns cut with a 45-degree chamfer.
  const decide = (rand: Rand) => {
    const r = rand();
    if (r < 0.05) return r < 0.025 ? 1 : -1;
    if (r < 0.09) return r < 0.07 ? 2 : -2;
    return 0;
  };

  for (let round = 1; active.length; round++) {
    const next: Grower[] = [];
    for (const t of active) {
      const { dir: d, pref: p, rand } = t;
      const order: number[] = [];
      if (d !== p && t.run >= t.jog) order.push(p);
      else if (d === p && t.run >= 3) {
        let turn = 0;
        if (t.group) {
          if (!t.group.plan.has(round)) t.group.plan.set(round, decide(t.group.rand));
          turn = t.group.plan.get(round)!;
        } else turn = decide(rand);
        if (Math.abs(turn) === 1) {
          order.push(wrap(p + turn));
          t.jog = 1 + Math.floor(rand() * 4);
        } else if (turn && diff(p + turn, t.base) <= 2) {
          order.push(wrap(p + turn / 2));
          t.pref = wrap(p + turn);
          t.jog = 1 + Math.floor(rand() * 2);
        }
      }
      order.push(d);
      for (const c of rand() < 0.5 ? [p, p + 1, p - 1] : [p, p - 1, p + 1]) if (!order.includes(wrap(c))) order.push(wrap(c));

      let moved = false;
      for (const c of order) {
        const i = t.x + DIRS[c][0];
        const j = t.y + DIRS[c][1];
        if (!inside(i, j)) {
          if (c !== t.dir) t.pts.push(center(t.x), center(t.y), t.at);
          t.x = i;
          t.y = j;
          t.at = round;
          finish(t, 'edge');
          moved = true;
          break;
        }
        if (!canEnter(t, i, j, c)) continue;
        if (c !== t.dir) {
          t.pts.push(center(t.x), center(t.y), t.at);
          t.run = 0;
        }
        t.dir = c;
        t.run++;
        t.x = i;
        t.y = j;
        t.at = round;
        t.len++;
        t.grace--;
        lenOf[t.id] = t.len;
        owner[j * cols + i] = t.id;
        moved = true;
        break;
      }
      if (!moved) {
        finish(t, rand() < 0.3 ? 'via' : 'pad');
        continue;
      }
      if (!inside(t.x, t.y)) continue;
      if (t.len > 6 && rand() < 0.014) {
        finish(t, rand() < 0.35 ? 'via' : 'pad');
        continue;
      }
      if (t.len >= 3 && rand() < (t.group ? 0.015 : 0.05)) {
        const b = wrap(t.dir + (rand() < 0.5 ? 1 : -1));
        const i = t.x + DIRS[b][0];
        const j = t.y + DIRS[b][1];
        if (diff(b, t.base) <= 2 && inside(i, j) && at(i, j) === 0) {
          const pts = [center(t.x), center(t.y), t.at];
          next.push(grow({ parent: t.id, x: t.x, y: t.y, dir: b, pref: b, base: t.base, grace: 0, w: t.w, at: t.at, root: t.root, rand: random(Math.floor(rand() * 2 ** 32)), pts }));
        }
      }
      next.push(t);
    }
    active = next;
  }

  return { traces, shapes };
}
