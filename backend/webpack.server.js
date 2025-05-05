/**
 * @fileoverview Webpack Configuration for Backend
 * @description Bundles and optimizes the backend for production.
 */

const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: "./server.js",
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.resolve("dist"),
    filename: "server.bundle.js",
  },
  mode: process.env.NODE_ENV || "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
