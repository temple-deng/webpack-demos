const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './dist/'
  },
  module: {
    rules: [
      {
        test: /globals\.js/,
        loader: 'exports-loader?file,parse=helpers.parse'
      }
    ]
  }
};
