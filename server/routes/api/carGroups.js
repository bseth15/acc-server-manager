const router = require('express').Router();
const passport = require('passport');
const config = require('../../config/passport');
const { onSuccess, onFailure, patchOptions } = require('../utilities/responder');

const CarGroup = require('../../models/CarGroup');
const authOptions = config.authOptions;

/**
 * Create a Car Group
 * @route POST api/car-groups
 * @access Private
 */
router.post('/', passport.authenticate(...authOptions), (req, res) => {
  let newCarGroup = new CarGroup({ ...req.body });
  newCarGroup
    .save()
    .then(carGroup => {
      return CarGroup.findById(carGroup._id).populate('lastModifiedBy', ['username', 'email']);
    })
    .then(carGroup => res.status(200).json(onSuccess('Successfully added Car Group', carGroup)))
    .catch(error => res.status(400).json(onFailure('Unable to add Car Group', error)));
});

/**
 * Retrieve all Car Groups
 * @route GET api/car-groups
 * @access Private
 */
router.get('/', passport.authenticate(...authOptions), (req, res) => {
  CarGroup.find()
    .populate('lastModifiedBy', ['username', 'email'])
    .sort({ value: 1 })
    .then(carGroups =>
      res.status(200).json(onSuccess('Successfully retrieved Car Groups', carGroups))
    )
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Car Groups', error)));
});

/**
 * Retrieve a Car Group
 * @route GET /api/car-groups/:id
 * @access Private
 */
router.get('/:id', passport.authenticate(...authOptions), (req, res) => {
  CarGroup.findById(req.params.id)
    .populate('lastModifiedBy', ['username', 'email'])
    .then(carGroup => {
      if (!carGroup) throw 'Car Group does not exist';
      else return carGroup;
    })
    .then(carGroup => res.status(200).json(onSuccess('Successfully retrieved Car Group', carGroup)))
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Car Group', error)));
});

/**
 * Update a Car Group at the given id, body must contain object with update fields
 * @route PATCH api/car-groups/:id
 * @access Private
 */
router.patch('/:id', passport.authenticate(...authOptions), (req, res) => {
  const { _id, ...updateFields } = req.body;
  CarGroup.findByIdAndUpdate(req.params.id, { $set: { ...updateFields } }, patchOptions)
    .populate('lastModifiedBy', ['username', 'email'])
    .then(carGroup => res.status(200).json(onSuccess('Successfully updated Car Group', carGroup)))
    .catch(error => res.status(400).json(onFailure('Unable to update Car Group', error)));
});

/**
 * Delete a Car Group at the given id
 * @route DELETE api/car-groups/:id
 * @access Private
 */
router.delete('/:id', passport.authenticate(...authOptions), (req, res) => {
  CarGroup.findByIdAndDelete(req.params.id)
    .then(carGroup => {
      if (carGroup) res.status(200).json(onSuccess('Successfully deleted Car Group', null));
      else res.status(400).json(onFailure('Car Group does not exist', null));
    })
    .catch(error => res.status(400).json(onFailure('Unable to delete Car Group', error)));
});

module.exports = router;
