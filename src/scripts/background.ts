// Draws the circuit board behind the page on a viewport-sized canvas. Each part of the board
// starts growing when the reader scrolls down to it, and never shrinks back.
import { circuit, CREST_WIDTH, G, type Board, type Shape, type Trace } from './circuit';

const BUCKET = 400; // board rows are indexed in bands this tall, in crest pixels
const REVEAL = 0.85; // growth reaches this far down the viewport
const INK = '#000070'; // the CV's accent colour
const PAUSE = 300; // ms without scrolling before the traces start growing
const GROW = 1800; // ms a growth step takes at least; longer steps take up to twice this

interface Band { traces: Trace[]; shapes: Shape[] }

export function background(bg: HTMLElement) {
  const crest = bg.querySelector('.crest')!;
  const canvas = bg.querySelector('canvas')!;
  const ctx = canvas.getContext('2d')!;
  const seed = Math.floor(Math.random() * 2 ** 32);
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let bands: Band[] = [];
  let scale = 0;
  let size = '';
  let goal = 0;
  let shown = 0;
  let frame = 0;

  const build = () => {
    scale = crest.getBoundingClientRect().width / CREST_WIDTH;
    const key = `${bg.clientWidth}x${bg.clientHeight}`;
    if (!scale || key === size) return;
    size = key;
    const board: Board = circuit(bg.clientWidth / scale, bg.clientHeight / scale, seed);
    bands = [];
    const add = (top: number, bottom: number, fill: (b: Band) => void) => {
      for (let b = Math.max(0, Math.floor(top / BUCKET)); b <= Math.floor(bottom / BUCKET); b++) fill((bands[b] ??= { traces: [], shapes: [] }));
    };
    for (const t of board.traces) add(t.top - 10, t.bottom + 10, (b) => b.traces.push(t));
    for (const s of board.shapes) add(s.y - 20, s.y + ('h' in s ? s.h : 0) + 20, (b) => b.shapes.push(s));
  };

  // Growth rounds reached by things whose source sits at `root`.
  const clock = (root: number) => (shown - root * scale) / (G * scale);

  const draw = () => {
    const dpr = devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const box = bg.getBoundingClientRect();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * box.left, dpr * box.top);

    const traces = new Set<Trace>();
    const shapes = new Set<Shape>();
    const first = Math.max(0, Math.floor(-box.top / scale / BUCKET));
    const last = Math.floor((h - box.top) / scale / BUCKET);
    for (let b = first; b <= last; b++) {
      bands[b]?.traces.forEach((t) => traces.add(t));
      bands[b]?.shapes.forEach((s) => shapes.add(s));
    }

    ctx.strokeStyle = INK;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const width of [6, 9]) {
      ctx.beginPath();
      for (const t of traces) {
        if (t.w !== width) continue;
        const c = clock(t.root);
        const p = t.pts;
        if (c < p[2]) continue;
        ctx.moveTo(p[0], p[1]);
        for (let k = 3; k < p.length; k += 3) {
          if (p[k + 2] <= c) {
            ctx.lineTo(p[k], p[k + 1]);
            continue;
          }
          const f = (c - p[k - 1]) / (p[k + 2] - p[k - 1]);
          ctx.lineTo(p[k - 3] + (p[k] - p[k - 3]) * f, p[k - 2] + (p[k + 1] - p[k - 2]) * f);
          break;
        }
      }
      ctx.lineWidth = width;
      ctx.stroke();
    }

    for (const s of shapes) {
      if (clock(s.root) < s.t) continue;
      ctx.beginPath();
      if (s.kind === 'rect') {
        ctx.fillStyle = INK;
        ctx.fillRect(s.x, s.y, s.w, s.h);
      } else if (s.kind === 'outline') {
        ctx.lineWidth = 4;
        ctx.strokeRect(s.x, s.y, s.w, s.h);
      } else {
        const [r, lw] = s.kind === 'via' ? [8, 5] : [s.r, s.w];
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.lineWidth = lw;
        ctx.stroke();
        if (s.kind === 'via') {
          ctx.beginPath();
          ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = INK;
          ctx.fill();
        }
      }
    }
  };

  // Growth waits until the reader stops scrolling, then plays as one eased animation, so it
  // reads as an effect rather than as the background lagging behind the scroll.
  let lastScroll = performance.now();
  let from = 0;
  let to = 0;
  let start = 0;
  const tick = (now: number) => {
    frame = 0;
    goal = Math.max(goal, innerHeight * REVEAL - bg.getBoundingClientRect().top);
    if (still) {
      shown = Infinity;
      draw();
      return;
    }
    if (now - lastScroll < PAUSE) {
      start = 0;
      draw();
      schedule();
      return;
    }
    if (!start || goal !== to) {
      // Whatever is above the viewport grows at once; only the part in view animates.
      from = Math.max(shown, -bg.getBoundingClientRect().top);
      to = goal;
      start = now;
    }
    const duration = GROW + Math.min(GROW, (to - from) * 1.5);
    const t = Math.min(1, (now - start) / duration);
    shown = from + (to - from) * (1 - (1 - t) ** 3);
    draw();
    if (t < 1) schedule();
  };
  const schedule = () => {
    frame ||= requestAnimationFrame(tick);
  };

  new ResizeObserver(() => {
    build();
    schedule();
  }).observe(bg);
  addEventListener(
    'scroll',
    () => {
      lastScroll = performance.now();
      schedule();
    },
    { passive: true },
  );
  addEventListener('resize', schedule);
}
