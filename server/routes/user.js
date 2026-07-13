import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const router = express.Router();

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const updates = req.body;
    const userId = req.user._id;

    // Fields that can be updated
    const allowedUpdates = ['name', 'phone', 'preferredLanguage', 'accessibility', 'ticketInfo', 'preferences'];
    const updateData = {};

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    next(error);
  }
});

// @desc    Update user location
// @route   POST /api/user/location
// @access  Private
router.post('/location', protect, async (req, res, next) => {
  try {
    const { lat, lon, section } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        lastLocation: {
          lat,
          lon,
          section,
          timestamp: new Date()
        }
      },
      { new: true }
    );

    // Emit location update via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to(userId.toString()).emit('location-updated', { lat, lon, section });
    }

    res.status(200).json({
      success: true,
      message: 'Location updated',
      location: user.lastLocation
    });
  } catch (error) {
    logger.error('Update location error:', error);
    next(error);
  }
});

export default router;
