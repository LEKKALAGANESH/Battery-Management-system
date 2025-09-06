import express from 'express';
import { login, register, getMe, getUsers, getUserCount } from '../controllers/auth.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

export const loginRouter = express.Router();

loginRouter.post('/login', login);
loginRouter.post('/register', register);
loginRouter.get('/me', authRequired, getMe);
loginRouter.get('/admin/users', authRequired, adminRequired, getUsers);
loginRouter.get('/admin/user-count', authRequired, adminRequired, getUserCount);
