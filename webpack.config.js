const path = require('path')

module.exports = {
  // mode:'production',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './'),
    filename: 'app.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.less$/i,
        use: [
          // compiles Less to CSS
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  }
}