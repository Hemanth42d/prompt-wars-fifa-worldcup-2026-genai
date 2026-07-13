import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      intent: String,
      language: String,
      confidence: Number,
      agent: String,
      processingTime: Number
    }
  }],
  context: {
    location: {
      lat: Number,
      lon: Number,
      section: String,
      floor: Number
    },
    stadium: String,
    match: String,
    time: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
chatSchema.index({ user: 1, sessionId: 1 });
chatSchema.index({ createdAt: -1 });
chatSchema.index({ isActive: 1 });

// Method to add message
chatSchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    timestamp: new Date(),
    metadata
  });
  return this.save();
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
