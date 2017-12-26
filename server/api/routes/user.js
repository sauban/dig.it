// const userController = require('../controllers/user');
// const passportConfig = require('../config/passport');

// controllers
const usersCtrl = require('../controllers').user;

const middlewares = require('../middlewares');


module.exports = (router) => {
  'use strict';

  /**
   * Users
   */

  router.post('/users', 
    middlewares.verifyToken, 
    usersCtrl.createUser); // create new user

  router.get('/users/', 
    middlewares.verifyToken, 
    /*usersCtrl.isAdmin,*/ // get all users (uncomment usersCtrl.isAdmin if the route should work only for admin roles)
    usersCtrl.getUsers); 

  router.get('/users/:userId', 
        middlewares.verifyToken, 
        usersCtrl.getUser); // get user

  router.put('/users/:userId', 
    middlewares.verifyToken, 
    usersCtrl.updateUser);
};
