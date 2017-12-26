var fs = require('fs');

/*
 * initializes all controllers and sources them as .controller-name
 */
fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js') {
    var moduleName = file.split('.')[0];
    exports[moduleName] = require('./' + moduleName);
  }
});