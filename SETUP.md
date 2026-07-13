# FIFA World Cup 2026 - Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB 6+
- Redis 7+
- OpenAI API Key

## Installation

### 1. Clone and Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Environment Configuration
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your API keys
nano .env
```

Required environment variables:
- `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Random secret key

### 3. Start Services

#### Option A: Using Docker (Recommended)
```bash
docker-compose up -d
```

#### Option B: Manual Start
```bash
# Terminal 1: Start MongoDB
mongod --dbpath ./data/db

# Terminal 2: Start Redis
redis-server

# Terminal 3: Start Backend
npm run server

# Terminal 4: Start Frontend
npm run client
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## Testing
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## Production Build
```bash
# Build frontend
cd client && npm run build && cd ..

# Start production server
NODE_ENV=production node server/index.js
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify port 27017 is available

### Redis Connection Error
- Ensure Redis is running
- Check REDIS_URL in .env
- Verify port 6379 is available

### OpenAI API Error
- Verify OPENAI_API_KEY is correct
- Check API quota and billing
- Test with: `curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Chat
- POST `/api/chat/message` - Send message to AI
- GET `/api/chat/history` - Get chat history

### Navigation
- POST `/api/navigation/route` - Get navigation route
- GET `/api/navigation/map` - Get stadium map

### User
- PUT `/api/user/profile` - Update profile
- POST `/api/user/location` - Update location

## Security Features
- JWT Authentication
- bcrypt Password Hashing
- Helmet Security Headers
- CORS Protection
- Rate Limiting
- Input Validation
- XSS Protection
- SQL Injection Prevention

## Performance Optimization
- Redis Caching (300s TTL)
- Database Indexing
- Response Compression
- API Response Time <500ms
- Horizontal Scaling Ready

## Support
For issues, please create a GitHub issue or contact the team.
