import mysql from 'mysql2/promise';
import 'dotenv/config';

// Pool de conexões — não conecta imediatamente; conecta sob demanda a cada query.
// Isso permite que o servidor inicie mesmo que o MySQL ainda não esteja disponível,
// retornando erro apenas nas rotas que de fato acessam o banco.
export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'glam_boutique',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true, // retorna DECIMAL como number em vez de string
});

export async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch {
    return false;
  }
}
