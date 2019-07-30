// https://webpack.js.org/guides/typescript/

const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = [
  {
    mode: 'development',
    entry: './server.ts',
    devtool: "inline-source-map",
    target: "node",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'server.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new NodemonPlugin({
        script: './dist/server.js'
      })
    ]
  },
  {
    mode: 'development',
    entry: "./testApp/app.ts",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'testApp.js',
      path: path.resolve(__dirname, 'public/dist')
    }
  },
  {
    mode: 'development',
    entry: "./screenCapture/app.ts",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'screenCapture.js',
      path: path.resolve(__dirname, 'public/dist')
    }
  },
  {
    mode: 'development',
    entry: "./testApp/app.ts",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'testApp.js',
      path: path.resolve(__dirname, 'public/dist')
    }
  },
  {
    mode: 'development',
    entry: "./sliceMMO/app.ts",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'sliceMMO.js',
      path: path.resolve(__dirname, 'public/dist')
    }
  }
];