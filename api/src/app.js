import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { env } from './config/env.js';
import routes from './routes.js';
import { errorHandler, notFound } from './helpers.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());

app.use(
  cors({
    origin: [env.frontendUrl, 'http://localhost:5173'],
    credentials: true
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});
app.use('/api', limiter);

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;