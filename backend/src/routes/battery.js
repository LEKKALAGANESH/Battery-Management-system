import express from 'express';
import { authRequired } from '../middleware/auth.js';
import { ingest, getAllForBattery, getField } from '../controllers/battery.js';

const router = express.Router();

router.post('/data', ingest); // Ingest doesn't require auth in this example (could secure by device token)
router.get('/:id', authRequired, getAllForBattery);
router.get('/:id/:field', authRequired, getField);

export default router;
