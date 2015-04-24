ember-cli-bootswatch
====================

An [ember-cli addon](http://www.emberaddons.com/) to import a [Bootswatch](http://bootswatch.com/) theme for [Bootstrap](http://getbootstrap.com/), including the fonts and JavaScript. This addon is only meant to import the related bower files and does NOT contain [Ember Components](http://emberjs.com/guides/components/) to use within your templates. Other addons provide those features, [search emberaddons.com](http://www.emberaddons.com/?query=bootstrap) for those. Requires ember-cli 0.0.41 or higher.




## Installation

From within your [ember-cli](http://www.ember-cli.com/) project, run the following (depending on your ember-cli version) to install the addon and bower dependencies for bootstrap and bootswatch:

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

Options for this addon are configured in the projects `Brocfile.js` file as an 'ember-cli-bootswatch' object property. Available options include:

* `theme` [string]: Name of the Bootswatch theme to be imported (required)
* `excludeJS` [boolean]: By default, the `bootstrap.js` file will be imported from Bootstrap
* `excludeFonts` [boolean]: By default, the [font files](https://github.com/thomaspark/bootswatch/tree/gh-pages/fonts) will be imported from Bootswatch

The only required option is the Bootswatch theme. If you do not need to adjust any other options, you can just define a string of the theme name as the bootswatch options:

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

If multiple options need to be adjusted then you'll need to specify each option as an object property:

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

Use [bower to change the version](http://bower.io/docs/api/#install) of Bootswatch and Bootstrap that is imported. Be sure to save the new version to your `bower.json` file as well. Ex:

```bash
bower install --save bootswatch#2.3.2 bootstrap#2.3.2
```




## Usage with other Bootstrap addons

Other Bootstrap addons should be configured NOT to import Bootstrap files (styles, themes, fonts, etc.) This way files imported by Bootswatch do not conflict with other files and versions. But at the same time, if another addon requires their own version of a file (such as JavaScript), then disable the import from Bootswatch. For example, when using [ember-cli-bootstrap](https://github.com/dockyard/ember-cli-bootstrap) the recommended options for both addons are:

```javascript
// Brocfile.js
/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  'ember-cli-bootstrap': {
    'importBootstrapCSS':   false, // included in the bootswatch theme
    'importBootstrapTheme': false, // again, using bootswatch theme
    'importBootstrapFont':  false  // using bootswatch font files
  },
  'ember-cli-bootswatch': {
    'theme': 'cerulean', // bootswatch theme
    'excludeJS': true    // ember-cli-bootstrap includes javascript components
  }
});

// ... (documentation snipped)

module.exports = app.toTree();
```




## FAQ's


#### Will this addon work without ember-cli-bootstrap?

Yes, by default this addon will import everything required to use Bootstrap. All CSS [styling](http://getbootstrap.com/css/) and [components](http://getbootstrap.com/components/) will be available but [JavaScript components](http://getbootstrap.com/javascript/) will need to be initialized and destroyed on a View or Components [life cycle events](http://emberjs.com/guides/understanding-ember/the-view-layer/#toc_lifecycle-hooks). Ex:

```javascript
// app/components/bs-tooltip.js
import Ember from 'ember';

export default Ember.Component.extend({
  initTooltip: function() {
    this.$().tooltip();
  }.on('didInsertElement'),
  destroyTooltip: function() {
    this.$().tooltip('destroy');
  }.on('willDestroyElement')
});
```


#### What if I want the bootstrap.js file from ember-cli-bootstrap?

Although the goal of ember-cli-bootstrap is to provide Ember Components for Bootstraps Components, you can still import the `bootstrap.js` file from bower. Technically both addons will import that file from the same location, so either can be configured to include it. Simply remove the `'excludeJS'` option in the example configuration above or include the [`'importBootstrapJS': true` option for ember-cli-bootstrap`](https://github.com/dockyard/ember-cli-bootstrap#importing-javascript-from-twitter-bootstrap).


#### Getting an error "Fonts already imported (possibly by ember-cli-bootstrap)" but I already have 'importBootstrapFont':false in my Brocfile...

The `importBootstrapFont` option for ember-cli-bootstrap is new as of version 0.0.13, it is likely that you have an older version. Either update your ember-cli-bootstrap addon or disable the bootswatch fonts with the `excludeFonts` option until you are able to update.


#### Any cool tricks when using Bootstrap with Ember?

[alexspeller](https://twitter.com/alexspeller/) posted a [really useful Ember Component on the discussion forums](http://discuss.emberjs.com/t/bootstrap-active-links-and-lis/5018/1) that will look for `active` child views and apply the `.active` class to the current element. I've taken it a step further and also have it check for `disabled` views.

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
