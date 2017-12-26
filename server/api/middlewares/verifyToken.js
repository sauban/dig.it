
  /**
   * Verify JWT token
   */
  var mongoose = require('mongoose');
  var ObjectId = mongoose.Types.ObjectId;
  var User = require('../models').USER;

  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  var jwt = require('jsonwebtoken');
  var config = require('../../config/config.js');
  var utils = require('../utils/utils.js');

  module.exports = function (req, res, next) {

    var token = req.headers['authorization'] || req.body.token;

    if (token) {

      jwt.verify(token, config.secret, (err, decodedToken) => {
        if (err)
          return next({
            status: 401,
            message: 'Failed to authenticate token.',
            name: 'unauthorized'
          });

        User
          .findOne({ _id: decodedToken._id }, { password: 0 })
          .lean()
          .exec((err, user) => {
            if (err) return next({ err: err, status: 400 });
            if (!user) return next({ message: 'User not found.', status: 404 });

            // token ok, save user onto request object for use in other routes
            req.user = user;
            next();
          });
      });

    } else {
      return next({
        status: 401,
        message: 'Failed to authenticate token.',
        name: 'unauthorized'
      });
    }
  }