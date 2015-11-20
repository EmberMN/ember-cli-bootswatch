/* jshint node: true */
'use strict';


// module requirements
var chalk = require('chalk');
var fs    = require('fs');


module.exports = {
  name: 'ember-cli-bootswatch',


  included: function(app) {
    // Per the ADDON_HOOKS.md document
    // https://github.com/ember-cli/ember-cli/blob/master/ADDON_HOOKS.md#included
    this._super.included.apply(this, arguments);


    // Addon options from the apps ember-cli-build.js
    var options = app.options[this.name] || {};


    // Options can just be a string of the theme,
    // if so, convert to object and set the theme
    if (typeof options === 'string') {
      options = {'theme':options};
    }


    // Set a default theme if none specified
    if (!options.theme) {
      options.theme = 'default';
      console.log(
        this.name + ': No theme specified, defaulting to the "default" Bootstrap theme. ' +
        'Define `"theme":"theme-name"` for the "' + this.name + '" options in your ' +
        'ember-cli-build.js to get rid of this message.'
      );
    }


    // Other local variables needed
    var bootstrapPath  = app.bowerDirectory + '/bootstrap/dist';
    var bootswatchPath = app.bowerDirectory + '/bootswatch';
    var themePath      = (options.theme === 'default' || options.theme === 'bootstrap' ? bootstrapPath + '/css' : bootswatchPath + '/' + options.theme);
    var fontsPath      = (options.theme === 'default' || options.theme === 'bootstrap' ? bootstrapPath + '/fonts' : bootswatchPath + '/fonts');


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


    // Fail if theme does not exist
    if (!fs.existsSync(themePath)) {
      throw new Error(
        this.name + ': Theme (' + options.theme + ') is not available, directory not found [' + themePath + ']'
      );
    }


    // Friendly message if the addon will not do anything
    if (options.excludeFonts && options.excludeJS && options.excludeCSS) {
      console.error(chalk.red(
        this.name + ': All exclude options are enabled (excludeCSS, excludeJS, excludeFonts). ' +
        'This addon will not import anything into your build tree, which may be intended if ' +
        'you plan on only using Sass or Less files.'
      ));
    }


    // Include bootstrap fonts by default, opt-out option
    if (!options.excludeFonts) {


      // Get all of the font files
      var fontsToImport = fs.readdirSync(fontsPath);
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
          app.import(fontsPath + '/' + fontFilename, {destDir:'/fonts'});
        }
      });


      // Fonts that had already been imported, so bootswatch skipped..
      // But do not error if bootstrap option incorrect, already logged similar error
      if (fontsSkipped.length) {
        console.error(chalk.red(
          this.name + ': Fonts already imported [' + fontsSkipped.join(', ') +
          '] by another addon or in your ember-cli-build.js, disable the import ' +
          'from other locations or disable the bootswatch import by setting ' +
          '`"excludeFonts":true` for the "' + this.name + '" options in your ember-cli-build.js'
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


    // Include bootswatch css by default, opt-out option
    if (!options.excludeCSS) {
      app.import({
        development: themePath + '/bootstrap.css',
        production:  themePath + '/bootstrap.min.css'
      });

      // The 'bootstrap' theme also needs another file
      if (options.theme === 'bootstrap') {
        app.import({
          development: themePath + '/bootstrap-theme.css',
          production:  themePath + '/bootstrap-theme.min.css'
        });
      }

    } // if (!options.excludeCSS)


  } // :included


}; // module.exports
