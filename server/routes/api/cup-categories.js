const router = require('express').Router();
const passport = require('passport');
const config = require('../../config/passport');
const { onSuccess, onFailure, patchOptions } = require('../utilities/responder');

const CupCategory = require('../../models/CupCategory');
const authOptions = config.authOptions;

/**
 * Create a Cup Category
 * @route POST api/cup-categories
 * @access Private
 */
router.post('/', passport.authenticate(...authOptions), (req, res) => {
  let newCupCategory = new CupCategory({ lastModifiedBy: req.user._id, ...req.body });
  newCupCategory
    .save()
    .then(cupCategory => {
      return CupCategory.findById(cupCategory._id).populate('lastModifiedBy', [
        'username',
        'email',
      ]);
    })
    .then(cupCategory =>
      res.status(200).json(onSuccess('Successfully added Cup Category', cupCategory))
    )
    .catch(error => res.status(400).json(onFailure('Unable to add Cup Category', error)));
});

/**
 * Retrieve all Cup Categories
 * @route GET api/cup-categories
 * @access Private
 */
router.get('/', passport.authenticate(...authOptions), (req, res) => {
  CupCategory.find()
    .populate('lastModifiedBy', ['username', 'email'])
    .sort({ value: 1 })
    .then(cupCategories =>
      res.status(200).json(onSuccess('Successfully retrieved Cup Categories', cupCategories))
    )
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Cup Categories', error)));
});

/**
 * Retrieve a Cup Category
 * @route GET /api/cup-categories/:id
 * @access Private
 */
router.get('/:id', passport.authenticate(...authOptions), (req, res) => {
  CupCategory.findById(req.params.id)
    .populate('lastModifiedBy', ['username', 'email'])
    .then(cupCategory => {
      if (!cupCategory) throw 'Cup Category does not exist';
      else return cupCategory;
    })
    .then(cupCategory =>
      res.status(200).json(onSuccess('Successfully retrieved Cup Category', cupCategory))
    )
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Cup Category', error)));
});

/**
 * Update a Cup Category at the given id, body must contain object with update fields
 * @route PATCH api/cup-categories/:id
 * @access Private
 */
router.patch('/:id', passport.authenticate(...authOptions), (req, res) => {
  const { _id, ...updateFields } = req.body;
  CupCategory.findByIdAndUpdate(
    req.params.id,
    { $set: { lastModifiedDate: Date.now(), lastModifiedBy: req.user._id, ...updateFields } },
    patchOptions
  )
    .populate('lastModifiedBy', ['username', 'email'])
    .then(cupCategory =>
      res.status(200).json(onSuccess('Successfully updated Cup Category', cupCategory))
    )
    .catch(error => res.status(400).json(onFailure('Unable to update Cup Category', error)));
});

/**
 * Delete a Cup Category at the given id
 * @route DELETE api/cup-categories/:id
 * @access Private
 */
router.delete('/:id', passport.authenticate(...authOptions), (req, res) => {
  CupCategory.findByIdAndDelete(req.params.id)
    .then(cupCategory => {
      if (cupCategory) res.status(200).json(onSuccess('Successfully deleted Cup Category', null));
      else res.status(400).json(onFailure('Cup Category does not exist', null));
    })
    .catch(error => res.status(400).json(onFailure('Unable to delete Cup Category', error)));
});

module.exports = router;
