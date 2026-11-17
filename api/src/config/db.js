const { Pool } = require('pg');
const env = require('./env');
const { URL } = require('url');

// Parser l'URL pour extraire l'hôte
const dbUrl = new URL(env.databaseUrl);
const host = dbUrl.hostname;

const pool = new Pool({
  connectionString: env.databaseUrl,
  host: host,
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = pool;