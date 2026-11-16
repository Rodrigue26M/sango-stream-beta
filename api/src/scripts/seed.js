import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { env } from '../config/env.js';

async function seed() {
  try {
    const adminPasswordHash = await bcrypt.hash(env.adminPassword, 12);

    await db.query(
      `INSERT INTO users (
        email,
        password_hash,
        full_name,
        role,
        preferred_language,
        is_active
      )
      VALUES ($1, $2, 'Fondateur Sango', 'admin', 'fr', true)
      ON CONFLICT (email)
      DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = 'admin',
        is_active = true,
        updated_at = now()`,
      [env.adminEmail, adminPasswordHash]
    );

    await db.query(
      `INSERT INTO subscription_tiers (
        code,
        name_fr,
        name_en,
        price,
        currency,
        duration_days,
        is_active
      )
      VALUES
        ('BASIC', 'Basique', 'Basic', 2000.00, 'XAF', 30, true),
        ('PREMIUM', 'Premium', 'Premium', 5000.00, 'XAF', 30, true),
        ('PRO', 'Pro', 'Pro', 10000.00, 'XAF', 30, true)
      ON CONFLICT (code)
      DO UPDATE SET
        name_fr = EXCLUDED.name_fr,
        name_en = EXCLUDED.name_en,
        price = EXCLUDED.price,
        currency = EXCLUDED.currency,
        duration_days = EXCLUDED.duration_days,
        is_active = EXCLUDED.is_active`
    );

    console.log('Seed completed.');
    console.log(`Admin login: ${env.adminEmail}`);
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await db.end();
  }
}

seed();