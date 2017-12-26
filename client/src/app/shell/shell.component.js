;(function() {

    'use strict';
  
    /**
     * Main navigation
     *
     * @example
     * <shell><shell/>
     *
     */
    angular
      .module('digitApp')
      .component('shell', {
        templateUrl: 'app/shell/shell.html',
        controllerAs: 'vm',
        controller: ShellCtrl
      });
  
      ShellCtrl.$inject = ['$scope', 'localStorage'];
  
      /// definition
  
      function ShellCtrl($scope, localStorage) {
        var vm = this;
        vm.user = localStorage.get('user');
  
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
      }
  
  })();
  