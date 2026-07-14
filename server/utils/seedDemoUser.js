/**
 * Demo User Seeder
 * Creates a demo user with sample chat history for evaluators
 */

import User from '../models/User.js';
import Chat from '../models/Chat.js';
import logger from './logger.js';
import bcrypt from 'bcryptjs';

/**
 * Demo user credentials
 */
export const DEMO_USER = {
  email: 'demo@fifawc2026.com',
  password: 'Demo@2026',
  name: 'FIFA Demo User',
  preferredLanguage: 'en',
  ticketInfo: {
    matchId: 'MATCH-001',
    seatNumber: 'A-204',
    section: 'Lower Bowl',
    gate: 'Gate 3',
    stadiumName: 'MetLife Stadium'
  },
  accessibility: {
    wheelchairAccess: false,
    visualImpairment: false,
    hearingImpairment: false,
    preferredAssistance: []
  }
};

/**
 * Sample chat messages for demo
 */
const DEMO_CHAT_MESSAGES = [
  {
    role: 'user',
    content: '¿Dónde está mi asiento? Sección A-204',
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    role: 'assistant',
    content: 'Tu asiento está en la Sección Lower Bowl, asiento A-204. Para llegar:\n\n1. Entra por Gate 3\n2. Sube las escaleras a la derecha\n3. Busca la Sección A\n4. Tu asiento es el número 204\n\n¿Necesitas ayuda adicional?',
    metadata: {
      intent: 'navigation',
      language: 'es',
      confidence: 0.95,
      agent: 'navigation'
    },
    timestamp: new Date(Date.now() - 3590000)
  },
  {
    role: 'user',
    content: 'Where can I find food?',
    timestamp: new Date(Date.now() - 1800000) // 30 min ago
  },
  {
    role: 'assistant',
    content: 'Great question! Here are the food options near your section (Lower Bowl, Section A):\n\n🍔 Concession Stand #12 - 50 meters north\n  • Burgers, hot dogs, nachos\n  • Vegetarian options available\n\n🍕 Pizza Corner - 75 meters west\n  • Fresh pizza, salads\n  • Gluten-free options\n\n🥤 Drink Station #5 - 30 meters south\n  • Soft drinks, water, beer\n\n💡 Tip: Lines are shortest 30 minutes before kickoff!\n\nWould you like directions to any of these?',
    metadata: {
      intent: 'services',
      language: 'en',
      confidence: 0.92,
      agent: 'general'
    },
    timestamp: new Date(Date.now() - 1790000)
  },
  {
    role: 'user',
    content: 'What time does the match start?',
    timestamp: new Date(Date.now() - 900000) // 15 min ago
  },
  {
    role: 'assistant',
    content: '⚽ Match Information:\n\n🏆 FIFA World Cup 2026\n📅 Today\n⏰ Kickoff: 3:00 PM EST (15:00)\n🏟️ MetLife Stadium\n\n🎫 Your Details:\n  • Section: Lower Bowl, A-204\n  • Gate: Gate 3\n  • Seat: A-204\n\n⏱️ Current Time: 2:45 PM EST\n\n✅ You have 15 minutes before kickoff!\n\nRecommendation: Head to your seat now to enjoy the pre-match atmosphere! 🎉',
    metadata: {
      intent: 'information',
      language: 'en',
      confidence: 0.98,
      agent: 'general'
    },
    timestamp: new Date(Date.now() - 890000)
  }
];

/**
 * Seed demo user and chat history
 * @returns {Promise<Object>} Created user and chat
 */
export const seedDemoUser = async () => {
  try {
    // Check if demo user already exists
    let user = await User.findOne({ email: DEMO_USER.email });

    if (user) {
      logger.info('Demo user already exists, skipping creation');
      return { user, alreadyExists: true };
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(DEMO_USER.password, salt);

    // Create demo user
    user = await User.create({
      ...DEMO_USER,
      password: hashedPassword
    });

    logger.info('✅ Demo user created successfully');

    // Create chat session with history
    const chat = await Chat.create({
      user: user._id,
      sessionId: 'demo-session-' + Date.now(),
      messages: DEMO_CHAT_MESSAGES.map(msg => ({
        role: msg.role,
        content: msg.content,
        metadata: msg.metadata || {},
        timestamp: msg.timestamp
      })),
      context: {
        stadium: 'MetLife Stadium',
        event: 'FIFA World Cup 2026',
        location: {
          section: 'Lower Bowl',
          seat: 'A-204',
          gate: 'Gate 3'
        }
      },
      isActive: true
    });

    logger.info('✅ Demo chat history created successfully');

    return { user, chat, created: true };
  } catch (error) {
    logger.error('Error seeding demo user:', error);
    return { error: error.message };
  }
};

/**
 * Check if demo user exists
 * @returns {Promise<boolean>}
 */
export const demoUserExists = async () => {
  try {
    const user = await User.findOne({ email: DEMO_USER.email });
    return !!user;
  } catch (error) {
    logger.error('Error checking demo user:', error);
    return false;
  }
};

export default seedDemoUser;
