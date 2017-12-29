/* eslint-env node */
'use strict';


// module requirements
var fs   = require('fs');
var path = require('path');


module.exports = {
  name: 'ember-cli-bootswatch',


  included(app) {
    this._super.included.apply(this, arguments);


    // Addon options from the apps ember-cli-build.js
    var options = (app.options && app.options[this.name]) || {};


    // Options can just be a string of the theme,
    // if so, convert to object and set the theme
    if (typeof options === 'string') {
      options = {'theme':options};
    }


    // Set a default theme if none specified
    if (!options.theme) {
      options.theme = 'default';
      console.log(
        `${this.name}: No theme specified, defaulting to the standard Bootstrap theme. ` +
        `Define a "${this.name}":"theme-name" in your 'ember-cli-build.js' to get rid of this message.`
      );
    }


    // Friendly message if the addon will not do anything
    if (options.excludeJS && options.excludeCSS) {
      console.error(
        `${this.name}: All exclude options are enabled (excludeCSS, excludeJS). ` +
        'This addon will not import anything into your build tree, which may be intended ' +
        'if you plan on only using Sass files.'
      );
    }


    // Include Bootstrap JavaScript by default, opt-out as an option
    if (!options.excludeJS) {
      this.import(
        path.join('node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.js')
      );
    }


    // Include Bootswatch CSS by default, opt-out as an option
    if (!options.excludeCSS) {

      // If not the "default" bootstrap theme,
      // ensure the bootswatch theme exists
      if (options.theme !== 'default') {

        var nodePath = path.dirname(
          require.resolve('bootswatch/package.json')
        );

        var availableThemes = fs.readdirSync(
          path.join( nodePath, 'dist' )
        );

        // Fail if theme does not exist
        if (!availableThemes.includes(options.theme)) {
          throw new Error(
            `${this.name}: Theme (${options.theme}) is not available, ` +
            ` not listed as an option from bootswatch; default, ${availableThemes.join(', ')}.`
          );
        }

      } // if (options.theme !== 'default')

      // Determine the theme CSS path
      var themePath = (
        options.theme === 'default' ?
        path.join('node_modules', 'bootstrap', 'dist', 'css') :
        path.join('node_modules', 'bootswatch', 'dist', options.theme)
      );

      this.import(
        path.join(themePath, 'bootstrap.css')
      );

    } // if (!options.excludeCSS)


  } // included()


}; // module.exports
