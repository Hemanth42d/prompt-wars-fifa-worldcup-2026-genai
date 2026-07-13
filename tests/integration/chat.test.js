import request from 'supertest';
import app from '../../server/index.js';
import User from '../../server/models/User.js';
import Chat from '../../server/models/Chat.js';
import mongoose from 'mongoose';

describe('Chat API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/fifa_wc_test');
    
    // Create test user and get token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Chat User',
        email: 'chat@example.com',
        password: 'Test1234!'
      });
    
    token = res.body.token;
    userId = res.body.user._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Chat.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/chat/message', () => {
    it('should send message and get AI response', async () => {
      const res = await request(app)
        .post('/api/chat/message')
        .set('Authorization', `Bearer ${token}`)
        .send({
          message: 'Where is the restroom?',
          context: { location: { section: '200' } }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBeDefined();
      expect(res.body.metadata).toBeDefined();
    }, 10000);

    it('should reject unauthorized requests', async () => {
      const res = await request(app)
        .post('/api/chat/message')
        .send({ message: 'test' });

      expect(res.status).toBe(401);
    });

    it('should validate message length', async () => {
      const res = await request(app)
        .post('/api/chat/message')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'a'.repeat(1001) });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/chat/history', () => {
    it('should return chat history', async () => {
      const res = await request(app)
        .get('/api/chat/history')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
