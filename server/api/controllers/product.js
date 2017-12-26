;(function() {

    'use strict';
  
    /**
     * Products endpoint controller
     * @desc Handler functions for all /products routes
     */
    var mongoose = require('mongoose');
    var ObjectId = mongoose.Types.ObjectId;
    var Product = require('../models').PRODUCT;
  
    var utils = require('../utils/utils.js');
  
  
    // public
    module.exports = {
      createProduct,
      getProducts,
      getProduct,
      updateProduct,
      getUserProducts,
      searchProducts
    };
  
    /// definitions
  
    /**
     * Create new product
     * POST '/products'
     */
    function createProduct(req, res, next) {
  
      // req params validation for required fields
      req.checkBody('name', 'Name must be defined').notEmpty();
      req.checkBody('price', 'Price must be defined').notEmpty();
  
      // validate product input
      var errors = req.validationErrors();
      if (errors) {
          utils.sendJSONresponse(res, 400, errors);
          return;
      }

      var params = Object.assign({}, req.body, {
            owner: ObjectId(req.user._id)
        });
        var product = new Product(params);
  
      product.save((err, newProduct) => {
        if (err) return next({ err: err, status: 400 });
        if (!newProduct) return next({ message: 'Product not created.', status: 400 });
  
        utils.sendJSONresponse(res, 201, newProduct);
      });
    }


    /**
     * Search Product Endpoint
     */
  
    function searchProducts(req, res, next) {
        var page = req.query.page || 1;
        var limit = req.query.limit || 10;
        var searchString = req.query.searchText || '';

        var options = {
            page: page,
            limit: limit,
            lean: true
        };
    
        Product.paginate({
            $text: {
                $search: searchString
            }
        }, options, (err, products) => {
          if (err) return next(err);
          if (!products) return next({
            message: 'No products found.',
            status: 404
          });
    
          var pagination = {
            pageNumber: products.page,
            itemsPerPage: products.limit,
            prev: res.locals.paginate.href(true),
            next: res.locals.paginate.href(),
          };
    
          utils.sendJSONresponse(res, 200, products, false, pagination);
        });
      }
    
    /**
     * Get products (paginated)
     * GET '/my-products'
     */
    function getUserProducts(req, res, next) {
        var page = req.query.page || 1;
        var limit = req.query.limit || 10;
    
        var options = {
            page: page,
            limit: limit,
            lean: true
        };
    
        Product.paginate({
            owner: ObjectId(req.user._id)
        }, options, (err, products) => {
          if (err) return next(err);
          if (!products) return next({
            message: 'No products found.',
            status: 404
          });
    
          var pagination = {
            pageNumber: products.page,
            itemsPerPage: products.limit,
            prev: res.locals.paginate.href(true),
            next: res.locals.paginate.href(),
          };
    
          utils.sendJSONresponse(res, 200, products, false, pagination);
        });
      }

  
    /**
     * Get products (paginated)
     * GET '/products/'
     */
    function getProducts(req, res, next) {
      var page = req.query.page || 1;
      var limit = req.query.limit || 10;
  
      var options = {
          page: page,
          limit: limit,
          lean: true
      };
  
      Product.paginate({}, options, (err, products) => {
        if (err) return next(err);
        if (!products) return next({
          message: 'No products found.',
          status: 404
        });
  
        var pagination = {
          pageNumber: products.page,
          itemsPerPage: products.limit,
          prev: res.locals.paginate.href(true),
          next: res.locals.paginate.href(),
        };
  
        utils.sendJSONresponse(res, 200, products, false, pagination);
      });
    }
  
    /**
     * Get product
     * GET '/products/:productId'
     */
    function getProduct(req, res, next) {
      var params = req.params;
  
      Product
        .findOne({ '_id': ObjectId(params.productId) }, { password: 0, __v: 0 })
        .exec((err, product) => {
          if (err) return next(err);
          if (!product) return next({
            message: 'Product not found.',
            status: 404
          });
  
          utils.sendJSONresponse(res, 200, product);
        });
    }
  
    /**
     * Update product
     * PUT '/products/:productId'
     */
    function updateProduct(req, res, next) {
      var bodyParams = req.body;
      var currentProduct = req.product;
  
      Product
        .findOneAndUpdate(
          { _id: ObjectId(currentProduct._id) },
          { '$set': {
            'firstName': bodyParams.firstName,
            'surname': bodyParams.surname,
            'email': bodyParams.email,
            'role': bodyParams.role,
            }
          },
          { upsert: false, new: true, fields: { password: 0 }, runValidators: true, setDefaultsOnInsert: true })
        .exec((err, product) => {
          if (err) return next({ err: err, status: 400 });
          if (!product) return next({
            message: 'Product not found.',
            status: 404
          });
  
          utils.sendJSONresponse(res, 200, product);
        });
    }
  
  })();
  