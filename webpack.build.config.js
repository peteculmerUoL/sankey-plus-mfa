/* eslint-disable */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const base = {
  mode: "production",
  entry: {
    sankeyPlus: "./src/sankeyPlus.js",
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
  performance: {
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000,
  },
};

// UMD build (keeps your existing behavior: window.SankeyPlus.SankeyChart)
const umd = {
  ...base,
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
    library: {
      name: "SankeyPlus",
      type: "umd",
    },
  },
  plugins: [new CleanWebpackPlugin()],
};

// ESM build (real ES module bundle with named exports)
const esm = {
  ...base,
  experiments: {
    outputModule: true, // enable ESM output
  },
  output: {
    path: path.join(__dirname, "distesm"),
    publicPath: "/",
    filename: "[name].esm.js",
    library: {
      type: "module", // emit ES module; export { SankeyChart } is preserved
    },
  },
  // no CleanWebpackPlugin here to avoid double-clean during a multi-config build
};

module.exports = [umd, esm];	