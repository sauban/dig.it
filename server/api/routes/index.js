'use strict';

/**
 * Controllers (route handlers).
 */

   /**
   * API Router
   */
var express = require('express');
var router = express.Router();
const userRoutes = require('./user');
const authRoutes = require('./auth');
const productRoutes = require('./product');
 // update user

userRoutes(router);
productRoutes(router);
authRoutes(router);

module.exports = router;
