const router = require('express').Router();
const passport = require('passport');
const config = require('../../config/passport');
const { onSuccess, onFailure, patchOptions } = require('../utilities/responder');

const SessionType = require('../../models/SessionType');
const authOptions = config.authOptions;

/**
 * Create a Session Type
 * @route POST api/session-types
 * @access Private
 */
router.post('/', passport.authenticate(...authOptions), (req, res) => {
  let newSessionType = new SessionType({ lastModifiedBy: req.user._id, ...req.body });
  newSessionType
    .save()
    .then(sessionType => {
      return SessionType.findById(sessionType._id).populate('lastModifiedBy', [
        'username',
        'email',
      ]);
    })
    .then(sessionType =>
      res.status(200).json(onSuccess('Successfully added Session Type', sessionType))
    )
    .catch(error => res.status(400).json(onFailure('Unable to add Session Type', error)));
});

/**
 * Retrieve all Session Types
 * @route GET api/session-types
 * @access Private
 */
router.get('/', passport.authenticate(...authOptions), (req, res) => {
  SessionType.find()
    .populate('lastModifiedBy', ['username', 'email'])
    .sort({ value: 1 })
    .then(sessionTypes =>
      res.status(200).json(onSuccess('Successfully retrieved Session Types', sessionTypes))
    )
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Session Types', error)));
});

/**
 * Retrieve a Session Type
 * @route GET /api/session-types/:id
 * @access Private
 */
router.get('/:id', passport.authenticate(...authOptions), (req, res) => {
  SessionType.findById(req.params.id)
    .populate('lastModifiedBy', ['username', 'email'])
    .then(sessionType => {
      if (!sessionType) throw 'Session Type does not exist';
      else return sessionType;
    })
    .then(sessionType =>
      res.status(200).json(onSuccess('Successfully retrieved Session Type', sessionType))
    )
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Session Type', error)));
});

/**
 * Update a Session Type at the given id, body must contain object with update fields
 * @route PATCH api/session-types/:id
 * @access Private
 */
router.patch('/:id', passport.authenticate(...authOptions), (req, res) => {
  const { _id, ...updateFields } = req.body;
  SessionType.findByIdAndUpdate(
    req.params.id,
    { $set: { lastModifiedDate: Date.now(), lastModifiedBy: req.user._id, ...updateFields } },
    patchOptions
  )
    .populate('lastModifiedBy', ['username', 'email'])
    .then(sessionType =>
      res.status(200).json(onSuccess('Successfully updated Session Type', sessionType))
    )
    .catch(error => res.status(400).json(onFailure('Unable to update Session Type', error)));
});

/**
 * Delete a Session Type at the given id
 * @route DELETE api/session-types/:id
 * @access Private
 */
router.delete('/:id', passport.authenticate(...authOptions), (req, res) => {
  SessionType.findByIdAndDelete(req.params.id)
    .then(sessionType => {
      if (sessionType) res.status(200).json(onSuccess('Successfully deleted Session Type', null));
      else res.status(400).json(onFailure('Session Type does not exist', null));
    })
    .catch(error => res.status(400).json(onFailure('Unable to delete Session Type', error)));
});

module.exports = router;
