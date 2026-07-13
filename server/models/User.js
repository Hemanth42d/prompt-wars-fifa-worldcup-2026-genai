import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  preferredLanguage: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr', 'de', 'pt', 'ar', 'zh', 'ja', 'ko', 'ru', 'it', 'nl', 'pl', 'tr', 'hi', 'bn', 'vi', 'th', 'id', 'sw']
  },
  accessibility: {
    wheelchair: { type: Boolean, default: false },
    visualImpairment: { type: Boolean, default: false },
    hearingImpairment: { type: Boolean, default: false },
    mobilityAssistance: { type: Boolean, default: false },
    other: { type: String }
  },
  ticketInfo: {
    section: String,
    row: String,
    seat: String,
    matchId: String,
    stadium: String
  },
  preferences: {
    notifications: { type: Boolean, default: true },
    locationTracking: { type: Boolean, default: true },
    voiceEnabled: { type: Boolean, default: false }
  },
  role: {
    type: String,
    enum: ['fan', 'staff', 'medical', 'security', 'admin'],
    default: 'fan'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLocation: {
    lat: Number,
    lon: Number,
    section: String,
    timestamp: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ 'ticketInfo.matchId': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
