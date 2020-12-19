const { ObjectId } = require('mongoose').Schema.Types;
const { Schema, model } = require('mongoose');
const CarGroup = require('./CarGroup');
const User = require('./User');

/**
 * Schema definition for the Car Model model.
 */
const carModelSchema = new Schema({
  // TODO: Validate each object is a group
  carGroups: [
    {
      type: ObjectId,
      ref: CarGroup,
    },
  ],
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

module.exports = model('CarModel', carModelSchema);
