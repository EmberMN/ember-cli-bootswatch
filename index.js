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
      throw new Error(
        this.name + ': Bootswatch is not available from bower (' + bootswatchPath + '), ' +
        'install into your project by `bower install bootswatch --save`'
      );
    }


    // Make sure bootstrap is available
    if (!options.excludeJS && !fs.existsSync(bootstrapPath)) {
      throw new Error(
        this.name + ': Bootstrap is not available from bower (' + bootstrapPath + '), ' +
        'install into your project by `bower install bootstrap --save`'
      );
    }


    // Theme option is required
    if (!options.theme) {
      throw new Error(
        this.name + ': Theme is required, please define `"theme":"theme-name"`' +
        ' for the "' + this.name + '" options in your Brocfile.js'
      );
    }


    // Fail if theme does not exist
    if (!fs.existsSync(themePath)) {
      throw new Error(
        this.name + ': Theme (' + options.theme + ') is not available, directory not found [' + themePath + ']'
      );
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
