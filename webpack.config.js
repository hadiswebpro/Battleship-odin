const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",

    entry: "./src/index.js",

    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ],

    devServer: {
        static: "./dist",
        open: true,
    },

    module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: "babel-loader",
    },

    {
      test: /\.(png|jpe?g|gif|webp|svg)$/i,
      type: "asset/resource",
    },
  ],
},
};