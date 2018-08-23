const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const common = require('./webpack.common.js');

module.exports = merge.smart(common, {
    mode: 'production',
    externals: {
        moment: 'moment',
        react: 'React',
        dva: 'dva',
        'dva/router': 'dva.router',
        'dva/dynamic': 'dva.dynamic.default',
        'react-dom': 'ReactDOM',
    },
    plugins: [
        new CompressionPlugin({
            threshold: 10000,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new HtmlWebpackPlugin({
            favicon: path.resolve('client', 'assets', 'favicon.ico'),
            filename: path.resolve(__dirname, 'dist', 'index.html'),
            template: path.resolve(__dirname, 'client', 'index.prod.html'),
            inject: true,
            hash: false,
            minify: {
                removeComments: false,
                collapseWhitespace: false,
            },
            chunks: [
                'commons', 'index',
            ],
        }),
        new WebpackPwaManifest({
            name: '🐰🐨',
            short_name: '🐰🐨',
            description: 'A service 💗 counter for 🐰 & 🐨.',
            background_color: '#ffffff',
            theme_color: '#1890ff',
            icons: [{
                src: path.resolve('client', 'assets', 'favicon-192x192.png'),
                size: '192x192',
            }],
            ios: {
                'apple-mobile-web-app-title': '🐰🐨',
                'apple-mobile-web-app-status-bar-style': 'black-translucent',
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }),
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: [
                        [
                            'import', {
                                libraryName: 'antd',
                                libraryDirectory: 'es',
                                style: true,
                            },
                        ],
                        'transform-runtime',
                    ],
                }, 
            },
        }, {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
            ],
        }, {
            test: /\.less$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'less-loader',
            ],
        }],
    },
});
