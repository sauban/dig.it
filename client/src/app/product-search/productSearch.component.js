;(function() {

  'use strict';

  /**
   * Show product search table
   *
   * @usage <product-search products="vm.products"></product-search>
   */

  angular
    .module('digitApp')
    .component('productSearch', {
      templateUrl: 'app/product-search/product-search.html',
      controllerAs: 'vm',
      controller: ProductSearchCtrl
    });

  ProductSearchCtrl.$inject = ['$log', 'QueryService'];

  function ProductSearchCtrl($log, QueryService) {
    var vm = this;
    vm.onSearch = onSubmit;

    vm.$onInit = function() {
      vm.product = {};
    };

    /// definitions

    /**
     * Get products
     */

    function onSubmit(text) {
      QueryService
      .query('GET', 'search-products/', { searchText: text }, null)
      .then(function(product) {
        vm.products = product.data.data;
        $log.debug('products', vm.products);
      })
      .catch(function(err) {
        $log.debug(err);
      });
    }
  }

})();
