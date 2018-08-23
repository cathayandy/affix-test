const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge.smart(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),
        new HtmlWebpackPlugin({
            favicon: path.resolve('client', 'assets', 'favicon.ico'),
            filename: path.resolve(__dirname, 'dist', 'index.html'),
            template: path.resolve(__dirname, 'client', 'index.dev.html'),
            inject: true,
            hash: false,
            minify: {
                removeComments: false,
                collapseWhitespace: false,
            },
            chunks: ['index'],
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
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
                        'dva-hmr',
                        'transform-runtime',
                    ],
                }, 
            },
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ],
        }, {
            test: /\.less$/,
            use: [
                'style-loader',
                'css-loader',
                'less-loader',
            ],
        }],
    },
});
