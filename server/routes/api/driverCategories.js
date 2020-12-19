const router = require('express').Router();
const passport = require('passport');
const config = require('../../config/passport');
const { onSuccess, onFailure, patchOptions } = require('../utilities/responder');

const DriverCategory = require('../../models/DriverCategory');
const authOptions = config.authOptions;

/**
 * Create a Driver Category
 * @route POST api/driver-categories
 * @access Private
 */
router.post('/', passport.authenticate(...authOptions), (req, res) => {
  let newDriverCategory = new DriverCategory({ lastModifiedBy: req.user._id, ...req.body });
  newDriverCategory
    .save()
    .then(driverCategory => {
      return DriverCategory.findById(driverCategory._id).populate('lastModifiedBy', [
        'username',
        'email',
      ]);
    })
    .then(driverCategory =>
      res.status(200).json(onSuccess('Successfully added Driver Category', driverCategory))
    )
    .catch(error => res.status(400).json(onFailure('Unable to add Driver Category', error)));
});

/**
 * Retrieve all Driver Categories
 * @route GET api/driver-categories
 * @access Private
 */
router.get('/', passport.authenticate(...authOptions), (req, res) => {
  DriverCategory.find()
    .populate('lastModifiedBy', ['username', 'email'])
    .sort({ value: 1 })
    .then(driverCategories =>
      res.status(200).json(onSuccess('Successfully retrieved Driver Categories', driverCategories))
    )
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Driver Categories', error)));
});

/**
 * Retrieve a Driver Category
 * @route GET /api/driver-categories/:id
 * @access Private
 */
router.get('/:id', passport.authenticate(...authOptions), (req, res) => {
  DriverCategory.findById(req.params.id)
    .populate('lastModifiedBy', ['username', 'email'])
    .then(driverCategory => {
      if (!driverCategory) throw 'Driver Category does not exist';
      else return driverCategory;
    })
    .then(driverCategory =>
      res.status(200).json(onSuccess('Successfully retrieved Driver Category', driverCategory))
    )
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Driver Category', error)));
});

/**
 * Update a Driver Category at the given id, body must contain object with update fields
 * @route PATCH api/driver-categories/:id
 * @access Private
 */
router.patch('/:id', passport.authenticate(...authOptions), (req, res) => {
  const { _id, ...updateFields } = req.body;
  DriverCategory.findByIdAndUpdate(
    req.params.id,
    { $set: { lastModifiedDate: Date.now(), lastModifiedBy: req.user._id, ...updateFields } },
    patchOptions
  )
    .populate('lastModifiedBy', ['username', 'email'])
    .then(driverCategory =>
      res.status(200).json(onSuccess('Successfully updated Driver Category', driverCategory))
    )
    .catch(error => res.status(400).json(onFailure('Unable to update Driver Category', error)));
});

/**
 * Delete a Driver Category at the given id
 * @route DELETE api/driver-categories/:id
 * @access Private
 */
router.delete('/:id', passport.authenticate(...authOptions), (req, res) => {
  DriverCategory.findByIdAndDelete(req.params.id)
    .then(driverCategory => {
      if (driverCategory)
        res.status(200).json(onSuccess('Successfully deleted Driver Category', null));
      else res.status(400).json(onFailure('Driver Category does not exist', null));
    })
    .catch(error => res.status(400).json(onFailure('Unable to delete Driver Category', error)));
});

module.exports = router;
