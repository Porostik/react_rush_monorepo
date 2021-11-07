const path = require('path');

const getBaseConfig = require('@monorepo/webpack');

module.exports = getBaseConfig({
  templatePath: path.join(__dirname, 'public', 'index.html'),
  entryPointPath: path.join(__dirname, 'src', 'index.jsx'),
  publicFolderPath: path.join(__dirname, 'public'),
  buildPath: path.join(__dirname, 'build'),
});
