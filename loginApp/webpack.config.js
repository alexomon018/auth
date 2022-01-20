const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const deps = require("./package.json").dependencies;

module.exports = (_, argv) => ({
  output: {
    publicPath:
      argv.mode === "development"
        ? "http://localhost:3001/"
        : "http://3.89.228.148:3001/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    host: argv.mode === "development" ? "localhost" : "0.0.0.0",
    port: 3001,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "loginApp",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        "./Login": "./src/components/Login/Login.jsx",
        "./Home": "./src/components/Home/Home.jsx",
        "./ForgotPassword":
          "./src/components/ForgotPassword/ForgotPassword.jsx",
        "./ResetPassword": "./src/components/ResetPassword/ResetPassword.jsx",
        "./context": "./src/context.js",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new Dotenv({
      path:
        argv.mode === "development"
          ? "./.env.development"
          : "./.env.production",
      safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
    }),
  ],
});
