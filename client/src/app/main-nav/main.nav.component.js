;(function() {

  'use strict';

  /**
   * Main navigation
   *
   * @example
   * <main-nav><main-nav/>
   *
   */
  angular
    .module('digitApp')
    .component('mainNav', {
      templateUrl: 'app/main-nav/main-nav.html',
      controllerAs: 'vm',
      controller: MainNavCtrl
    });

    MainNavCtrl.$inject = ['$scope', 'localStorage', 'ngDialog', '$rootScope'];

    /// definition

    function MainNavCtrl($scope, localStorage, ngDialog, $rootScope) {
      var vm = this;
      vm.user = localStorage.get('user');
      vm.logout = logout;

      /// definitions

      /**
       * Events
       */
      $scope.$on('user:login', function() {
        vm.user = localStorage.get('user');
      });

      $scope.$on('user:logout', function() {
        vm.user = null;
      });

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
    }

})();
