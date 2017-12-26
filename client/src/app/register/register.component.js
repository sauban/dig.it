(function() {
  
  'use strict';

  angular
    .module('digitApp')
    .component('register', {
      templateUrl: 'app/register/register.html',
      controllerAs: 'vm',
      controller: RegisterCtrl
    });

  RegisterCtrl.$inject = ['$log', 'QueryService', 'localStorage', 'ngDialog', '$rootScope', 'toaster', '$state'];

  function RegisterCtrl($log, QueryService, localStorage, ngDialog, $rootScope, toaster, $state) {
    var vm = this;

    // methods
    vm.submitUserForm = submitUserForm;

    vm.$onInit = function() {
      vm.user = {};
    };

    /**
     * Create new user
     * @param  {object} user User form
     * @return {object}      Promise
     */
    function submitUserForm(user) {
      if (!user) return;
      user.role = 'user';

      QueryService
          .query('POST', 'auth/register', null, user)
          .then(function(resp) {
            vm.user = resp.data.data;
            localStorage.set('user', vm.user);
            $rootScope.$broadcast('user:login');
            $state.go('product');
          })
          .catch(function(error) {
            $log.debug(error);
            var errCode = error.data && error.data.error && error.data.error.code;
            toaster.pop('error', error.data);
          });
    }

  }

})();
