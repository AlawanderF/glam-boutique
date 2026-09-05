// Gera public/sitemap.xml a partir dos slugs encontrados em src/constants/products.ts
// e src/constants/categories.ts — sem precisar compilar TypeScript, via regex simples.
//
// Rode "npm run sitemap" sempre que adicionar/remover produtos ou categorias.
// Quando o catálogo passar a vir do backend/MySQL, troque esta leitura de arquivo
// por uma consulta real à API antes de gerar o XML.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const SITE_URL = 'https://www.glamboutique.com.br';

function extractSlugs(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const matches = content.matchAll(/slug:\s*'([^']+)'/g);
  return Array.from(matches, (m) => m[1]);
}

const categorySlugs = extractSlugs(path.join(root, 'src/constants/categories.ts'));
const productSlugs = extractSlugs(path.join(root, 'src/constants/products.ts'));

const staticRoutes = ['', 'catalogo', 'entrar', 'cadastro', 'privacidade', 'termos', 'trocas'];

const urls = [
  ...staticRoutes.map((route) => ({ loc: route, priority: route === '' ? '1.0' : '0.6' })),
  ...categorySlugs.map((slug) => ({ loc: `catalogo/${slug}`, priority: '0.8' })),
  ...productSlugs.map((slug) => ({ loc: `produto/${slug}`, priority: '0.7' })),
];

const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}/${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(path.join(root, 'public/sitemap.xml'), xml, 'utf-8');
console.log(`sitemap.xml gerado com ${urls.length} URLs (${categorySlugs.length} categorias, ${productSlugs.length} produtos).`);
