/**
 * @fileoverview Webpack Configuration for Backend
 * @description Bundles and optimizes the backend for production.
 */

import path from "path";
import webpack from "webpack";
import nodeExternals from "webpack-node-externals";

export default {
  entry: "./server.js",
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.resolve("dist"),
    filename: "server.bundle.js",
  },
  mode: "development",
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
