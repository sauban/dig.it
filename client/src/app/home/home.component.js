;(function() {

  'use strict';

  angular
    .module('digitApp')
    .component('home', {
      templateUrl: 'app/home/home.html',
      controllerAs: 'vm',
      controller: HomeCtrl
    });


  HomeCtrl.$inject = [];

  function HomeCtrl() {}

})();
