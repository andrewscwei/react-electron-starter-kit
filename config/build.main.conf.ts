/**
 * @file Webpack config for Electron's main process.
 */

import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import path from 'path'
import { Configuration, EnvironmentPlugin } from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { buildDir, mainSrcDir as srcDir } from './utils/paths'

const isDev = process.env.NODE_ENV === 'development'

const config: Configuration = {
  devtool: isDev ? 'eval-source-map' : false,
  entry: {
    main: path.join(srcDir, 'index.ts'),
    preload: path.join(srcDir, 'preload.ts'),
  },
  externals: [nodeExternals()],
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    }],
  },
  output: {
    filename: '[name].js',
    path: path.join(buildDir),
  },
  plugins: [
    new ForkTSCheckerPlugin(),
    new EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  target: 'electron-main',
}

export default config
