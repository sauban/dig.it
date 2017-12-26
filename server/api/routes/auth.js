// const userController = require('../controllers/user');
// const passportConfig = require('../config/passport');

// controllers
const authCtrl = require('../controllers').auth;
const middlewares = require('../middlewares');

module.exports = (router) => {
  'use strict';

  /**
   * Auth
   */
  router.post('/auth/login', authCtrl.authenticate); // authenticate user
  router.post('/auth/register', authCtrl.registerUser); // create new user
  router.put('/auth/change-password', middlewares.verifyToken, authCtrl.changePassword); // change password
};
