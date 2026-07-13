import express from 'express';
import { sendMessage, getChatHistory, deleteChatSession } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';
import { chatValidation, validate } from '../middleware/validator.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/message', protect, aiRateLimiter, chatValidation, validate, sendMessage);
router.get('/history', protect, getChatHistory);
router.delete('/session/:sessionId', protect, deleteChatSession);

export default router;
