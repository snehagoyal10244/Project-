import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full legal name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a secure password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    memberTier: {
      type: String,
      default: 'Atelier Circle Member',
    },
    memberSince: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
    avatar: {
      type: String,
      default:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBtf8_qJ4rrHC-1_cvkhERj6DS8ej99PDQYHIxA7siPymNO5pdiDDyFoLN5E5UDUNLvVXJwpWW3QAk-aEbdEiaTxsmRnvjePVl4FqTnnzserOmARVCk9ir6KPwc6NVTwZMDv-B91XYn5EEIO2Yk0tJnPMqenXq5tYr-CHlkrcZD7MkZWsOLymnwzwU5XjEfXIG_cynn-lOsHo8qo2xGujShL0JUfdtJqhOc5rDish0a',
    },
    shippingAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'US' },
      countryName: { type: String, default: 'United States' },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to parse firstName & lastName if not set, and hash password
userSchema.pre('save', async function (next) {
  if (this.name && (!this.firstName || !this.lastName)) {
    const parts = this.name.trim().split(' ');
    this.firstName = parts[0] || '';
    this.lastName = parts.slice(1).join(' ') || '';
  }

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (30 minutes)
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

// Custom toJSON to never expose sensitive fields
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpire;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;
