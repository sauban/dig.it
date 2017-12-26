// const productController = require('../controllers/product');
// const passportConfig = require('../config/passport');

// controllers
const productsCtrl = require('../controllers').product;

const middlewares = require('../middlewares');


module.exports = (router) => {
  'use strict';

  /**
   * Products
   */

  router.post('/products', 
  middlewares.verifyToken, 
  productsCtrl.createProduct); // create new product

  router.get('/products/', 
    middlewares.verifyToken, 
    /*productsCtrl.isAdmin,*/ // get all products (uncomment productsCtrl.isAdmin if the route should work only for admin roles)
    productsCtrl.getProducts); 

  router.get('/products/:productId', 
        middlewares.verifyToken, 
        productsCtrl.getProduct); // get product
        
  router.put('/products/:productId', 
    middlewares.verifyToken, 
    productsCtrl.updateProduct);

  router.get('/my-products', 
    middlewares.verifyToken, 
    productsCtrl.getUserProducts);

  router.get('/search-products', 
    middlewares.verifyToken, 
    productsCtrl.searchProducts);
};
