const path = require("path");
const webpack = require("webpack");
const FooterPlugin = require("./plugin/FooterPlugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.yb$/,
        use: [path.resolve(__dirname, "./loader/yb-loader.js")],
      },
    ],
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: "欢迎大家学习前端工程化 webpack",
    }),

    new FooterPlugin({
      banner: "FooterPlugin yb webpack",
    }),
  ],
};
