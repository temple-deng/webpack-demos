const path = require('path');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: {
    main: './src/index.js',
    another: './src/another-module.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './dist/'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
