/* eslint-env node */

// module requirements
const EOL = require('os').EOL;
const fs = require('fs');
const path = require('path');

module.exports = {
  description: 'Add @import statement to app.scss if available',

  // Required for "default" addon blueprints
  normalizeEntityName(entityName) {
    return entityName;
  },

  afterInstall() {
    let appScss = path.join('app', 'styles', 'app.scss');
    if (fs.existsSync(appScss)) {
      return this.insertIntoFile(appScss, `${EOL}@import "ember-cli-bootswatch/bootswatch";${EOL}`).then(statement => {
        this.ui.writeInfoLine(statement.inserted
          ? 'Added @import statement to your app.scss file'
          : '@import statement already exists your app.scss file'
        );
      });
    }
  }
};
