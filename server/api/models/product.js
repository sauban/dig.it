;(function() {

    'use strict';
  
    /**
     * Define product model
     */
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var mongoosePaginate = require('mongoose-paginate');
  
    /**
     * Product schema definition
     */
    var productSchema = new Schema({
        name: {
            type: String,
            trim: true,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        imageUrl: {
            type: String,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date
        }
    });
  
    /**
     * On every save...
     */
  
    productSchema.pre('findOneAndUpdate', function(next) {
      var product = this;
  
      // update updateAt value
      var currentDate = new Date();
      product.update({}, { $set: { updatedAt: currentDate } });
      next();
    });
  
  
    /**
     * Schema plugins
     */
    productSchema.plugin(mongoosePaginate);
    
    productSchema.index({'$**': 'text'});

    // create model
    var Product = mongoose.model('Product', productSchema);
  
    // public
    module.exports = Product;
  
  })();
  