'use strict';

// Here's a JavaScript-based config file.
module.exports = {
  color: true, 
  diff: true, 
  'inline-diffs': false, 
  bail: true, 
  extension: ['js'],
  opts: false,
  package: './package.json',
  recursive: true,
  reporter: 'spec',
  require: '@babel/register',
  slow: 75,
  timeout: 2000,
  exit: true,
  ui: 'bdd',
  'watch-files': ['src', 'test'],
};