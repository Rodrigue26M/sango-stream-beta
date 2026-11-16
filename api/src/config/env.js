import 'dotenv/config';

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const port = toNumber(process.env.PORT, 4000);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port,

  databaseUrl:
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@localhost:5432/sango_stream',

  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  publicApiUrl:
    process.env.PUBLIC_API_URL ||
    `http://localhost:${port}/api`,

  adminEmail: process.env.ADMIN_EMAIL || 'admin@sango.stream',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe_Admin!2026',

  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || 'sango-stream',
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL || ''
  },

  s3: {
    endpoint: process.env.S3_ENDPOINT || '',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    region: process.env.S3_REGION || 'eu-west-3'
  },

  cinetpay: {
    apiKey: process.env.CINETPAY_API_KEY || '',
    siteId: process.env.CINETPAY_SITE_ID || '',
    apiUrl: process.env.CINETPAY_API_URL || 'https://api.cinetpay.com/v2',
    mock: process.env.CINETPAY_MOCK === 'true',
    webhookSecret: process.env.CINETPAY_WEBHOOK_SECRET || ''
  }
};