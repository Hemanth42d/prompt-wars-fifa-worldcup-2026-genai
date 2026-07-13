import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation, validate } from '../middleware/validator.js';
import { strictRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', strictRateLimiter, registerValidation, validate, register);
router.post('/login', strictRateLimiter, loginValidation, validate, login);
router.get('/me', protect, getMe);

export default router;
