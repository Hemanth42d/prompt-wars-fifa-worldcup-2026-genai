import express from 'express';
import { protect } from '../middleware/auth.js';
import NavigationAgent from '../services/navigationAgent.js';
import logger from '../utils/logger.js';

const router = express.Router();
const navigationAgent = new NavigationAgent();

// @desc    Get navigation route
// @route   POST /api/navigation/route
// @access  Private
router.post('/route', protect, async (req, res, next) => {
  try {
    const { message, context = {} } = req.body;
    const userProfile = req.user.toObject();

    const response = await navigationAgent.process(
      message,
      context,
      userProfile,
      { type: 'navigation', confidence: 1.0, entities: {} }
    );

    res.status(200).json({
      success: true,
      ...response
    });
  } catch (error) {
    logger.error('Navigation route error:', error);
    next(error);
  }
});

// @desc    Get stadium map
// @route   GET /api/navigation/map
// @access  Private
router.get('/map', protect, async (req, res, next) => {
  try {
    const { stadiumId } = req.query;

    res.status(200).json({
      success: true,
      stadiumId,
      map: navigationAgent.stadiumGraph
    });
  } catch (error) {
    logger.error('Get map error:', error);
    next(error);
  }
});

export default router;
