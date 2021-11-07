const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
//
//
const devServer = require('./devServer');

const jsRegExp = /\.js(x?)$/;
const styleRegExp = /s?(a|c)?ss$/;

module.exports =
  ({
    templatePath,
    entryPointPath,
    publicFolderPath,
    scssVariablesPath,
    buildPath,
  }) =>
  (_env, argv) => {
    const isProd = argv.mode === 'production';

    const config = {
      mode: 'production',
      entry: entryPointPath,
      devtool: isProd ? 'source-map' : false,
      output: {
        path: buildPath,
        filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
        clean: true,
        publicPath: '/',
      },
      devServer: devServer({ publicFolder: publicFolderPath }),
      module: {
        rules: [
          {
            test: jsRegExp,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
          },
          {
            test: styleRegExp,
            use: [
              {
                loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: !isProd,
                  esModule: false,
                  importLoaders: 2,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    config: path.resolve(__dirname, './postcss.config.js'),
                  },
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: !isProd,
                  additionalData: scssVariablesPath
                    ? `@import "${scssVariablesPath}";`
                    : '',
                },
              },
            ],
          },
          {
            test: /\.(jp(e?)g|webp|png)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'assets/images/[name].[hash:6].[ext]',
                },
              },
            ],
          },
          {
            test: /\.svg$/,
            use: [
              {
                loader: '@svgr/webpack',
              },
              {
                loader: 'file-loader',
                options: {
                  name: 'assets/icons/[name].[hash:6].[ext]',
                },
              },
            ],
          },
          {
            test: /\.(ttf|eot|woff|woff2)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[ext]',
                },
              },
            ],
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.json', '.jsx', '.scss'],
      },
      plugins: [
        new CopyPlugin({
          patterns: [
            {
              from: publicFolderPath,
              globOptions: {
                ignore: templatePath,
              },
              noErrorOnMissing: true,
            },
          ],
        }),
        new HtmlWebpackPlugin({
          template: templatePath,
          inject: 'body',
        }),
        isProd
          ? new MiniCssExtractPlugin({
              filename: isProd ? 'css/[name].[hash].css' : 'css/[name].css',
            })
          : null,
      ].filter(Boolean),
      optimization: {
        minimize: isProd,
        minimizer: [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              compress: true,
              format: {
                comments: false,
              },
            },
            extractComments: false,
          }),
        ],
      },
    };

    return config;
  };
