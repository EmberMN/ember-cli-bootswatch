ember-cli-bootswatch [![Ember Observer Score](https://emberobserver.com/badges/ember-cli-bootswatch.svg)](https://emberobserver.com/addons/ember-cli-bootswatch)
====================

> An [ember-cli addon](http://www.emberaddons.com/) to import a [Bootswatch](http://bootswatch.com/)
theme or the [Bootstrap](http://getbootstrap.com/) theme, including the JavaScript plugins if desired.
This addon is only meant to import the appropriate assets and does NOT contain
[Ember Components](https://guides.emberjs.com/v3.0.0/components/defining-a-component/)
to use within your templates. Other addons provide those features, such as
[ember-bootstrap](http://www.ember-bootstrap.com/) or
[visit emberobserver.com](https://www.emberobserver.com/categories/bootstrap) for others.

_Note, this addon scores low on [Ember Observer](https://emberobserver.com/addons/ember-cli-bootswatch) because; it's very basic and isn't easily testable (-2 points), and it could use more contributers (-1 point). It is still maintained and works with the latest versions of ember-cli!_




## Compatibility

This addon has a version break for the Bootstrap version and ember-cli requirements.

| Addon Version | Bootstrap Version | ember-cli Version | Node Version  | Dependencies    |
|---------------|-------------------|-------------------|---------------|-----------------|
| 1.x           | 3.x               | 1.13+             | 4.0+          | Uses bower deps |
| 2.x           | 4.x               | 2.15+             | 6.0+          | Uses npm deps   |




## Installation

From within your [ember-cli](http://www.ember-cli.com/) project,
run the following to install this addon:

```bash
ember install ember-cli-bootswatch
```




## Configuration

Options for this addon are configured in the projects `ember-cli-build.js` file
as an `'ember-cli-bootswatch'` object property. Available options include:

| Option           | Type             | Default    | Description |
|------------------|------------------|------------|-------------|
| `theme`          | string           | *required* | Name of the Bootswatch theme to be imported, or `'default'` for the standard Bootstap theme |
| `importCSS`      | boolean          | `true`**   | Import the theme's `bootstrap.css` file into your `vendor.css` file. **Automatically disabled if `ember-cli-sass` is detected in the app. |
| `importSass`     | boolean          | `false`**  | Import the theme's `*.scss` files into the styles tree. **Automatically enabled if `ember-cli-sass` is detected in the app. |
| `importJS`       | boolean or array | `false`    | Import the `bootstrap.js` file (`true`) or specific Bootstrap plugins (`array`) into your `vendor.js` file |
| `importPopperJS` | boolean          | `false`**  | Import the [Popper.js dependency](http://getbootstrap.com/docs/4.0/getting-started/javascript/#dependencies) into your `vendor.js` file. **Automatically enabled if `importJS = true` or `importJS = []` with a plugin that needs Popper.js. |

The only required option is the `theme`. If you do not need to adjust
any other options, you can just define a string of the theme name
as the ember-cli-bootswatch option:

```javascript
// ember-cli-build.js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
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
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-bootswatch': {
      theme: 'cerulean',
      importJS: ['button','tooltip']
    }
  });

  // ... (documentation snipped)

  return app.toTree();
};
```




## Usage with `ember-cli-sass`

Sass support has been added so that you can `@import` the Bootstrap/Bootswatch
theme in your `app.scss` file with the ability to [override variable defaults](http://getbootstrap.com/docs/4.0/getting-started/theming/#variable-defaults).
Just be sure to add your variable overrides *before* the `@import` statement.

```scss
// app/styles/app.scss

$body-bg: #e9ecef;
$border-radius: .10rem;

@import "ember-cli-bootswatch/bootswatch";
```

When `ember-cli-sass` is detected, the `importScss` option will automatically
be enabled and `importCSS` disabled (when not defined in your config). Additionally, 
if `app/styles/app.scss` is found, an import statement is inserted for 
`@import "ember-cli-bootswatch/bootswatch";`. If you start using Sass after
installing this addon, you will need to add the import statement to your
`app.scss` file manually.

If you plan on using the 'default' Bootstrap theme, replace the import statement
from `@import "ember-cli-bootswatch/bootswatch";` to `@import "ember-cli-bootswatch/bootstrap";`.
When using the Bootstrap theme, the nested imported files are different.

```scss
// app/styles/app.scss
@import "ember-cli-bootswatch/bootswatch"; // for any bootswatch theme
@import "ember-cli-bootswatch/bootstrap"; // for the "default" bootstrap theme
```

Alternately, you can import Sass files directly from Bootstrap/Bootswatch yourself.
An example would be to use an existing variable to override another variable (ex: below).
All Bootstrap `*.scss` files are available from `ember-cli-bootswatch/bootstrap/*`
and the selected Bootswatch theme is available from `ember-cli-bootswatch/bootswatch/*`.
Note, all other Bootswatch themes are *not* imported into the styles tree, 
just the selected theme.

```scss
// app/styles/app.scss
@import 'ember-cli-bootswatch/bootswatch/variables';

$body-bg: $gray-200; // where $gray-200 is from above variables import
$border-radius: .10rem;

@import 'ember-cli-bootswatch/bootstrap/bootstrap';
@import 'ember-cli-bootswatch/bootswatch/bootswatch';
```

To strictly disable Sass support (even if you have `ember-cli-sass` installed),
define the `importCSS` and `importScss` options in your `ember-cli-build.js` file. Ex:

```javascript
// ember-cli-build.js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-bootswatch': {
      theme: 'cerulean',
      importCSS: true,
      importScss: false
    },
    sassOptions: {
      // But you still use Sass for other things...
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
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-bootswatch': {
      theme: 'cerulean'
    },
    'ember-bootstrap': {
      importBootstrapCSS: false
    }
  });

  // ... (documentation snipped)

  return app.toTree();
};
```

Additionally, make sure the `ember-bootstrap` import statement is
removed from your `app.scss` file:

```scss
// Remove the following line
@import "ember-bootstrap/bootstrap";
```
