ember-cli-bootswatch [![Ember Observer Score](https://emberobserver.com/badges/ember-cli-bootswatch.svg)](https://emberobserver.com/addons/ember-cli-bootswatch)
====================

An [ember-cli addon](http://www.emberaddons.com/) to import a [Bootswatch](http://bootswatch.com/)
or [Bootstrap](http://getbootstrap.com/) theme, including the fonts and
JavaScript. This addon is only meant to import the related bower files and
does NOT contain [Ember Components](https://guides.emberjs.com/v2.13.0/components/defining-a-component/)
to use within your templates. Other addons provide those features,
[look at emberobserver.com](https://www.emberobserver.com/categories/bootstrap) for
those.

_Note, this addon scores low on [Ember Observer](https://emberobserver.com/addons/ember-cli-bootswatch) because; it's very basic and isn't easily testable (-2 points), and it could use more contributers (-1 point). It is still maintained and works with the latest versions of ember-cli (2.x)!_




## Installation

From within your [ember-cli](http://www.ember-cli.com/) project, run the
following to install the addon and bower dependencies for bootstrap and
bootswatch:

```bash
ember install ember-cli-bootswatch
```

Note: This addon _is_ compatible with ember-cli 2.x




## Configuration


#### Addon Options

Options for this addon are configured in the projects `ember-cli-build.js` file
as an 'ember-cli-bootswatch' object property. Available options include:

* `theme` [string]: Name of the Bootswatch theme to be imported, or `'default'` for the standard Bootstrap theme and `'bootstrap'` for the ["visually enhanced"](http://getbootstrap.com/examples/theme/) Bootstrap theme
* `excludeCSS` [boolean]: By default, the theme's `bootstrap.css` file will be imported
* `excludeJS` [boolean]: By default, the `bootstrap.js` file will be imported from Bootstrap
* `excludeFonts` [boolean]: By default, the [font files](https://github.com/thomaspark/bootswatch/tree/gh-pages/fonts) will be imported

The only required option is the `theme`. If you do not need to adjust
any other options, you can just define a string of the theme name
as the bootswatch options:

```javascript
// ember-cli-build.js
/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'ember-cli-bootswatch': 'cerulean'
  });

  // ... (documentation snipped)

  return app.toTree();
};
```

If multiple options need to be adjusted then you'll need to specify each
option as an object property:

```javascript
// ember-cli-build.js
/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'ember-cli-bootswatch': {
      'theme': 'cerulean',
      'excludeJS': true
    }
  });

  // ... (documentation snipped)

  return app.toTree();
};
```


#### Bootswatch Version

Use [bower to change the version](http://bower.io/docs/api/#install) of
Bootswatch and Bootstrap that is imported. Be sure to save the new version
to your `bower.json` file as well. Ex:

```bash
bower install --save bootswatch#2.3.2 bootstrap#2.3.2
```


#### Usage with ember-cli-less

Bootstrap and Bootswatch both come with [Less](http://lesscss.org/) files
which you can use with your project instead of the default CSS files. Typically
you wouldn't do this unless you are already using Less in your project
elsewhere. You'll need to exclude thedefault CSS files, include the bower
paths, and finally import the Less files. Ex:

```javascript
// ember-cli-build.js
/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    "ember-cli-bootswatch": {
      theme: "cerulean",
      excludeCSS: true
    },
    lessOptions: {
      paths: [
        "bower_components/bootstrap/less",
        "bower_components/bootswatch"
      ]
    }
  });

  // ... (documentation snipped)

  return app.toTree();
};
```

```less
// app/styles/app.less
@import "bootstrap";
@import "themeName/variables";
@import "themeName/bootswatch";
```




## Usage with other Bootstrap addons

Other Bootstrap addons should be configured NOT to import Bootstrap files
(styles, themes, fonts, etc.) This way files imported by ember-cli-bootswatch
do not conflict with other files and versions. But at the same time, if another
addon requires their own version of a core file (such as JavaScript), then disable
the import from Bootswatch.
