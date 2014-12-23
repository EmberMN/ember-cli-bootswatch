module.exports = {
  description: 'Add bower dependencies for bootstrap and bootswatch to the project',

  normalizeEntityName: function() {
    // allows us to run ember -g ember-cli-bootswatch and not blow up
    // because ember cli normally expects the format
    // ember generate <entitiyName> <blueprint>
  },

  afterInstall: function(options) {
    return this.addBowerPackagesToProject([
      {name: 'bootstrap', target: '^3.3.1'},
      {name: 'bootswatch', target: '^3.3.1'}
    ]);
  }

};
