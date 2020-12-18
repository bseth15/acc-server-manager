const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Passport = require('passport');
const User = require('../models/User');

/**
 * Defines the authentication strategy.
 * @param {Passport} passport
 */
module.exports = function (passport) {
  let options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  options.secretOrKey = process.env.JWT_SECRET;
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload._id)
        .then(user => {
          if (user) return done(null, user);
          else return done(null, false);
        })
        .catch(error => {
          return done(error, false);
        });
    })
  );
};

module.exports.authOptions = ['jwt', { session: false }];
