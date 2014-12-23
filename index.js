/* jshint node: true */
'use strict';


// module requirements
var chalk = require('chalk');
var fs    = require('fs');


module.exports = {
  name: 'ember-cli-bootswatch',


  included: function(app) {


    // Addon options from the apps Brocfile.js
    var options = app.options[this.name] || {};


    // Options can just be a string of the theme,
    // if so, convert to object and set the theme
    if (typeof options === 'string') {
      options = {'theme':options};
    }


    // Other local variables needed
    var bootstrapPath  = app.bowerDirectory + '/bootstrap/dist';
    var bootswatchPath = app.bowerDirectory + '/bootswatch';
    var themePath      = bootswatchPath + '/' + options.theme;


    // Make sure bootswatch is available
    if (!fs.existsSync(bootswatchPath)) {
      throw new Error(chalk.red(
        this.name + ': Bootswatch is not available from bower (' + bootswatchPath + '), ' +
        'install into your project by `bower install bootswatch --save`'
      ));
    }


    // Make sure bootstrap is available
    if (!options.excludeJS && !fs.existsSync(bootstrapPath)) {
      throw new Error(chalk.red(
        this.name + ': Bootstrap is not available from bower (' + bootstrapPath + '), ' +
        'install into your project by `bower install bootstrap --save`'
      ));
    }


    // Detect ember-cli-bootstrap addon
    if (app.project.addonPackages['ember-cli-bootstrap']) {


      // Get bootstrap specific options
      var bootstrapOptions = app.options['ember-cli-bootstrap'] || {};


      // Both addons should not include bootstrap.js
      if (!options.excludeJS && bootstrapOptions.importBootstrapJS) {
        console.error(chalk.red(
          this.name + ': bootstrap.js is already being imported by ember-cli-bootstrap, ' +
          'disable by setting `"importBootstrapJS":false` for the "ember-cli-bootstrap" options in your Brocfile.js'
        ));
      }


      // Bootstrap default css should not be included since bootswatch themes include this
      if (bootstrapOptions.importBootstrapCSS !== false) {
        console.error(chalk.red(
          this.name + ': bootstrap.css is being imported by ember-cli-bootstrap, ' +
          'disable by setting `"importBootstrapCSS":false` for the "ember-cli-bootstrap" options in your Brocfile.js'
        ));
      }


      // Bootstraps default theme should not be included since bootswatch is used..
      if (bootstrapOptions.importBootstrapTheme) {
        console.error(chalk.red(
          this.name + ': bootstrap-theme.css is being imported by ember-cli-bootstrap, ' +
          'disable by setting `"importBootstrapTheme":false` for the "ember-cli-bootstrap" options in your Brocfile.js'
        ));
      }


      // Both addons should not include the fonts
      // Note: importBootstrapFont is a new option, in the past fonts were included by default
      if (!options.excludeFonts && bootstrapOptions.importBootstrapFont !== false) {
        console.error(chalk.red(
          this.name + ': Bootstrap fonts are already being imported by ember-cli-bootstrap, ' +
          'disable by setting `"importBootstrapFont":false` for the "ember-cli-bootstrap" options in your Brocfile.js'
        ));
      }


    } // if (!!app.project.addonPackages['ember-cli-bootstrap'])


    // Theme option is required
    if (!options.theme) {
      throw new Error(chalk.red(
        this.name + ': Theme is required, please define `"theme":"theme-name"`' +
        ' for the "' + this.name + '" options in your Brocfile.js'
      ));
    }


    // Fail if theme does not exist
    if (!fs.existsSync(themePath)) {
      throw new Error(chalk.red(
        this.name + ': Theme (' + options.theme + ') is not available, directory not found [' + themePath + ']'
      ));
    }


    // Include bootstrap fonts by default, opt-out option
    if (!options.excludeFonts) {


      // Get all of the font files
      var fontsToImport = fs.readdirSync(bootswatchPath + '/fonts');
      var filesInFonts  = []; // Bucket for filenames already in the fonts folder
      var fontsSkipped  = []; // Bucket for fonts not imported because they already have been


      // Find files already imported into the fonts folder
      app.otherAssetPaths.forEach(function(asset){
        if (asset.dest == '/fonts') {
          filesInFonts.push(asset.file);
        }
      });


      // Attempt to import each font, if not already imported
      fontsToImport.forEach(function(fontFilename){
        if (filesInFonts.indexOf(fontFilename) > -1) {
          fontsSkipped.push(fontFilename);
        } else {
          app.import(bootswatchPath + '/fonts/' + fontFilename, {destDir:'/fonts'});
        }
      });


      // Fonts that had already been imported, so bootswatch skipped..
      // But do not error if bootstrap option incorrect, already logged similar error
      if (fontsSkipped.length) {
        console.error(chalk.red(
          this.name + ': Fonts already imported [' + fontsSkipped.join(', ') +
          '] by another addon (possibly ember-cli-bootstrap) or in your Brocfile.js, ' +
          'disable the import from other locations or disable the bootswatch import by setting ' +
          '`"excludeFonts":true` for the "' + this.name + '" options in your Brocfile.js'
        ));
      }


    } // if (!options.excludeFonts)


    // Include bootstrap js by default, opt-out option
    if (!options.excludeJS) {
      app.import({
        development: bootstrapPath + '/js/bootstrap.js',
        production:  bootstrapPath + '/js/bootstrap.min.js'
      });
    }


    // Import bootswatch theme into vendor tree
    app.import({
      development: themePath + '/bootstrap.css',
      production:  themePath + '/bootstrap.min.css'
    });


  } // :included


}; // module.exports
