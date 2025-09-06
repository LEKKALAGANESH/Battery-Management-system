import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function login(req, res) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
  }
  const { email, password } = parsed.data;

  const result = await query('SELECT id, email, password_hash, role FROM users WHERE email=$1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
}

export async function register(req, res) {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.issues });
  }
  const { email, password } = parsed.data;

  // Check if user already exists
  const existing = await query('SELECT id FROM users WHERE email=$1', [email]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Insert new user
  const result = await query(
    'INSERT INTO users (email, password_hash, plain_password, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role, created_at',
    [email, passwordHash, password, 'user']
  );

  const user = result.rows[0];
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.status(201).json({ token, user: { id: user.id, email: user.email, created_at: user.created_at } });
}

export async function getMe(req, res) {
  const userId = req.user.sub;
  const result = await query('SELECT id, email, role, created_at FROM users WHERE id=$1', [userId]);
  const user = result.rows[0];

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
}

export async function getUsers(req, res) {
  const result = await query('SELECT id, email, plain_password, role, created_at FROM users ORDER BY created_at DESC');
  res.json({ users: result.rows });
}

export async function getUserCount(req, res) {
  const result = await query('SELECT COUNT(*) as count FROM users');
  res.json({ count: parseInt(result.rows[0].count) });
}
