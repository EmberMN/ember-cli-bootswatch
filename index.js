'use strict';


// module requirements
const fs = require('fs');
const path = require('path');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');


module.exports = {
  name: 'ember-cli-bootswatch',


  defaultOptions: {
    // theme: undefined, // REQUIRED option
    importCSS: true,
    importSass: false, // Auto-detect in `included()`
    importJS: false, // || [array] of plugin names
    importPopperJS: false // Auto-detect in `included()`
  },


  included(app) {
    this._super.included.apply(this, arguments);


    // Do not import anything if in "fastboot mode"
    if ( process.env.EMBER_CLI_FASTBOOT ) {
      return;
    }


    // Addon options from the apps ember-cli-build.js
    let appOptions = (app.options && app.options[this.name]) || {};


    // Options can just be a string of the theme,
    // if so, convert to object and set the theme
    if (typeof appOptions === 'string') {
      appOptions = {'theme':appOptions};
    }


    // Bucket for auto-detected options
    let detectedOptions = {};


    // Detect if a bootstrap plugin depending on Popper.js will be imported
    // http://getbootstrap.com/docs/4.0/getting-started/javascript/#dependencies
    if ( appOptions.importJS === true || (typeof appOptions.importJS === 'array' && (
      appOptions.importJS.includes('dropdown') ||
      appOptions.importJS.includes('popover') ||
      appOptions.importJS.includes('tooltip')
    ))) {
      detectedOptions.importPopperJS = true;
    }


    // Detect if the consuming app has ember-cli-sass installed
    if (app.dependencies().hasOwnProperty('ember-cli-sass')) {
      detectedOptions.importCSS = false;
      detectedOptions.importSass = true;
    }


    // Detect previous options and take those into account
    // Note: These can be removed at some point down the road
    let depreciatedOptions = {};
    if (appOptions.excludeCSS) { // <= 2.0.0-beta.3
      depreciatedOptions.importCSS = false;
      this.ui.writeDeprecateLine(
        `${this.name}: The option 'excludeCSS' has been replaced with 'importCSS'. ` +
        'The previous option has been applied, but please update your options in "ember-cli-build.js".'
      );
    }
    if (typeof appOptions.includeJSPlugins === 'array') { // 2.0.0-beta.1 through 2.0.0-beta.3
      depreciatedOptions.importJS = appOptions.includeJSPlugins;
      this.ui.writeDeprecateLine(
        `${this.name}: The option 'includeJSPlugins' has been merged with 'importJS'. ` +
        'The previous option has been applied, but please update your options in "ember-cli-build.js".'
      );
    }
    if (appOptions.excludeJS) { // <= 2.0.0-beta.3
      depreciatedOptions.importJS = false;
      this.ui.writeDeprecateLine(
        `${this.name}: The option 'excludeJS' has been replaced with 'importJS'. ` +
        'The previous option has been applied, but please update your options in "ember-cli-build.js".'
      );
    }
    if (appOptions.excludeFonts) { // <= 2.0.0-beta.3
      this.ui.writeDeprecateLine(
        `${this.name}: The option 'excludeFonts' has been removed because it does not apply to Bootstrap 4. ` +
        'Please remove that option in your "ember-cli-build.js".'
      );
    }


    // Combine all of the option sets,
    // giving a proper priority order
    let options = Object.assign(
      {},
      this.defaultOptions,
      detectedOptions,
      depreciatedOptions,
      appOptions
    );


    // Set a default theme if none specified
    if (!options.theme) {
      options.theme = 'default';
      this.ui.writeWarnLine(
        `${this.name}: No theme specified, defaulting to the standard Bootstrap theme. ` +
        `Define a "${this.name}":"theme-name" in your 'ember-cli-build.js' to get rid of this message.`
      );
    }


    // Store final option set for use in 'treeForStyles()' below
    this._options = options;


    // Friendly message if the addon will not do anything
    if (!options.importCSS && !options.importSass && !options.importJS && !options.importPopperJS) {
      this.ui.writeError(
        `${this.name}: All importing options are disabled (importCSS, importSass, importJS, importPopperJS). ` +
        'This addon will not import anything into your build tree and effectively does nothing.'
      );
    }


    // Import Bootswatch CSS and/or Sass
    if (options.importCSS || options.importSass) {

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
            `not listed as an option from bootswatch; default, ${availableThemes.join(', ')}.`
          );
        }

      } // if (options.theme !== 'default')

      // Determine the theme CSS path
      let themePath = (
        options.theme === 'default' ?
        path.join('node_modules', 'bootstrap', 'dist', 'css') :
        path.join('node_modules', 'bootswatch', 'dist', options.theme)
      );

      // Import Bootswatch CSS
      if (options.importCSS) {
        this.import(
          path.join(themePath, 'bootstrap.css')
        );
      }

      // Import Bootswatch Sass
      if (options.importSass) {
        // Nothing to do here, treeForStyles() below will handle the rest
      }

    } // if (options.importCSS)


    // Import the Popper.js dependency
    // Note, should probably come before imported bootstrap plugins
    if (options.importPopperJS) {
      this.import(
        path.join('node_modules', 'popper.js', 'dist', 'umd', 'popper.js')
      );
    }


    // Import Bootstrap JS
    if (options.importJS) {

      if (typeof options.importJS === 'array') {

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
          if ( !files.includes(file) ) files.push(file);
          return files; // return a unique list
        }, []);

        let unavailablePlugins = [];

        // Attempt to import each plugin
        for (let pluginName of options.importJS) {
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
            `${this.name}: Some 'importJS' plugins are not available (${unavailablePlugins.join(', ')}), ` +
            `not listed as an option from bootstrap; ${availablePlugins.join(', ')}.`
          );
        }

      } else { // import all bootstrap plugins
        this.import(
          path.join('node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.js')
        );
      } // if (typeof options.importJS === 'array')

    } // if (options.importJS)


  }, // included()


  treeForStyles(/* tree */) {
    let superTree = this._super.treeForStyles.apply(this, arguments);

    // Do not continue if *.scss files are not needed
    if (!this._options.importSass) {
      return superTree;
    }

    let bootstrapPath = path.dirname(
      require.resolve('bootstrap/package.json')
    );

    let bootstrapTree = Funnel(
      path.join(bootstrapPath, 'scss'),
      { include: ['**/*.scss'], destDir: `${this.name}/bootstrap` }
    );

    // 'default' theme only uses bootstrap, no need for bootswatch (next)
    if (this._options.theme === 'default') {
      return MergeTrees([superTree, bootstrapTree]);
    }

    let bootswatchPath = path.dirname(
      require.resolve('bootswatch/package.json')
    );

    let bootswatchTree = Funnel(
      path.join(bootswatchPath, 'dist', this._options.theme),
      { include: ['**/*.scss'], destDir: `${this.name}/bootswatch` }
    );

    return MergeTrees([superTree, bootstrapTree, bootswatchTree]);
  } // treeForStyles()


}; // module.exports
