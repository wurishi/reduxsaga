const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = webpack({
  devtool: 'cheap-module-eval-source-map',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_module/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'index.template.html'),
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
  ],
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist'),
    port: 9000,
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'chunk',
    },
  },
}).options;
