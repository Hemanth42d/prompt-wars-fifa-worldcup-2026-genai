import Chat from '../models/Chat.js';
import mongoose from 'mongoose';
import GenAIOrchestrator from '../services/genaiOrchestrator.js';
import { getCache, setCache } from '../config/redis.js';
import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';
import { v4 as uuidv4 } from 'uuid';

const orchestrator = new GenAIOrchestrator();

// @desc    Send message to GenAI assistant
// @route   POST /api/chat/message
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        error: 'Service configuration incomplete',
        message: 'AI service is not configured. Please contact administrator.',
        details: 'OPENAI_API_KEY environment variable is not set'
      });
    }

    const { message, context = {}, sessionId } = req.body;
    const userId = req.user._id;

    // Generate or use existing session ID
    const currentSessionId = sessionId || uuidv4();

    // Check cache for similar queries
    const cacheKey = `chat:${userId}:${Buffer.from(message).toString('base64').substring(0, 50)}`;
    const cachedResponse = await getCache(cacheKey);

    if (cachedResponse) {
      logger.info('Returning cached response');
      return res.status(200).json({
        success: true,
        cached: true,
        ...cachedResponse
      });
    }

    // Add user context
    context.userId = userId.toString();
    const userProfile = req.user.toObject();

    // Process message through orchestrator
    const response = await orchestrator.processRequest(
      message,
      context,
      userProfile
    );

    // Find or create chat session (only if MongoDB is connected)
    let chat = null;
    if (mongoose.connection.readyState === 1) {
      chat = await Chat.findOne({ user: userId, sessionId: currentSessionId, isActive: true });

      if (!chat) {
        chat = await Chat.create({
          user: userId,
          sessionId: currentSessionId,
          messages: [],
          context
        });
      }

      // Add user message
      await chat.addMessage('user', message);

      // Add assistant response
      await chat.addMessage('assistant', response.message, response.metadata);
    } else {
      logger.warn('MongoDB not connected, skipping chat history save');
    }

    // Cache response (shorter TTL for dynamic data)
    await setCache(cacheKey, response, 60);

    // Emit to Socket.IO if needed
    const io = req.app.get('io');
    if (io) {
      io.to(userId.toString()).emit('chat-response', response);
    }

    logger.info(`Chat message processed for user ${userId}`);

    res.status(200).json({
      success: true,
      sessionId: currentSessionId,
      ...response
    });
  } catch (error) {
    logger.error('Chat message error:', error);
    next(error);
  }
};

// @desc    Get chat history
// @route   GET /api/chat/history
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sessionId, limit = 50, page = 1 } = req.query;

    const query = { user: userId };
    if (sessionId) query.sessionId = sessionId;

    const chats = await Chat.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Chat.countDocuments(query);

    res.status(200).json({
      success: true,
      count: chats.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: chats
    });
  } catch (error) {
    logger.error('Get chat history error:', error);
    next(error);
  }
};

// @desc    Delete chat session
// @route   DELETE /api/chat/session/:sessionId
// @access  Private
export const deleteChatSession = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sessionId } = req.params;

    const chat = await Chat.findOne({ user: userId, sessionId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    chat.isActive = false;
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat session deleted'
    });
  } catch (error) {
    logger.error('Delete chat session error:', error);
    next(error);
  }
};
