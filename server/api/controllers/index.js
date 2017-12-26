var fs = require('fs');

/*
 * initializes all controllers and sources them as .controller-name
 */
fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var ctrlName = file.split('.')[0];
    exports[ctrlName] = require('./' + ctrlName);
  }
});