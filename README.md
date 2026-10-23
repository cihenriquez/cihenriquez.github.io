# cihenriquez.github.io

Portfolio of Cristian Henríquez, an electrical and electronics engineer (MSc, PUC Chile) who designs electronics and firmware for robots and embedded devices, from the schematic to the finished product.

Live at **https://cihenriquez.github.io**, in Spanish (`/`) and English (`/en/`).

## What's on the site

- **Home**: a short introduction, the projects, an about section with TekKnight (my own venture in engineering tools for sword fighting training), the tools I work with, and contact links.
- **Project pages**, one per project, each with key facts, links, and sections with photos, renders, and videos:
  - **Master's thesis**: estimating the payload of a semi-autonomous CAT 262C skid-steer loader running ROS, from motion-capture cameras and the torque computed from its control signals.
  - **TheGame**: a handheld console that started as a Pong on an ATmega328P breadboard and ended up on a custom ATmega32U4 PCB.
  - **Iron Impact**: a smart striking target for HEMA and combat sports, with reactive LED sensor panels, a universal mount, and a companion app over BLE.
  - **Air purification control board**: a redesigned control board, hardware and firmware, for an air purification unit used in car workshops, built to be installed, configured, diagnosed, and updated by technicians in the field.
  - **3-axis robotic stabilizer**: a gimbal with a BNO055 IMU, an ATmega328P control board, and three PID loops, simulated in Simulink before it was built.
- **Circuit board background**: the crest at the top left is the starting point of a random PCB drawn behind the page. A new board is laid out on each visit, with component footprints, vias, and traces routed at 90 and 45 degrees. The board grows as you scroll down to each part of the page. Visitors who prefer reduced motion see the full board right away.

## How it's built

The site is built with [Astro](https://astro.build) and deployed to GitHub Pages by the workflow in `.github/workflows/astro.yml` on every push to `main`.

```text
src/
├── components/   Layout, home page, and project page templates
├── i18n/         All text in Spanish and English (content.ts) and the URL helper
├── pages/        Routes: / and /proyectos/* in Spanish, /en/ and /en/projects/* in English
└── scripts/      The circuit board background
    ├── circuit.ts       lays out the random board
    ├── background.ts    draws it on a canvas and grows it as you scroll
    └── crest-grid.json  where the crest sits on the board, and its outer pads
public/
├── crest.svg     the background crest, vectorized
└── projects/     project images
```

To add or edit a project, change its text in `src/i18n/content.ts` (both languages) and add a page in `src/pages/proyectos/` and `src/pages/en/projects/`. Put its images in `public/projects/<project>/`.

The blog pages under `src/pages/blog/` and `src/content/blog/` are leftovers from the Astro blog template and are not linked from the portfolio.

## Running it locally

Requires Node.js 22.23.4 or newer.

| Command           | Action                                        |
| :---------------- | :-------------------------------------------- |
| `npm install`     | Install dependencies                          |
| `npm run dev`     | Start the dev server at `localhost:4321`      |
| `npm run build`   | Build the site to `./dist/`                   |
| `npm run preview` | Preview the build locally                     |
