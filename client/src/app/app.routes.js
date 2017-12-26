;(function() {

  'use strict';

  /**
   * App routes
   */
  angular.module('digitApp')
    .config(RoutingConfig);

  RoutingConfig.$inject = ['$urlRouterProvider', '$stateProvider'];

  function RoutingConfig($urlRouterProvider, $stateProvider) {

    // for any unmatched url, redirect to /
    $urlRouterProvider.otherwise('/');

    // now set up the states
    $stateProvider

      .state('home', {
        url: '/',
        component: 'home'
      })

      .state('users', {
        url: '/users',
        component: 'userList',
        // role: 'admin' // accessible only for admin roles
      })

      .state('products', {
        url: '/products',
        component: 'userList',
        // role: 'admin' // accessible only for admin roles
      })

      .state('myproducts', {
        url: '/my-products',
        component: 'userList',
        // role: 'admin' // accessible only for admin roles
      })

      .state('login', {
        url: '/login',
        component: 'auth',
        // role: 'admin' // accessible only for admin roles
      })

      .state('register', {
        url: '/register',
        component: 'register',
        // role: 'admin' // accessible only for admin roles
      })

      .state('searchProduct', {
        url: '/search',
        component: 'productSearch',
        // role: 'admin' // accessible only for admin roles
      })

      .state('myProducts', {
        url: '/my/products',
        component: 'productList',
        // role: 'admin' // accessible only for admin roles
      })

      .state('createProduct', {
        url: '/products/create',
        component: 'product',
        // role: 'admin' // accessible only for admin roles
      })

      .state('editProduct', {
        url: '/products/:productId/edit',
        component: 'product',
        // role: 'admin' // accessible only for admin roles
      })

      .state('displayProduct', {
        url: '/products/:productId',
        component: 'product',
        // role: 'admin' // accessible only for admin roles
      })

      .state('changePassword', {
        url: '/users/change-password',
        component: 'changePassword',
        // role: 'admin' // accessible only for admin roles
      })

      .state('createUser', {
        url: '/users/create',
        component: 'user',
        // role: 'admin' // accessible only for admin roles
      })

      .state('editUser', {
        url: '/users/:userId/edit',
        component: 'user',
        // role: 'admin' // accessible only for admin roles
      })

      .state('displayUser', {
        url: '/users/:userId',
        component: 'user',
        // role: 'admin' // accessible only for admin roles
      });

  }

})();
