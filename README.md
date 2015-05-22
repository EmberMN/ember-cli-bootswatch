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
following (depending on your ember-cli version) to install the addon and
bower dependencies for bootstrap and bootswatch:

```bash
# ember-cli 0.2.3 or higher
ember install ember-cli-bootswatch
```

```bash
# ember-cli from 0.1.5 to 0.2.2
ember install:addon ember-cli-bootswatch
```

```bash
# ember-cli from 0.0.43 to 0.1.4
npm install --save-dev ember-cli-bootswatch
ember generate ember-cli-bootswatch
```

```bash
# ember-cli from 0.0.41 to 0.0.43
npm install --save-dev ember-cli-bootswatch
bower install --save bootstrap bootswatch
```




## Configuration


#### Addon Options

Options for this addon are configured in the projects `Brocfile.js` file
as an 'ember-cli-bootswatch' object property. Available options include:

* `theme` [string]: Name of the Bootswatch theme to be imported, or `'default'` for the standard Bootstrap theme and `'bootstrap'` for the ["visually enhanced"](http://getbootstrap.com/getting-started/#bootstrap-theme) Bootstrap theme
* `excludeCSS` [boolean]: By default, the theme's `bootstrap.css` file will be imported
* `excludeJS` [boolean]: By default, the `bootstrap.js` file will be imported from Bootstrap
* `excludeFonts` [boolean]: By default, the [font files](https://github.com/thomaspark/bootswatch/tree/gh-pages/fonts) will be imported

The only important option is the theme. If you do not need to adjust
any other options, you can just define a string of the theme name
as the bootswatch options:

```javascript
// Brocfile.js
/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  'ember-cli-bootswatch': 'cerulean'
});

// ... (documentation snipped)

module.exports = app.toTree();
```

If multiple options need to be adjusted then you'll need to specify each
option as an object property:

```javascript
// Brocfile.js
/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  'ember-cli-bootswatch': {
    'theme': 'cerulean',
    'excludeJS': true
  }
});

// ... (documentation snipped)

module.exports = app.toTree();
```


#### Bootswatch Version

Use [bower to change the version](http://bower.io/docs/api/#install) of
Bootswatch and Bootstrap that is imported. Be sure to save the new version
to your `bower.json` file as well. Ex:

```bash
bower install --save bootswatch#2.3.2 bootstrap#2.3.2
```




## Usage with other Bootstrap addons

Other Bootstrap addons should be configured NOT to import Bootstrap files
(styles, themes, fonts, etc.) This way files imported by Bootswatch do not
conflict with other files and versions. But at the same time, if another
addon requires their own version of a file (such as JavaScript), then disable
the import from Bootswatch.




## FAQ's


#### I'm getting a "Content Security Policy violation" in the cli console

Depending on which theme you choose, the CSS might import fonts from a CDN,
such as http://fonts.googleapis.com. You'll need to modify ember-cli's default
[Content Security Policy addon](https://github.com/rwjblue/ember-cli-content-security-policy)
rules to allow such requests. Ex:

```
// config/environment.js
/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    // (snip)
    // Be sure to add a comma to the previous object property
    // },

    // ember-cli-bootswatch
    contentSecurityPolicy: {
      'font-src': "'self' http://fonts.gstatic.com",
      'style-src': "'self' http://fonts.googleapis.com"
    }

  };

  // (snip)

  return ENV;
};
```


#### Any cool tricks when using Bootstrap with Ember?

[alexspeller](https://twitter.com/alexspeller/) posted a
[really useful Ember Component on the discussion forums](http://discuss.emberjs.com/t/bootstrap-active-links-and-lis/5018/1)
that will look for `active` child views and apply the `.active` class to
the current element. I've taken it a step further and also have it check
for `disabled` views.

*Note: The implementation of this post Glimmer (Ember 1.13.0) is TBD.*

```javascript
// app/components/link-li.js
import Ember from 'ember';

// http://discuss.emberjs.com/t/bootstrap-active-links-and-lis/5018
// Added the disabled class name binding
export default Ember.Component.extend({
	tagName: 'li',
	classNameBindings: ['active','disabled'],
	active: function(){
		return this.get('childViews').anyBy('active');
	}.property('childViews.@each.active'),
	disabled: function(){
		return this.get('childViews').everyBy('disabled');
	}.property('childViews.@each.disabled')
});
```
