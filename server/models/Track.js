const ObjectId = require('mongoose').Types;
const { Schema, model } = require('mongoose');

/**
 * Schema definition for the Track model.
 */
const trackSchema = new Schema({
  hidden: {
    type: Boolean,
    default: true,
  },
  lastModifiedBy: {
    type: ObjectId,
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
});

module.exports = model('Track', trackSchema);
