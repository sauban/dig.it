;(function() {

  'use strict';

  /**
   * Show product list table
   *
   * @usage <product-list products="vm.products"></product-list>
   */

  angular
    .module('digitApp')
    .component('productList', {
      bindings: {
        products: '<'
      },
      templateUrl: 'app/product-list/product-list.html',
      controllerAs: 'vm',
      controller: ProductListCtrl
    });

  ProductListCtrl.$inject = ['$log', 'QueryService', '$state'];

  function ProductListCtrl($log, QueryService, $state) {
    var vm = this;

    vm.$onInit = function() {
      if (!vm.products)
        getProducts();
    };

    /// definitions

    /**
     * Get products
     */
    function getProducts() {
      QueryService
        .query('GET', 'my-products/', null, null)
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
