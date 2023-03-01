// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// const isProduction = process.env.NODE_ENV === 'production';

const HtmlWebpackPlugin = require("html-webpack-plugin");

// const stylesHandler = MiniCssExtractPlugin.loader;

// const config = {
//     mode: 'development',
//     resolve: {
//         modules: [...(isProduction ? [] : ['node_modules']), 'src'],
//         fallback: {
//           "fs": false,
//           "tls": false,
//           "net": false,
//           "path": false,
//           "zlib": false,
//           "http": false,
//           "https": false,
//           "stream": false,
//           "crypto": false,
//           "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
//         }
//     },
//     entry: {
//         bundle: path.resolve(__dirname, './src/index.js')
//     },
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: '[name].js',
//         clean: true,
//         assetModuleFilename: '[name][ext]'
//     },
//     devServer: {
//         static: {
//             directory: path.resolve(__dirname, 'dist')
//         },
//         port: 3000,
//         open: true,
//         hot: true,
//         compress: true,
//         historyApiFallback: true
//         // https: true,
//         // headers: {
//         //     'Access-Control-Allow-Origin': '*'
//         // },
//         // devMiddleware: {
//         //     index: false, // specify to enable root proxying
//         // },
//         // proxy: {
//         //     '/': {
//         //         target: 'https://soundcloud.com/',
//         //         changeOrigin: true,
//         //         // pathRewrite: {
//         //         //     '^/Beat-Bytes': '/'
//         //         // }
//         //     }
//         // }
//     },
//     plugins: [
//         new HtmlWebpackPlugin({
//             title: 'Beat Bytes',
//             filename: 'index.html',
//             template: './src/template.html'
//         }),
//         new BundleAnalyzerPlugin(),
//         // new MiniCssExtractPlugin()
//         // Add your plugins here
//         // Learn more about plugins from https://webpack.js.org/configuration/plugins/
//     ],
//     module: {
//         rules: [
//             {
//                 test: /\.(js|jsx)$/i,
//                 exclude: /node_modules/,
//                 use: ['babel-loader'],
//             },
//             {
//                 test: /\.scss$/,
//                 use: [stylesHandler, 'style-loader', 'css-loader', 'sass-loader'],
//             },
//             {
//                 test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
//                 type: 'asset',
//             },
//             // Add your rules for custom modules here
//             // Learn more about loaders from https://webpack.js.org/loaders/
//         ],
//     },
// };

// module.exports = () => {
//     // if (isProduction) {
//     //     config.mode = 'production';
//     //     config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
//     // } else {
//         // config.mode = 'development';
//     // }
//     return config;
// };

module.exports = {
  mode: "development",
  // resolve: {
  //   fallback: {
  //     "fs": false,
  //     "tls": false,
  //     "net": false,
  //     "path": false,
  //     "zlib": false,
  //     "http": false,
  //     "https": false,
  //     "stream": false,
  //     "crypto": false,
  //     "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
  //   }
  // },
  entry: {
    bundle: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
    assetModuleFilename: "[name][ext]",
  },
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    // host: 'localhost',
    // open: true,
    // hot: true,
    // compress: true,
    // historyApiFallback: true,
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    // },
    devMiddleware: {
      index: true, // specify to enable root proxying
    },
    proxy: {
      "/": {
        target: "http://localhost:8000",
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Beat Bytes",
      filename: "index.html",
      template: "public/index.html",
    }),
    new BundleAnalyzerPlugin(),
  ],
};
