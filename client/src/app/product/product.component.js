;(function() {

  'use strict';

  angular
    .module('digitApp')
    .component('product', {
      bindings: {
        productId: '<'
      },
      templateUrl: 'app/product/product.html',
      controllerAs: 'vm',
      controller: ProductCtrl
    });

  ProductCtrl.$inject = ['$log', '$state', '$stateParams', 'QueryService', 'localStorage', 'utils',
    'ngDialog'];

  function ProductCtrl($log, $state, $stateParams, QueryService, localStorage, utils,
      ngDialog) {
    var vm = this;

    // methods
    vm.createProduct = createProduct;
    vm.editProduct = editProduct;
    vm.submitProductForm = submitProductForm;

    vm.$onInit = function() {
      var productId = vm.productId || $stateParams.productId;
      var state = $state.current.name;
      vm.currentProduct = localStorage.get('product');
      vm.product = vm.product || {};

      setActionType(state, productId);

      if (productId)
        getProduct(productId);
    };

    /// definitions

    /**
     * Set action type
     */
    function setActionType(state, productId) {
      if (state == 'editProduct')
        vm.actionType = 'editProduct';
      else if (!productId && state != 'editProduct')
        vm.actionType = 'createProduct';
      else
        vm.actionType = 'loadProduct';

      return vm.actionType;
    }


    /**
     * Submit form: either create or edit product
     */
    function submitProductForm(product, productId) {
      vm[vm.actionType](product, productId);
    }

    /**
     * Create new product
     * @param  {object} product Product form
     * @return {object}      Promise
     */
    function createProduct(product) {
      if (!product) return;

      QueryService
        .query('POST', 'products/', null, product)
        .then(function(newProduct) {
          vm.newProduct = newProduct.data.data;
          $log.debug('newProduct', vm.newProduct);

          var dialog = ngDialog.open({
            template: '\
              <p>New product created</p>\
              <div class="ngdialog-buttons">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog(\'ok\')">OK</button>\
              </div>',
            plain: true
          });

          dialog.closePromise.then(function(closedDialog) {
            $state.go('displayProduct', { productId: vm.newProduct._id });
          });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    /**
     * Update product attributes
     * @param  {object} editProduct Product form
     * @return {object}            Promise
     */
    function editProduct(product, productId) {
      if (!product) return;

      QueryService
        .query('PUT', 'products/' + productId, null, product)
        .then(function(updatedProduct) {
          vm.updatedProduct = updatedProduct.data.data;
          $log.debug('updatedProduct', vm.updatedProduct);

          ngDialog.open({
            template: '\
              <p>Update successful!</p>\
              <div class=\"ngdialog-buttons\">\
                  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=\"closeThisDialog()\">OK</button>\
              </div>',
            plain: true
          });

        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

    /**
     * Get product
     * @param  {object} productId Product ID
     * @return {object}      Promise
     */
    function getProduct(productId) {
      if (!productId) return;

      QueryService
        .query('GET', 'products/' + productId, null, null)
        .then(function(product) {
          vm.product = product.data.data;
          $log.debug('product', vm.product);
        })
        .catch(function(err) {
          $log.debug(err);
        });
    }

  }

})();
