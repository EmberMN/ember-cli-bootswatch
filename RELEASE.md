# Release Process

1. If needed, bump the versions in `package.json` dependencies
2. `npm version x.y.z` - Updates the version in `package.json` and tags in git
3. `git push origin master --follow-tags` - Pushes any changes and the new version tag up to Github
4. Update the new tag on the [Github Releases page](https://github.com/Panman8201/ember-cli-bootswatch/releases)
5. `npm publish` - Release the new version to the world!
