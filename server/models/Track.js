const { ObjectId } = require('mongoose').Schema.Types;
const { Schema, model } = require('mongoose');
const User = require('./User');

/**
 * Schema definition for the Track model.
 */
const trackSchema = new Schema(
  {
    hidden: {
      type: Boolean,
      default: true,
    },
    lastModifiedBy: {
      type: ObjectId,
      ref: User,
      required: true,
    },
    lastModifiedDate: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    privateServerSlots: {
      type: Number,
      required: true,
    },
    season: {
      type: Number,
      required: true,
    },
    value: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    uniquePitBoxes: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = model('Track', trackSchema);
