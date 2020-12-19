const router = require('express').Router();
const passport = require('passport');
const config = require('../../config/passport');
const { onSuccess, onFailure, patchOptions } = require('../utilities/responder');

const CarModel = require('../../models/CarModel');
const authOptions = config.authOptions;

/**
 * Create a Car Model
 * @route POST api/car-models
 * @access Private
 */
router.post('/', passport.authenticate(...authOptions), (req, res) => {
  let newCarModel = new CarModel({ lastModifiedBy: req.user._id, ...req.body });
  newCarModel
    .save()
    .then(carModel => {
      return CarModel.findById(carModel._id)
        .populate('carGroups', 'value')
        .populate('lastModifiedBy', ['username', 'email']);
    })
    .then(carModel => res.status(200).json(onSuccess('Successfully added Car Model', carModel)))
    .catch(error => res.status(400).json(onFailure('Unable to add Car Model', error)));
});

/**
 * Retrieve all Car Models
 * @route GET api/car-models
 * @access Private
 */
router.get('/', passport.authenticate(...authOptions), (req, res) => {
  CarModel.find()
    .populate('carGroups', 'value')
    .populate('lastModifiedBy', ['username', 'email'])
    .sort({ value: 1 })
    .then(carModels =>
      res.status(200).json(onSuccess('Successfully retrieved Car Models', carModels))
    )
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Car Models', error)));
});

/**
 * Retrieve a Car Model
 * @route GET /api/car-models/:id
 * @access Private
 */
router.get('/:id', passport.authenticate(...authOptions), (req, res) => {
  CarModel.findById(req.params.id)
    .populate('carGroups', 'value')
    .populate('lastModifiedBy', ['username', 'email'])
    .then(carModel => {
      if (!carModel) throw 'Car Model does not exist';
      else return carModel;
    })
    .then(carModel => res.status(200).json(onSuccess('Successfully retrieved Car Model', carModel)))
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Car Model', error)));
});

/**
 * Update a Car Model at the given id, body must contain object with update fields
 * @route PATCH api/car-models/:id
 * @access Private
 */
router.patch('/:id', passport.authenticate(...authOptions), (req, res) => {
  const { _id, ...updateFields } = req.body;
  CarModel.findByIdAndUpdate(
    req.params.id,
    { $set: { lastModifiedDate: Date.now(), lastModifiedBy: req.user._id, ...updateFields } },
    patchOptions
  )
    .populate('carGroups', 'value')
    .populate('lastModifiedBy', ['username', 'email'])
    .then(carModel => res.status(200).json(onSuccess('Successfully updated Car Model', carModel)))
    .catch(error => res.status(400).json(onFailure('Unable to update Car Model', error)));
});

/**
 * Delete a Car Model at the given id
 * @route DELETE api/car-models/:id
 * @access Private
 */
router.delete('/:id', passport.authenticate(...authOptions), (req, res) => {
  CarModel.findByIdAndDelete(req.params.id)
    .then(carModel => {
      if (carModel) res.status(200).json(onSuccess('Successfully deleted Car Model', null));
      else res.status(400).json(onFailure('Car Model does not exist', null));
    })
    .catch(error => res.status(400).json(onFailure('Unable to delete Car Model', error)));
});

module.exports = router;
