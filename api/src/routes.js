import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { db } from './config/db.js';
import { env } from './config/env.js';
import {
  asyncHandler,
  ApiError,
  authenticate,
  validate
} from './helpers.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sango Stream API',
    timestamp: new Date().toISOString()
  });
});

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    full_name: z.string().min(2),
    role: z.enum(['listener', 'artist', 'label']).default('listener')
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

router.post(
  '/auth/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, password, full_name, role } = req.validated.body;

    const exists = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (exists.rows[0]) throw new ApiError(409, 'Email already used');

    const hash = await bcrypt.hash(password, 12);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role`,
      [email, hash, full_name, role]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    res.status(201).json({ user, token });
  })
);

router.post(
  '/auth/login',
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.validated.body;

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      },
      token
    });
  })
);

router.get(
  '/auth/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const result = await db.query(
      'SELECT id, email, full_name, role FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ user });
  })
);

router.get(
  '/tiers',
  asyncHandler(async (req, res) => {
    const result = await db.query(
      `SELECT code, name_fr, name_en, price, currency, duration_days
       FROM subscription_tiers
       WHERE is_active = true
       ORDER BY price`
    );
    res.json({ tiers: result.rows });
  })
);

router.post(
  '/subscriptions',
  authenticate,
  asyncHandler(async (req, res) => {
    const { tier_code } = req.body;

    const tierResult = await db.query(
      'SELECT * FROM subscription_tiers WHERE code = $1 AND is_active = true',
      [tier_code]
    );
    const tier = tierResult.rows[0];
    if (!tier) throw new ApiError(404, 'Tier not found');

    const result = await db.query(
      `INSERT INTO subscriptions
        (user_id, tier_code, status, payment_status, amount, currency, period_start, period_end)
       VALUES ($1, $2, 'pending', 'pending', $3, $4, now(), now() + ($5 || ' days')::interval)
       RETURNING *`,
      [req.user.id, tier.code, tier.price, tier.currency, tier.duration_days]
    );

    res.status(201).json({ subscription: result.rows[0] });
  })
);

export default router;