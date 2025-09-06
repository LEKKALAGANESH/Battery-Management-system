import { query } from '../db.js';
import { z } from 'zod';

const BatteryPayload = z.object({
  battery_id: z.string().min(1).max(64),
  current: z.number().gte(-1000).lte(1000),
  voltage: z.number().gte(0).lte(1000),
  temperature: z.number().gte(-60).lte(120),
  time: z.string().datetime()
});

export async function ingest(req, res) {
  const parsed = BatteryPayload.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parsed.error.issues });
  }
  const { battery_id, current, voltage, temperature, time } = parsed.data;
  const { rows } = await query(
    `INSERT INTO battery_readings (battery_id, current, voltage, temperature, time)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [battery_id, current, voltage, temperature, time]
  );
  res.status(201).json(rows[0]);
}

export async function getAllForBattery(req, res) {
  const id = req.params.id;
  const { page = '1', pageSize = '500' } = req.query;
  const limit = Math.min(parseInt(pageSize), 2000);
  const offset = (parseInt(page) - 1) * limit;
  const { rows } = await query(
    `SELECT * FROM battery_readings WHERE battery_id=$1 ORDER BY time DESC LIMIT $2 OFFSET $3`,
    [id, limit, offset]
  );
  res.json(rows);
}

export async function getField(req, res) {
  const id = req.params.id;
  const field = req.params.field;
  const allowed = ['current','voltage','temperature'];
  if (!allowed.includes(field)) return res.status(400).json({ error: 'Invalid field' });
  const { start, end } = req.query;
  let sql = `SELECT ${field}, time FROM battery_readings WHERE battery_id=$1`;
  const params = [id];
  if (start) { params.push(start); sql += ` AND time >= $${params.length}`; }
  if (end) { params.push(end); sql += ` AND time <= $${params.length}`; }
  sql += ' ORDER BY time ASC';
  const { rows } = await query(sql, params);
  res.json(rows);
}
