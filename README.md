ember-cli-bootswatch
====================

An [ember-cli addon](http://www.emberaddons.com/) to import a [Bootswatch](http://bootswatch.com/)
or [Bootstrap](http://getbootstrap.com/) theme, including the fonts and
JavaScript. This addon is only meant to import the related bower files and
does NOT contain [Ember Components](http://emberjs.com/guides/components/)
to use within your templates. Other addons provide those features,
[search emberaddons.com](http://www.emberaddons.com/?query=bootstrap) for
those.




## Installation

From within your [ember-cli](http://www.ember-cli.com/) project, run the
following to install the addon and bower dependencies for bootstrap and
bootswatch:

```bash
ember install ember-cli-bootswatch
```




## Configuration


#### Addon Options

Options for this addon are configured in the projects `ember-cli-build.js` file
as an 'ember-cli-bootswatch' object property. Available options include:

* `theme` [string]: Name of the Bootswatch theme to be imported, or `'default'` for the standard Bootstrap theme and `'bootstrap'` for the ["visually enhanced"](http://getbootstrap.com/getting-started/#bootstrap-theme) Bootstrap theme
* `excludeCSS` [boolean]: By default, the theme's `bootstrap.css` file will be imported
* `excludeJS` [boolean]: By default, the `bootstrap.js` file will be imported from Bootstrap
* `excludeFonts` [boolean]: By default, the [font files](https://github.com/thomaspark/bootswatch/tree/gh-pages/fonts) will be imported

The only important option is the `theme`. If you do not need to adjust
any other options, you can just define a string of the theme name
as the bootswatch options:

```javascript
// ember-cli-build.js
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

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
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

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
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    "ember-cli-bootswatch": {
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

```css
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




## FAQ's


#### I'm getting a "Content Security Policy violation" in the cli console

Depending on which theme you choose, the CSS might import fonts from a CDN,
such as http://fonts.googleapis.com. You'll need to modify ember-cli's default
[Content Security Policy addon](https://github.com/rwjblue/ember-cli-content-security-policy)
rules to allow such requests. Ex:

```javascript
// config/environment.js
/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    // (snip)
    // Be sure to add a comma to the previous object property
    // },

    // ember-cli-bootswatch
    contentSecurityPolicy: {
      'font-src': "'self' https://fonts.gstatic.com",
      'style-src': "'self' https://fonts.googleapis.com"
    }

  };

  // (snip)

  return ENV;
};
```


#### Any cool tricks when using Bootstrap with Ember?

[alexspeller](https://twitter.com/alexspeller/) created a really useful
[ember-cli-active-link-wrapper](https://github.com/alexspeller/ember-cli-active-link-wrapper)
addon that will apply the `.active` class to the wrapping element that contains
child `{{link-to}}`'s that are active. Very helpful with lists that contain
links (dropdowns):

```handlebars
{{!-- (snipped other dropdown code) --}}
<ul class="dropdown-menu">
  {{#active-link}}
    {{link-to 'Foo' 'foo'}}
  {{/active-link}}
  {{#active-link}}
    {{link-to 'Bar' 'bar'}}
  {{/active-link}}
  {{#active-link}}
    {{link-to 'Baz' 'baz'}}
  {{/active-link}}
</ul>
{{!-- (snipped other dropdown code) --}}
```

You can change the wrapper's element type by specifying `tagName`:
`{{#active-link tagName="div"}}`
