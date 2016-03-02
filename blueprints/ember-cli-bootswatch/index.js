/*jshint node:true*/

module.exports = {
  description: '',

  afterInstall: function(options) {
    return this.addBowerPackagesToProject([
      {name: 'bootstrap', target: '^3.3.6'},
      {name: 'bootswatch', target: '^3.3.6'}
    ]);
  } // :afterInstall

}; // module.exports
