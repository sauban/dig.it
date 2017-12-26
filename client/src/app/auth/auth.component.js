;(function() {

  'use strict';

  angular
    .module('digitApp')
    .component('auth', {
      templateUrl: 'app/auth/auth.html',
      controllerAs: 'vm',
      controller: AuthCtrl
    });

  AuthCtrl.$inject = ['$rootScope', '$scope', '$log', 'QueryService', 'ngDialog',
    'localStorage', '$state', 'socket', 'toaster'];

  function AuthCtrl($rootScope, $scope, $log, QueryService, ngDialog,
    localStorage, $state, socket, toaster) {
      var vm = this;
      vm.login = login;
      vm.logout = logout;
      vm.user = localStorage.get('user');

      vm.$onInit = function() {
        // just an socket.io message example
        socket.on('user:loggedIn', function(newUser) {
          $log.debug('incominng websocket message from ExpressJS server: some user just authenticated!');
        });
      };

      /// definitions

      function login() {
        var params = {
          username: vm.username,
          password: vm.password
        };

        QueryService
          .query('POST', 'auth/login', null, params)
          .then(function(resp) {
            vm.user = resp.data.data;
            localStorage.set('user', vm.user);
            $rootScope.$broadcast('user:login');
          })
          .catch(function(error) {
            var errCode = error.data && error.data.error && error.data.error.code;

            if (errCode == 'wrongCredentials') {
              toaster.pop({
                type: 'error',
                body: 'Wrong username or password. Try again please.'
              });
            } else {
              toaster.pop({
                type: 'error',
                body: 'Unknown server error.'
              });
            }
 
          });
      }

      function logout() {
        var dialog = ngDialog.open({
          template: '\
            <p>Do you really want to log out?</p>\
            <div class="ngdialog-buttons">\
                <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">No</button>\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'logout\')">Yes</button>\
            </div>',
          plain: true
        });

        // log out user after confirmation
        dialog.closePromise.then(function(closedDialog) {
          if (closedDialog.value == 'logout')
            $rootScope.$broadcast('user:logout');
        });
      }

      $scope.$on('user:logout', function() {
        vm.user = null;
      });

  }

})();
