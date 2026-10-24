// Lays out a random PCB around the crest: traces grow out of the crest's outer pads,
// out of component footprints and out of vias, until they fill the page.
// Everything is in crest pixels (the crest artwork is 1207 px wide); the caller scales it.
import grid from './crest-grid.json';

export const CREST_WIDTH = 1207;
const CREST_HEIGHT = 1212;
export const G = 14; // grid step; the crest grid in crest-grid.json uses the same step
const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const BLOCK = 22; // components and vias are scattered one block at a time
const MIN_RUN = 3; // cells a trace keeps its heading before it may turn again

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
  pts: number[]; // where the trace starts, as x, y, round triples
  cells: number[]; // every cell it has stepped into since, as i, j, round triples
  forks: number[]; // cells.length and child id of each branch; it can't back up past a live one
  end?: 'pad' | 'via' | 'edge';
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

  const grow = (g: Omit<Grower, 'id' | 'run' | 'jog' | 'len' | 'cells' | 'forks'>) => {
    const t: Grower = { ...g, id: parentOf.length, run: 0, jog: MIN_RUN, len: 0, cells: [], forks: [] };
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

  const room = (t: Grower, r: number) => {
    for (let v = -r; v <= r; v++)
      for (let u = -r; u <= r; u++) {
        const o = at(t.x + u, t.y + v);
        if (o !== 0 && o !== t.id) return false;
      }
    return true;
  };

  // True when the trace's last straight stretch is a single cell after a turn.
  const shortTail = (t: Grower) => {
    const c = t.cells;
    const n = c.length;
    if (n < 6) return false;
    const pi = n >= 9 ? c[n - 9] : Math.round(t.pts[t.pts.length - 3] / G - 0.5);
    const pj = n >= 9 ? c[n - 8] : Math.round(t.pts[t.pts.length - 2] / G - 0.5);
    return c[n - 3] - c[n - 6] !== c[n - 6] - pi || c[n - 2] - c[n - 5] !== c[n - 5] - pj;
  };

  const ended: Grower[] = [];
  // Components and vias, kept only if at least one of their traces survives.
  const sources: { shapes: Shape[]; ids: number[]; links?: Trace[] }[] = [];
  const alive = new Set<number>();
  const finish = (t: Grower, end: 'pad' | 'via' | 'edge') => {
    t.end = end;
    ended.push(t);
  };

  // Every trace ends in a pad or a via, at a fork, or off the page. When there is no room for
  // the pad, the trace backs up along its own path until there is; if it can't, it ends at its
  // last fork, or disappears if it never forked. Branches are settled before their parents, so
  // a fork only counts if its branch survived.
  const settle = (t: Grower) => {
    let end = t.end!;
    let fork = 0;
    for (let k = 0; k < t.forks.length; k += 2) if (alive.has(t.forks[k + 1])) fork = t.forks[k];
    if (end !== 'edge') {
      while ((!room(t, 1) || shortTail(t)) && t.cells.length > fork) {
        const n = t.cells.length;
        owner[t.cells[n - 2] * cols + t.cells[n - 3]] = 0;
        t.cells.length = n - 3;
        const k = t.cells.length ? t.cells.length - 3 : -1;
        t.x = k < 0 ? Math.round(t.pts[t.pts.length - 3] / G - 0.5) : t.cells[k];
        t.y = k < 0 ? Math.round(t.pts[t.pts.length - 2] / G - 0.5) : t.cells[k + 1];
        t.at = k < 0 ? t.pts[t.pts.length - 1] : t.cells[k + 2];
      }
      if (!room(t, 1)) {
        if (!fork) {
          if (at(t.x, t.y) === t.id) owner[t.y * cols + t.x] = 0;
          return;
        }
        end = 'edge';
      }
    }
    alive.add(t.id);

    const all = [...t.pts];
    for (let k = 0; k < t.cells.length; k += 3) all.push(center(t.cells[k]), center(t.cells[k + 1]), t.cells[k + 2]);
    const pts = all.slice(0, 3);
    for (let k = 3; k < all.length - 3; k += 3) {
      const [ax, ay] = [all[k] - all[k - 3], all[k + 1] - all[k - 2]];
      const [bx, by] = [all[k + 3] - all[k], all[k + 4] - all[k + 1]];
      if (ax * by !== ay * bx || ax * bx + ay * by <= 0) pts.push(all[k], all[k + 1], all[k + 2]);
    }
    if (all.length > 3) pts.push(...all.slice(-3));
    const ys = pts.filter((_, k) => k % 3 === 1);
    traces.push({ pts, w: t.w, root: t.root, top: Math.min(...ys), bottom: Math.max(...ys) });
    if (end === 'edge') return;
    if (end === 'via') {
      shapes.push({ kind: 'via', x: center(t.x), y: center(t.y), t: t.at, root: t.root });
      block(t.x - 1, t.y - 1, t.x + 1, t.y + 1);
      return;
    }
    const r = room(t, 2) ? 2 : 1;
    shapes.push({ kind: 'ring', x: center(t.x), y: center(t.y), r: r === 2 ? 16 : 11, w: t.w, t: t.at, root: t.root });
    block(t.x - r, t.y - r, t.x + r, t.y + r);
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
  // links: short traces drawn with the part (cell-coordinate polylines); tied: pins they take over,
  // which then grow no trace of their own.
  type Part = { pads: [number, number, number, number, number][]; pins: Pin[]; body?: number[]; buses: number[][]; links?: number[][]; tied?: number[] };
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
      // decoupling capacitors: two tied to the corner pins, one spare on the other row
      const r = 2 * n;
      pads.push([-4, 0, 1, 1.2, 0], [-2, 0, 1, 1.2, 0], [-4, 5, 1, 1.2, 0], [-2, 5, 1, 1.2, 0], [r, 5, 1, 1.2, 0], [r + 2, 5, 1, 1.2, 0]);
      const links = [[0, 0, -2, 0], [r - 2, 5, r, 5]];
      const tied = [0, 2 * n - 1];
      const top = pins.map((_, k) => k).filter((k) => k % 2 === 0);
      return { pads, pins, body: [-1, 1.4, 2 * n - 1, 3.6], buses: [top, top.map((k) => k + 1)], links, tied };
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
      // decoupling capacitors off three corners, outside the rows where the traces start; the two
      // top ones are tied to the nearest top pins with a chamfered stub
      pads.push([-3, -1, 1, 1.2, 0], [-1, -1, 1, 1.2, 0], [s + 1, -1, 1, 1.2, 0], [s + 3, -1, 1, 1.2, 0], [-3, s + 1, 1, 1.2, 0], [-1, s + 1, 1, 1.2, 0]);
      const links = [[2, 0, 1, -1, -1, -1], [s - 2, 0, s - 1, -1, s + 1, -1]];
      return { pads, pins, body: [0.9, 0.9, s - 0.9, s - 0.9], buses, links, tied: [0, 4 * (n - 1)] };
    },
    (rand) => {
      // DIP: through-hole pads in two rows, notch at the pin-1 end
      const n = 4 + Math.floor(rand() * 4);
      const pads: Part['pads'] = [];
      const pins: Pin[] = [];
      for (let k = 0; k < n; k++) {
        pads.push([2 * k, 0, 0.75, 0, 1], [2 * k, 6, 0.75, 0, 1]);
        pins.push({ i: 2 * k, j: 0, dir: 6, reach: 2 }, { i: 2 * k, j: 6, dir: 2, reach: 2 });
      }
      pads.push([-0.6, 3, 0.3, 0, 1]);
      const r = 2 * n;
      pads.push([-4, 0, 1, 1.2, 0], [-2, 0, 1, 1.2, 0], [-4, 6, 1, 1.2, 0], [-2, 6, 1, 1.2, 0], [r, 6, 1, 1.2, 0], [r + 2, 6, 1, 1.2, 0]);
      const top = pins.map((_, k) => k).filter((k) => k % 2 === 0);
      return { pads, pins, body: [-1, 1.3, 2 * n - 1, 4.7], buses: [top, top.map((k) => k + 1)], links: [[0, 0, -2, 0], [r - 2, 6, r, 6]], tied: [0, 2 * n - 1] };
    },
    (rand) => {
      // TQFP: gull-wing leads on four sides reaching past a smaller body, pin-1 dot, no centre pad
      const n = 4 + Math.floor(rand() * 2);
      const s = 2 * n + 2;
      const pads: Part['pads'] = [];
      const pins: Pin[] = [];
      const buses: number[][] = [[], [], [], []];
      for (let k = 0; k < n; k++) {
        const c = 2 + 2 * k;
        for (const [i, j, dir, w, h, b] of [[c, 0, 6, 0.9, 2.6, 0], [s, c, 0, 2.6, 0.9, 1], [c, s, 2, 0.9, 2.6, 2], [0, c, 4, 2.6, 0.9, 3]]) {
          buses[b].push(pins.length);
          pads.push([i, j, w, h, 0]);
          pins.push({ i, j, dir, reach: 2 });
        }
      }
      pads.push([2.6, 2.6, 0.3, 0, 1]);
      pads.push([-3, -1, 1, 1.2, 0], [-1, -1, 1, 1.2, 0], [s + 1, -1, 1, 1.2, 0], [s + 3, -1, 1, 1.2, 0], [-3, s + 1, 1, 1.2, 0], [-1, s + 1, 1, 1.2, 0]);
      const links = [[2, 0, 1, -1, -1, -1], [s - 2, 0, s - 1, -1, s + 1, -1]];
      return { pads, pins, body: [1.4, 1.4, s - 1.4, s - 1.4], buses, links, tied: [0, 4 * (n - 1)] };
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
    const source = { shapes: [] as Shape[], ids: [] as number[] };
    sources.push(source);
    for (const [k, [i, j]] of cells.entries()) {
      const [, , w, h, round] = part.pads[k];
      const [pw, ph] = turn % 2 ? [h, w] : [w, h];
      if (round) source.shapes.push({ kind: 'ring', x: center(ox + i), y: center(oy + j), r: w * G, w: 7, t: 0, root });
      else source.shapes.push({ kind: 'rect', x: center(ox + i) - (pw * G) / 2, y: center(oy + j) - (ph * G) / 2, w: pw * G, h: ph * G, t: 0, root });
    }
    if (part.body) {
      const [a, b] = rot(part.body[0], part.body[1]);
      const [c, d] = rot(part.body[2], part.body[3]);
      const x = (ox + Math.min(a, c) + 0.5) * G;
      const y = (oy + Math.min(b, d) + 0.5) * G;
      source.shapes.push({ kind: 'outline', x, y, w: Math.abs(c - a) * G, h: Math.abs(d - b) * G, t: 0, root });
    }
    for (const line of part.links ?? []) {
      const pts: number[] = [];
      for (let k = 0; k < line.length; k += 2) {
        const [i, j] = rot(line[k], line[k + 1]);
        pts.push(center(ox + i), center(oy + j), 0);
      }
      const ys = pts.filter((_, k) => k % 3 === 1);
      (source.links ??= []).push({ pts, w: 6, root, top: Math.min(...ys), bottom: Math.max(...ys) });
    }
    const [pl, pt] = [Math.min(...cells.map((c) => c[0])), Math.min(...cells.map((c) => c[1]))];
    const [pr, pb] = [Math.max(...cells.map((c) => c[0])), Math.max(...cells.map((c) => c[1]))];
    block(ox + pl - 1, oy + pt - 1, ox + pr + 1, oy + pb + 1);

    const groups = part.buses.map((): Group => ({ rand: random(hash(seed, key, 7)), plan: new Map() }));
    const w = rand() < 0.3 ? 9 : 6;
    part.pins.forEach((p, k) => {
      if (rand() < 0.2 || part.tied?.includes(k)) return;
      const [pi, pj] = rot(p.i, p.j);
      const [si, sj] = starts[k];
      const dir = wrap(p.dir + 2 * turn);
      const group = groups[part.buses.findIndex((b) => b.includes(k))];
      const pts = [center(ox + pi), center(oy + pj), 0, center(ox + si), center(oy + sj), 1];
      const t = grow({ parent: 0, x: ox + si, y: oy + sj, dir, pref: dir, base: dir, grace: 1, w, at: 1, root, rand: random(hash(seed, key, k)), group, pts });
      source.ids.push(t.id);
      active.push(t);
    });
  };

  const via = (rand: Rand, i: number, j: number, key: number) => {
    if (!free(i - 3, j - 3, i + 3, j + 3)) return;
    const root = center(j);
    const source = { shapes: [{ kind: 'via', x: center(i), y: center(j), t: 0, root }] as Shape[], ids: [] as number[] };
    sources.push(source);
    block(i - 1, j - 1, i + 1, j + 1);
    // One trace per via, so a via never sits in the middle of a trace or a junction.
    const dir = Math.floor(rand() * 8);
    owner[(j + DIRS[dir][1]) * cols + i + DIRS[dir][0]] = 0;
    const pts = [center(i), center(j), 0, center(i + DIRS[dir][0]), center(j + DIRS[dir][1]), 1];
    const t = grow({ parent: 0, x: i + DIRS[dir][0], y: j + DIRS[dir][1], dir, pref: dir, base: dir, grace: 1, w: 6, at: 1, root, rand: random(hash(seed, key)), pts });
    source.ids.push(t.id);
    active.push(t);
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

  // Turns: 45-degree jogs that come back (±1), 90-degree turns cut with a 45-degree chamfer (±2),
  // and diagonal runs straightening out after a few cells (±4).
  const decide = (rand: Rand, diagonal: boolean) => {
    const r = rand();
    if (diagonal) return r < 0.35 ? (r < 0.175 ? 4 : -4) : 0;
    if (r < 0.08) return r < 0.04 ? 1 : -1;
    if (r < 0.16) return r < 0.12 ? 2 : -2;
    return 0;
  };

  for (let round = 1; active.length; round++) {
    const next: Grower[] = [];
    for (const t of active) {
      const { dir: d, pref: p, rand } = t;
      const order: number[] = [];
      if (d !== p && t.run >= t.jog) order.push(p);
      else if (d === p && t.run >= MIN_RUN) {
        let turn = 0;
        if (t.group) {
          if (!t.group.plan.has(round)) t.group.plan.set(round, decide(t.group.rand, p % 2 === 1));
          turn = t.group.plan.get(round)!;
        } else turn = decide(rand, p % 2 === 1);
        if (Math.abs(turn) === 4) {
          const side = diff(p + turn / 4, t.base) <= 2 ? turn / 4 : -turn / 4;
          t.pref = wrap(p + side);
          order.push(t.pref);
        } else if (Math.abs(turn) === 1) {
          order.push(wrap(p + turn));
          t.jog = MIN_RUN + (t.group ? (round * 7) % 3 : Math.floor(rand() * 3));
        } else if (turn && diff(p + turn, t.base) <= 2) {
          order.push(wrap(p + turn / 2));
          t.pref = wrap(p + turn);
          t.jog = 2 + (t.group ? round % 2 : Math.floor(rand() * 2));
        }
      }
      order.push(d);
      if (t.run >= MIN_RUN) for (const c of rand() < 0.5 ? [p, p + 1, p - 1] : [p, p - 1, p + 1]) if (!order.includes(wrap(c))) order.push(wrap(c));

      let moved = false;
      for (const c of order) {
        const i = t.x + DIRS[c][0];
        const j = t.y + DIRS[c][1];
        if (!inside(i, j)) {
          // Leave the page straight ahead, never on a last-moment turn.
          const [si, sj] = [t.x + DIRS[t.dir][0], t.y + DIRS[t.dir][1]];
          if (inside(si, sj)) continue;
          t.cells.push(si, sj, round);
          t.x = si;
          t.y = sj;
          finish(t, 'edge');
          moved = true;
          break;
        }
        if (!canEnter(t, i, j, c)) continue;
        if (c !== t.dir) t.run = 0;
        t.cells.push(i, j, round);
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
      // Branches leave at a right angle, then bend 45 degrees back towards the parent's heading.
      if (t.len >= 3 && rand() < (t.group ? 0.015 : 0.05)) {
        let side = rand() < 0.5 ? 1 : -1;
        if (diff(t.dir + 2 * side, t.base) > 2) side = -side;
        const b = wrap(t.dir + 2 * side);
        const i = t.x + DIRS[b][0];
        const j = t.y + DIRS[b][1];
        if (diff(b, t.base) <= 2 && inside(i, j) && at(i, j) === 0) {
          const pts = [center(t.x), center(t.y), t.at];
          const child = grow({ parent: t.id, x: t.x, y: t.y, dir: b, pref: wrap(t.dir + side), base: t.base, grace: 0, w: t.w, at: t.at, root: t.root, rand: random(Math.floor(rand() * 2 ** 32)), pts });
          child.jog = MIN_RUN + Math.floor(rand() * 2);
          t.forks.push(t.cells.length, child.id);
          next.push(child);
        }
      }
      next.push(t);
    }
    active = next;
  }
  ended.sort((a, b) => b.id - a.id).forEach(settle);

  for (const source of sources)
    if (source.ids.some((id) => alive.has(id))) {
      shapes.push(...source.shapes);
      traces.push(...(source.links ?? []));
    }
  return { traces, shapes };
}
