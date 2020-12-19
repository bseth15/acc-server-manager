const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const config = require('../../config/passport');
const jwt = require('jsonwebtoken');
const { onSuccess, onFailure } = require('../utilities/responder');

const User = require('../../models/User');
const authOptions = config.authOptions;
const selectOptions = User.safeSelectOptions;
const saltRounds = 10;

/**
 * Create a User
 * @route POST api/users
 * @access Public
 */
router.post('/', (req, res) => {
  let newUser = new User({ ...req.body });
  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(newUser.password, salt))
    .then(hash => {
      newUser.password = hash;
      newUser.save();
    })
    .then(() => res.status(200).json(onSuccess('Successfully registered User', null)))
    .catch(error => res.status(400).json(onFailure('Unable to register User', error)));
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
      if (!user) throw 'Incorrect login credentials';
      else return user;
    })
    .then(user =>
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) return user;
          else throw 'Incorrect login credentials';
        })
        .catch(error => {
          throw error;
        })
    )
    .then(user => {
      const { password, ...rest } = user.toJSON();
      return {
        user: { ...rest },
        token: 'JWT ' + jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 86400 }),
      };
    })
    .then(body => res.status(200).json(onSuccess('Successfully authenticated User', body)))
    .catch(error => res.status(400).json(onFailure('Unable to authenticate User', error)));
});

/**
 * Retrieve all Users
 * @route GET api/users
 * @access Private
 */
router.get('/', passport.authenticate(...authOptions), (req, res) => {
  User.find()
    .select(selectOptions)
    .sort({ username: 1 })
    .then(users => res.status(200).json(onSuccess('Successfully retrieved Users', users)))
    .catch(error => res.status(400).json(onFailure('Unable to retrieve Users', error)));
});

/**
 * Retrieve a User
 * @route GET api/users/:id
 * @access Private
 */
router.get('/:id', passport.authenticate(...authOptions), (req, res) => {
  User.findById(req.params.id)
    .select(selectOptions)
    .then(user => {
      if (!user) throw 'User does not exist';
      else return user;
    })
    .then(user => res.status(200).json(onSuccess('Successfully retrieved User', user)))
    .catch(error => res.status(400).json(onFailure('Unable to retrieve User', error)));
});

/**
 * Update a User at the given id, body must contain object with update fields
 * @route PATCH api/users/:id
 * @access Private
 */
router.patch('/:id', passport.authenticate(...authOptions), (req, res) => {
  const { _id, password, joined, ...updateFields } = req.body;
  User.findByIdAndUpdate(req.params.id, { $set: { ...updateFields } }, { new: true })
    .select(selectOptions)
    .then(user => res.status(200).json(onSuccess('Successfully updated User', user)))
    .catch(error => res.status(400).json(onFailure('Unable to update User', error)));
});

/**
 * Delete a User at the given id
 * @route DELETE api/users/:id
 * @access Private
 */
router.delete('/:id', passport.authenticate(...authOptions), (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(user => {
      if (user) res.status(200).json(onSuccess('Successfully deleted User', null));
      else res.status(400).json(onFailure('User does not exist', null));
    })
    .catch(error => res.status(400).json(onFailure('Unable to delete User', error)));
});

module.exports = router;
