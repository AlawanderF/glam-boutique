import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const fileName = process.argv[2];
  if (!fileName) {
    console.error('Uso: node scripts/runSqlFile.js <arquivo.sql>');
    process.exit(1);
  }

  const filePath = path.resolve(__dirname, '..', fileName);
  const sql = await readFile(filePath, 'utf-8');

  // multipleStatements habilitado apenas para rodar scripts locais de setup/seed.
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    multipleStatements: true,
  });

  try {
    console.log(`Executando ${fileName}...`);
    await connection.query(sql);
    console.log('Concluído com sucesso.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Erro ao executar o script SQL:', error.message);
  process.exit(1);
});
