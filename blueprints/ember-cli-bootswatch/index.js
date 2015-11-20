module.exports = {
  description: 'Add bower dependencies for bootstrap and bootswatch to the project',

  normalizeEntityName: function() {
    // allows us to run ember -g ember-cli-bootswatch and not blow up
    // because ember cli normally expects the format
    // ember generate <entitiyName> <blueprint>
  },

  afterInstall: function(options) {
    var addon = this;

    // Ability to add multiple bower packages introduced in ember-cli 0.1.2
    if (addon.addBowerPackagesToProject) {
      return addon.addBowerPackagesToProject([
        {name: 'bootstrap', target: '^3.3.5'},
        {name: 'bootswatch', target: '^3.3.5'}
      ]);
    } else { // Else need to add them individually
      return addon.addBowerPackageToProject('bootstrap', '^3.3.5').then(function(){
        return addon.addBowerPackageToProject('bootswatch', '^3.3.5');
      });
    }

  } // :afterInstall

};
