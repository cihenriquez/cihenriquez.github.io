// Prefija la ruta base del sitio (vacía en cihenriquez.github.io) a rutas internas.
export const url = (p: string) =>
  p.startsWith('http') || p.startsWith('mailto:') ? p : import.meta.env.BASE_URL.replace(/\/$/, '') + p;
