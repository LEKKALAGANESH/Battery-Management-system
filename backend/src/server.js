import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { requestLogger } from './middleware/logger.js';
import batteryRouter from './routes/battery.js';
import { loginRouter } from './routes/login.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(morgan('tiny'));
app.use(requestLogger);
app.set('trust proxy', 1);
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.use('/api/auth', loginRouter);
app.use('/api/battery', batteryRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`BMS backend listening on :${port}`));
