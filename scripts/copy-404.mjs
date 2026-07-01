// Copia dist/index.html → dist/404.html após o build.
// No GitHub Pages, qualquer URL não encontrada serve o 404.html,
// que carrega o bundle React e o React Router retoma a rota correta.
import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const src = path.join(distDir, 'index.html');
const dest = path.join(distDir, '404.html');

if (!existsSync(src)) {
  console.error('dist/index.html não encontrado — rode "npm run build" primeiro.');
  process.exit(1);
}

copyFileSync(src, dest);
console.log('✔  dist/404.html criado (fallback de SPA para GitHub Pages).');
