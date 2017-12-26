;(function() {

  'use strict';

  /**
   * Users endpoint controller
   * @desc Handler functions for all /users routes
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
    createUser,
    getUsers,
    getUser,
    updateUser
  };

  /// definitions

  /**
   * Create new user
   * POST '/users'
   */
  function createUser(req, res, next) {
    var params = req.body;
    var user = new User({
      username: params.username,
      firstName: params.firstName,
      surname: params.surname,
      password: params.password,
      email: params.email,
      role: params.role,
    });

    // req params validation for required fields
    req.checkBody('username', 'Username must be defined').notEmpty();
    req.checkBody('password', 'Password must be defined').notEmpty();

    // validate user input
    var errors = req.getValidationResult();
    if (errors) {
        utils.sendJSONresponse(res, 400, errors);
        return;
    }

    user.save((err, newUser) => {
      if (err) return next({ err: err, status: 400 });
      if (!newUser) return next({ message: 'User not created.', status: 400 });

      utils.sendJSONresponse(res, 201, newUser);
    });
  }

  

  /**
   * Get users (paginated)
   * GET '/users/'
   */
  function getUsers(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;

    var options = {
        page: page,
        limit: limit,
        lean: true
    };

    User.paginate({}, options, (err, users) => {
      if (err) return next(err);
      if (!users) return next({
        message: 'No users found.',
        status: 404
      });

      var pagination = {
        pageNumber: users.page,
        itemsPerPage: users.limit,
        prev: res.locals.paginate.href(true),
        next: res.locals.paginate.href(),
      };

      utils.sendJSONresponse(res, 200, users, false, pagination);
    });
  }

  /**
   * Get user
   * GET '/users/:userId'
   */
  function getUser(req, res, next) {
    var params = req.params;

    User
      .findOne({ '_id': ObjectId(params.userId) }, { password: 0, __v: 0 })
      .exec((err, user) => {
        if (err) return next(err);
        if (!user) return next({
          message: 'User not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, user);
      });
  }

  /**
   * Update user
   * PUT '/users/:userId'
   */
  function updateUser(req, res, next) {
    var bodyParams = req.body;
    var currentUser = req.user;

    User
      .findOneAndUpdate(
        { _id: ObjectId(currentUser._id) },
        { '$set': {
          'firstName': bodyParams.firstName,
          'surname': bodyParams.surname,
          'email': bodyParams.email,
          'role': bodyParams.role,
          }
        },
        { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
      .exec((err, user) => {
        if (err) return next({ err: err, status: 400 });
        if (!user) return next({
          message: 'User not found.',
          status: 404
        });

        utils.sendJSONresponse(res, 200, user);
      });
  }

})();
