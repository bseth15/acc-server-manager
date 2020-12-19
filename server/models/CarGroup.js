const { ObjectId } = require('mongoose').Schema.Types;
const { Schema, model } = require('mongoose');
const User = require('./User');

/**
 * Schema definition for the Car Group model.
 */
const carGroupSchema = new Schema({
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
  value: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

module.exports = model('CarGroup', carGroupSchema);
