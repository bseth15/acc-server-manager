const router = require('express').Router();
const passport = require('passport');
const config = require('../../config/passport');
const { onSuccess, onFailure, patchOptions } = require('../utilities/responder');

const Track = require('../../models/Track');
const authOptions = config.authOptions;

/**
 * Create a Track
 * @route POST api/tracks
 * @access Private
 */
router.post('/', passport.authenticate(...authOptions), (req, res) => {
  let newTrack = new Track({ ...req.body });
  newTrack
    .save()
    .then(track => {
      return Track.findById(track._id).populate('lastModifiedBy', ['username', 'email']);
    })
    .then(track => res.status(200).json(onSuccess('Successfully added Track', track)))
    .catch(error => res.status(400).json(onFailure('Unable to add Track', error)));
});

/**
 * Retrieve all Tracks
 * @route GET api/tracks
 * @access Private
 */
router.get('/', passport.authenticate(...authOptions), (req, res) => {
  Track.find()
    .populate('lastModifiedBy', ['username', 'email'])
    .sort({ value: 1 })
    .then(tracks => res.status(200).json(onSuccess('Successfully retrieved Tracks', tracks)))
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Tracks', error)));
});

/**
 * Retrieve a Track
 * @route GET /api/tracks/:id
 * @access Private
 */
router.get('/:id', passport.authenticate(...authOptions), (req, res) => {
  Track.findById(req.params.id)
    .populate('lastModifiedBy', ['username', 'email'])
    .then(track => {
      if (!track) throw 'Track does not exist';
      else return track;
    })
    .then(track => res.status(200).json(onSuccess('Successfully retrieved Track', track)))
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Track', error)));
});

/**
 * Update a Track at the given id, body must contain object with update fields
 * @route PATCH api/tracks/:id
 * @access Private
 */
router.patch('/:id', passport.authenticate(...authOptions), (req, res) => {
  const { _id, ...updateFields } = req.body;
  Track.findByIdAndUpdate(req.params.id, { $set: { ...updateFields } }, patchOptions)
    .populate('lastModifiedBy', ['username', 'email'])
    .then(track => res.status(200).json(onSuccess('Successfully updated Track', track)))
    .catch(error => res.status(400).json(onFailure('Unable to update Track', error)));
});

/**
 * Delete a Track at the given id
 * @route DELETE api/tracks/:id
 * @access Private
 */
router.delete('/:id', passport.authenticate(...authOptions), (req, res) => {
  Track.findByIdAndDelete(req.params.id)
    .then(track => {
      if (track) res.status(200).json(onSuccess('Successfully deleted Track', null));
      else res.status(400).json(onFailure('Track does not exist', null));
    })
    .catch(error => res.status(400).json(onFailure('Unable to delete Track', error)));
});

module.exports = router;
