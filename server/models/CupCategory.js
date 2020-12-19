const { ObjectId } = require('mongoose').Schema.Types;
const { Schema, model } = require('mongoose');
const User = require('./User');

/**
 * Schema definition for the Cup Category model.
 */
const cupCategorySchema = new Schema({
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
  value: {
    type: Number,
    required: true,
    unique: true,
  },
});

module.exports = model('CupCategory', cupCategorySchema);
