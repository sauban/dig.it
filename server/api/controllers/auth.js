;(function() {

    'use strict';
  
    /**
     * Users endpoint controller
     * @desc Handler functions for all /auth routes
     */
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var User = require('../models').USER;
  
    var bcrypt = require('bcryptjs');
    var SALT_WORK_FACTOR = 10;
    var jwt = require('jsonwebtoken');
    var config = require('../../config/config.js');
    var utils = require('../utils/utils.js');
  
  
    // public
    module.exports = {
      registerUser,
      changePassword,
      authenticate
    };
  
    /// definitions
  
    /**
     * Authenticate user
     * POST '/users/authenticate'
     */
    function authenticate(req, res, next) {
      var params = req.body;
      var pass = params.password;
      var authErrMsg = {
        message: 'Authentication failed. Wrong username or password.',
        code: 'wrongCredentials',
        status: 401
      };
  
      User
        .findOne({ username: params.username })
        .exec((err, user) => {
          if (err) return next({ err: err, status: 401 });
          if (!user) return next(authErrMsg);
  
          // test a matching password
          user.comparePassword(pass, (err, isMatch) => {
            if (err || !isMatch) return next(authErrMsg);
  
            var userInfo = {
              _id: user._id,
              username: user.username,
              createdAt: user.createdAt,
              role: user.role,
              email: user.email,
              surname: user.surname,
              firstName: user.firstName
            };
  
            var token = jwt.sign(userInfo, config.secret, {
              expiresIn: '24h'
            });
  
            userInfo.token = token;
  
            // just to prove sockets are working, there are better use cases for using websockets
            req.io.emit('user:loggedIn');
  
            utils.sendJSONresponse(res, 200, userInfo);
          });
        });
    }
  
  /**
   * Register a new User
   * POST '/register'
   */
  function registerUser (req, res, next) {
    const nonEmptyFields = [
      'firstName',
      'username',
      'surname',
      'password',
      'email',
      'role'
    ];
    // req params validation for required fields
    nonEmptyFields.forEach(field => req.checkBody(field, `${field} must be defined`).notEmpty())

    // validate user input
    var errors = req.validationErrors();
    if (errors) {
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    var params = req.body;

    var user = new User(params);

    user.save((err, newUser) => {
      if (err) return next({ err: err, status: 400 });
      if (!newUser) return next({ message: 'User not created.', status: 400 });

      var userInfo = {
        _id: newUser._id,
        username: newUser.username,
        createdAt: newUser.createdAt,
        role: newUser.role,
        email: newUser.email,
        surname: newUser.surname,
        firstName: newUser.firstName
      };

      var token = jwt.sign(userInfo, config.secret, {
        expiresIn: '366d'
      });

      userInfo.token = token;

      // just to prove sockets are working, there are better use cases for using websockets
      req.io.emit('user:registeredIn');

      utils.sendJSONresponse(res, 201, userInfo);
    });
  }
  
  
    /**
     * Change password
     * PUT '/users/change-password'
     */
    function changePassword(req, res, next) {
      var bodyParams = req.body;
      var currentUser = req.user;
  
      req.checkBody('password', 'Password must be defined').notEmpty();
      req.checkBody('confirmPassword', 'Confirmed password must be defined').notEmpty();
      req.checkBody('confirmPassword', 'Password and confirm password does not match').equals(req.body.password);
  
      var errors = req.validationErrors();
      if (errors) {
          utils.sendJSONresponse(res, 400, errors);
          return;
      }
  
      User
        .findOneAndUpdate(
          { _id: ObjectId(currentUser._id) },
          { '$set': {
            'password': bcrypt.hashSync(bodyParams.password, SALT_WORK_FACTOR),
            }
          },
          { upsert: false, new: true })
        .exec((err, user) => {
          if (err) return next({ err: err, status: 400 });
          if (!user) return next({
            message: 'User not found.',
            status: 404
          });
  
          utils.sendJSONresponse(res, 204, {});
        });
    }
  
  })();
  