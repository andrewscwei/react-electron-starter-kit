/// <reference path='../src/renderer/typings/custom.d.ts' />
/**
 * @file Webpack config for Electron's renderer process.
 */

import ReactRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import ForkTSCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import HTMLPlugin from 'html-webpack-plugin'
import path from 'path'
import { Configuration, DefinePlugin, EnvironmentPlugin, IgnorePlugin } from 'webpack'
import appConf from './app.conf'
import { getLocalesFromDir, getTranslationsFromDir } from './utils/locales'
import { buildDir, localesDir, rendererSrcDir as srcDir } from './utils/paths'

const isDev = process.env.NODE_ENV === 'development'
const locales = getLocalesFromDir(localesDir, appConf.locales[0], appConf.locales)
const port = Number(process.env.PORT ?? 8080)

const config: Configuration = {
  devtool: isDev ? 'eval-source-map' : false,
  entry: {
    renderer: path.join(srcDir, 'index.ts'),
  },
  infrastructureLogging: {
    level: 'error',
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          ...isDev ? {
            plugins: [require.resolve('react-refresh/babel')],
          } : {},
        },
      }],
    }, {
      rules: [{
        test: /\.(jpe?g|png|gif|svg|ico)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 8192,
            name: 'images/[name].[ext]',
          },
        }],
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 8192,
            name: 'media/[name].[ext]',
          },
        }],
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 8192,
            name: 'fonts/[name].[ext]',
          },
        }],
      }],
    }],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          test: /node_modules/,
          chunks: 'all',
          name: 'common',
          enforce: true,
        },
      },
    },
  },
  output: {
    filename: '[name].js',
    globalObject: 'this', // See https://github.com/webpack/webpack/issues/6642#issuecomment-371087342
    path: path.join(buildDir),
    sourceMapFilename: '[file].map',
    publicPath: isDev ? '/' : './',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: path.join(srcDir, 'static'),
        to: buildDir,
      }],
    }),
    new ForkTSCheckerPlugin(),
    new EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
    new DefinePlugin({
      __APP_CONFIG__: JSON.stringify(appConf),
      __I18N_CONFIG__: JSON.stringify({
        defaultLocale: appConf.locales[0],
        locales,
        dict: getTranslationsFromDir(localesDir, locales),
      }),
    }),
    new HTMLPlugin({
      appConf,
      filename: 'index.html',
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      template: path.resolve(srcDir, 'templates', 'index.html'),
    }),
    ...isDev ? [
      new ReactRefreshPlugin(),
    ] : [
      new IgnorePlugin({
        resourceRegExp: /^.*\/config\/.*$/,
      }),
    ],
  ],
  ...isDev ? {
    devServer: {
      client: {
        logging: 'error',
      },
      hot: true,
      port,
      static: {
        publicPath: '/',
      },
    },
  } : {},
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },
  stats: {
    colors: true,
    errorDetails: true,
    modules: true,
    reasons: true,
  },
  // When building the browser window in the main process and `nodeIntegration` is `false` and
  // `contextIsolation` is `true`, there is no need to use the `electron-renderer` target. By using
  // the `web` target we can avoid undefined Node APIs such as `require`.
  target: 'web',
}

export default config
