// Grows PCB-style traces out of the crest's outer pads until they fill the page.
// Everything is in crest pixels (the crest artwork is 1207 px wide); the caller scales it.
import grid from './crest-grid.json';

export const CREST_WIDTH = 1207;
const CREST_HEIGHT = 1212;
const G = 14; // grid step; the crest grid in crest-grid.json uses the same step
const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const PAD_SMALL = 11;
const PAD_BIG = 16;

interface Trace {
  id: number;
  parent: number;
  x: number;
  y: number;
  dir: number;
  pref: number;
  root: number;
  run: number;
  jog: number;
  len: number;
  grace: number;
  w: number;
  pts: number[][];
}

function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mask = Uint8Array.from(atob(grid.mask), (c) => c.charCodeAt(0));
const wrap = (d: number) => (d + 8) % 8;
const diff = (a: number, b: number) => Math.min(wrap(a - b), wrap(b - a));
const center = (i: number, j: number) => [(i + 0.5) * G, (j + 0.5) * G];

export function circuit(width: number, height: number) {
  const cols = Math.ceil(width / G);
  const rows = Math.ceil(height / G);
  const rand = random(7);
  const owner = new Int32Array(cols * rows);
  const parentOf: number[] = [0];
  const lenOf: number[] = [0];
  const inside = (i: number, j: number) => i >= 0 && j >= 0 && i < cols && j < rows;
  const at = (i: number, j: number) => (inside(i, j) ? owner[j * cols + i] : 0);

  for (let j = 0; j < Math.min(grid.rows, rows); j++)
    for (let i = 0; i < Math.min(grid.cols, cols); i++) {
      const k = j * grid.cols + i;
      if (mask[k >> 3] & (1 << (k & 7))) owner[j * cols + i] = -1;
    }

  let active: Trace[] = [];
  const done: Trace[] = [];
  const pads: number[][] = [];

  const add = (t: Omit<Trace, 'id'>): Trace => {
    const id = parentOf.length;
    parentOf.push(t.parent);
    lenOf.push(0);
    return { ...t, id };
  };

  // Neighbours may only belong to this trace, or to its parent/child right at the fork.
  const canEnter = (t: Trace, i: number, j: number, dir: number) => {
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

  const roomFor = (t: Trace, r: number) => {
    for (let v = -r; v <= r; v++)
      for (let u = -r; u <= r; u++) {
        const o = at(t.x + u, t.y + v);
        if (o !== 0 && o !== t.id) return false;
      }
    return true;
  };

  const finish = (t: Trace, pad: boolean) => {
    t.pts.push(center(t.x, t.y));
    if (pad) {
      const big = roomFor(t, 2);
      const r = big ? 2 : 1;
      pads.push([...center(t.x, t.y), big ? PAD_BIG : PAD_SMALL, t.w]);
      for (let v = -r; v <= r; v++)
        for (let u = -r; u <= r; u++) if (inside(t.x + u, t.y + v) && !at(t.x + u, t.y + v)) owner[(t.y + v) * cols + t.x + u] = -1;
    }
    done.push(t);
  };

  for (const [px, py, pr] of grid.seeds) {
    const cx = CREST_WIDTH / 2;
    const cy = CREST_HEIGHT / 2;
    const a = Math.atan2(py - cy, px - cx);
    const dir = wrap(Math.round(a / (Math.PI / 4)));
    const w = pr > 10 ? 9 : 6;
    const ring = pr + w / 2;
    for (let s = 1; s < 4; s++) {
      const i = Math.floor((px + Math.cos(a) * (ring + s * G)) / G);
      const j = Math.floor((py + Math.sin(a) * (ring + s * G)) / G);
      if (!inside(i, j) || at(i, j)) continue;
      const pts = [[px + Math.cos(a) * ring, py + Math.sin(a) * ring], center(i, j)];
      const t = add({ parent: 0, x: i, y: j, dir, pref: dir, root: dir, run: 0, jog: 0, len: 0, grace: 2, w, pts });
      owner[j * cols + i] = t.id;
      active.push(t);
      break;
    }
  }

  while (active.length) {
    const next: Trace[] = [];
    for (const t of active) {
      const { dir: d, pref: p } = t;
      const order: number[] = [];
      if (d !== p && t.run >= t.jog) order.push(p);
      else if (d === p && t.run >= 2 && rand() < 0.09) {
        order.push(wrap(p + (rand() < 0.5 ? 1 : -1)));
        t.jog = 1 + Math.floor(rand() * 5);
      }
      order.push(d);
      for (const c of rand() < 0.5 ? [p, p + 1, p - 1] : [p, p - 1, p + 1]) if (!order.includes(wrap(c))) order.push(wrap(c));

      let moved = false;
      for (const c of order) {
        const i = t.x + DIRS[c][0];
        const j = t.y + DIRS[c][1];
        if (!inside(i, j)) {
          if (c !== t.dir) t.pts.push(center(t.x, t.y));
          t.x = i;
          t.y = j;
          finish(t, false);
          moved = true;
          break;
        }
        if (!canEnter(t, i, j, c)) continue;
        if (c !== t.dir) {
          t.pts.push(center(t.x, t.y));
          t.run = 0;
        }
        t.dir = c;
        t.run++;
        t.x = i;
        t.y = j;
        t.len++;
        t.grace--;
        lenOf[t.id] = t.len;
        owner[j * cols + i] = t.id;
        moved = true;
        break;
      }
      if (!moved) {
        finish(t, true);
        continue;
      }
      if (!inside(t.x, t.y)) continue;
      if (t.len > 8 && active.length > 12 && rand() < 0.012) {
        finish(t, true);
        continue;
      }
      if (t.len >= 3 && rand() < 0.1) {
        const b = wrap(t.dir + (rand() < 0.5 ? 1 : -1));
        const i = t.x + DIRS[b][0];
        const j = t.y + DIRS[b][1];
        if (diff(b, t.root) <= 2 && inside(i, j) && at(i, j) === 0) {
          next.push(add({ parent: t.id, x: t.x, y: t.y, dir: b, pref: b, root: t.root, run: 0, jog: 0, len: 0, grace: 0, w: t.w, pts: [center(t.x, t.y)] }));
        }
      }
      next.push(t);
    }
    active = next;
  }

  const lines = new Map<number, string>();
  for (const t of done) {
    const d = t.pts.map(([x, y], k) => `${k ? 'L' : 'M'}${Math.round(x)} ${Math.round(y)}`).join('');
    lines.set(t.w, (lines.get(t.w) ?? '') + d);
  }
  const rings = new Map<number, string>();
  for (const [x, y, r, w] of pads) rings.set(w, (rings.get(w) ?? '') + `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`);

  let svg = '';
  for (const [w, d] of lines) svg += `<path d="${d}" fill="none" stroke="#000" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (const [w, d] of rings) svg += `<path d="${d}" fill="#fff" stroke="#000" stroke-width="${w}"/>`;
  return svg;
}
