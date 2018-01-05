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
    let options = (app.options && app.options[this.name]) || {};


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

      if (options.includeJSPlugins) {

        // Get all available plugins
        let bootstrapPath = path.dirname(
          require.resolve('bootstrap/package.json')
        );
        let pluginFiles = fs.readdirSync(
          path.join( bootstrapPath, 'js', 'dist' )
        );
        let availablePlugins = pluginFiles.map(function( file ){
          return file.split('.')[0]; // remove extensions
        }).reduce(function( files, file ){
          if ( !files.includes( file ) ) files.push( file );
          return files; // return a unique list
        }, []);

        let unavailablePlugins = [];

        // Attempt to import each plugin
        for (let pluginName of options.includeJSPlugins) {
          if (availablePlugins.includes(pluginName)) {
            this.import(
              path.join('node_modules', 'bootstrap', 'js', 'dist', pluginName + '.js')
            );
          } else {
            unavailablePlugins.push(pluginName);
          }
        }

        // Fail if any plugins are unavailable
        if (unavailablePlugins.length > 0) {
          throw new Error(
            `${this.name}: Some 'includeJSPlugins' are not available (${unavailablePlugins.join(', ')}), ` +
            `not listed as an option from bootstrap; ${availablePlugins.join(', ')}.`
          );
        }

      } else { // import all bootstrap plugins
        this.import(
          path.join('node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.js')
        );
      } // if (options.includeJSPlugins)

    } // if (!options.excludeJS)


    // Include Bootswatch CSS by default, opt-out as an option
    if (!options.excludeCSS) {

      // If not the "default" bootstrap theme,
      // ensure the bootswatch theme exists
      if (options.theme !== 'default') {

        let bootswatchPath = path.dirname(
          require.resolve('bootswatch/package.json')
        );

        let availableThemes = fs.readdirSync(
          path.join( bootswatchPath, 'dist' )
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
      let themePath = (
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
