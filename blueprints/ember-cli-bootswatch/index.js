module.exports = {
  description: 'Add bower dependencies for bootstrap and bootswatch to the project'

  afterInstall: function(options) {
    return this.addBowerPackagesToProject([
      {name: 'bootstrap', target: '^3.3.1'},
      {name: 'bootswatch', target: '^3.3.1'}
    ]);
  }

};
