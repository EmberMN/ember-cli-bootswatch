ember-cli-bootswatch [![Ember Observer Score](https://emberobserver.com/badges/ember-cli-bootswatch.svg)](https://emberobserver.com/addons/ember-cli-bootswatch)
====================

An [ember-cli addon](http://www.emberaddons.com/) to import a [Bootswatch](http://bootswatch.com/)
theme or the [Bootstrap](http://getbootstrap.com/) theme, including the JavaScript plugins if desired.
This addon is only meant to import the appropriate assets and does NOT contain
[Ember Components](https://guides.emberjs.com/v2.17.0/components/defining-a-component/)
to use within your templates. Other addons provide those features, such as
[ember-bootstrap](http://www.ember-bootstrap.com/) or
[visit emberobserver.com](https://www.emberobserver.com/categories/bootstrap) for others.

_Note, this addon scores low on [Ember Observer](https://emberobserver.com/addons/ember-cli-bootswatch) because; it's very basic and isn't easily testable (-2 points), and it could use more contributers (-1 point). It is still maintained and works with the latest versions of ember-cli (2.x)!_




## Compatibility

This addon has a version break for the Bootstrap version and ember-cli requirements.

| Addon Version | Bootstrap Version | ember-cli Version | Dependencies    |
|---------------|-------------------|-------------------|-----------------|
| 1.x           | 3.x               | 1.13+             | Uses bower deps |
| 2.x           | 4.x               | 2.15+             | Uses npm deps   |




## Installation

From within your [ember-cli](http://www.ember-cli.com/) project,
run the following to install this addon:

```bash
ember install ember-cli-bootswatch
```




## Configuration


#### Addon Options

Options for this addon are configured in the projects `ember-cli-build.js` file
as an `'ember-cli-bootswatch'` object property. Available options include:

| Option             | Type    | Default       | Description |
|--------------------|---------|---------------|-------------|
| `theme`            | string  | *required*    | Name of the Bootswatch theme to be imported, or `'default'` for the standard Bootstap theme |
| `excludeCSS`       | boolean | `false`       | By default, the theme's `bootstrap.css` file will be imported |
| `excludeJS`        | boolean | `false`       | By default, the `bootstrap.js` file will be imported from Bootstrap |
| `includeJSPlugins` | array   | *all plugins* | Limit which JavaScript plugins are imported, list only the plugin name, without `.js` or `.min.js` |

The only required option is the `theme`. If you do not need to adjust
any other options, you can just define a string of the theme name
as the ember-cli-bootswatch option:

```javascript
// ember-cli-build.js
/* eslint-env node */
'use strict';

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
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'ember-cli-bootswatch': {
      theme: 'cerulean',
      includeJSPlugins: ['button','tooltip']
    }
  });

  // ... (documentation snipped)

  return app.toTree();
};
```




## Usage with other Bootstrap addons

You can certainly use this addon to just bring in a Bootswatch theme
but still use components and such from other addons. However, other
Bootstrap addon's that also import a theme should be configured NOT
to do so. This way files imported by ember-cli-bootswatch do not
conflict with other files and versions.

For example, using this addon with `ember-bootstrap`:

```javascript
// ember-cli-build.js
/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'ember-cli-bootswatch': {
      theme: 'cerulean',
      excludeJS: true
    },
    'ember-bootstrap': {
      importBootstrapCSS: false
    }
  });

  // ... (documentation snipped)

  return app.toTree();
};
```
