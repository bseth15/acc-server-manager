const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const config = require('../../config/database');
const jwt = require('jsonwebtoken');
const { onSuccess, onFailure } = require('../utilities/responder');

const User = require('../../models/User');
const authOptions = config.authOptions;

/**
 * Create a User
 * @route POST api/users
 * @access Public
 */
router.post('/', (req, res) => {
  let newUser = new User({ ...req.body });
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(newUser.password, salt))
    .then(hash => {
      newUser.password = hash;
      newUser.save();
    })
    .then(() => res.json(onSuccess('Successfully registered User', null)))
    .catch(error => res.json(onFailure('Unable to register User', error)));
});

/**
 * Authenticate a User
 * @route POST api/users/authorize
 * @access Public
 */
router.post('/authorize', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username: username })
    .then(user => {
      if (!user) throw new Error('User does not exist');
      else return user;
    })
    .then(user =>
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) return user;
          else throw new Error('Incorrect log credentials');
        })
        .catch(error => {
          throw error;
        })
    )
    .then(user => {
      const { password, ...rest } = user.toJSON();
      return {
        user: { ...rest },
        token: 'JWT ' + jwt.sign(user.toJSON(), config.secret, { expiresIn: 86400 }),
      };
    })
    .then(body => res.json(onSuccess('Successfully authenticated User', body)))
    .catch(error => res.json(onFailure('Unable to authenticate User', error)));
});

/**
 * Retrieve all users
 * @route GET api/users
 * @access Private
 */
router.get('/', passport.authenticate(...authOptions), (req, res) => {
  User.find()
    .select(User.safeSelectOptions)
    .sort({ username: 1 })
    .then(users => res.json(onSuccess('Successfully retrieved Users', users)))
    .catch(error => res.json(onFailure('Unable to retrieve Users', error)));
});

/**
 * Retrieve a user
 * @route GET api/users/:id
 * @access Private
 */
router.get('/:id', passport.authenticate(...authOptions), (req, res) => {
  User.findById(req.params.id)
    .select(User.safeSelectOptions)
    .then(user => {
      if (!user) throw new Error('User does not exist');
      else return user;
    })
    .then(users => res.json(onSuccess('Successfully retrieved User', users)))
    .catch(error => res.json(onFailure('Unable to retrieve User', error)));
});

/**
 * Update a User with the given id, body must contain object with updated fields
 * @route PUT api/users/:id
 * @access Private
 */
router.put('/:id', passport.authenticate(...authOptions), (req, res) => {
  const { _id, ...updateFields } = req.body;
  User.findByIdAndUpdate(req.params.id, { $set: { ...updateFields } }, { new: true })
    .select(User.safeSelectOptions)
    .then(user => res.json(onSuccess('Successfully updated User', user)))
    .catch(error => res.json(onFailure('Unable to update User', error)));
});

/**
 * Delete a User with the given id
 * @route DELETE api/users/:id
 * @access Private
 */
router.put('/:id', passport.authenticate(...authOptions), (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(user => {
      if (user) res.json(onSuccess('Successfully deleted User', null));
      else res.json(onFailure('User does not exist', null));
    })
    .catch(error => res.json(onFailure('Unable to delete User', error)));
});

module.exports = router;
