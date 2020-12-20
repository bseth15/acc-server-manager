const { Schema, model } = require('mongoose');
const validator = require('validator');
const root = './pictures'; // placeholder image storage location

/**
 * Schema definition for the User model.
 */
const userSchema = new Schema(
  {
    authorized: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      get: v => `${root}${v}`,
      default: '/0.png',
    },
    biography: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    hidden: {
      type: Boolean,
      default: true,
    },
    joined: {
      type: Date,
      default: Date.now,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ['administrator', 'moderator', 'owner', 'member'],
      default: 'member',
    },
    steamId: {
      type: String,
      trim: true,
      default: '',
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: [16, 'Username exceeds maximum length (16 characters)'],
    },
  },
  { versionKey: false }
);

module.exports = model('User', userSchema);

module.exports.safeSelectOptions = ['-password'];
