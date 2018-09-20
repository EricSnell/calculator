const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const devMode = process.env.NODE_ENV === 'development';
// Need to include as Webpack's default JS minifier is overridden by CSS optimizer
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const pug = {
  test: /\.pug$/,
  use: ['html-loader?attrs=false', 'pug-html-loader']
};

const scss = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    'css-loader',
    //'postcss-loader',
    'sass-loader'
  ]
};

const js = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: ['babel-loader']
};

module.exports = {
  entry: './src/js/app.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },

  module: {
    rules: [pug, scss, js]
  },

  optimization: {
    minimizer: [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin()]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pug/index.pug'
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css'
    }),
    new CleanWebpackPlugin(['dist'])
  ]
};
