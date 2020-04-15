const path = require("path"); //To include a built in node module
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"), //Joins the path: pwd + dist/js
    filename: "js/bundle.js",
  },
  devServer: {
    contentBase: "./dist", //Where webpack will serve files
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/, //Regular expression $=at the end
        exclude: /mode_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
