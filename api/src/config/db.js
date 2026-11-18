import pg from 'pg';

export const db = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 6543),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'postgres',
  ssl: { rejectUnauthorized: false }
});

export default db;