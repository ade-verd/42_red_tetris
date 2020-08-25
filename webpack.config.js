const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');

const config = {
    entry: './src/client/index.js',

    output: {
        path: path.join(__dirname, '/dist/client'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        publicPath: '/',
    },

    devServer: {
        historyApiFallback: true,
        contentBase: './src/client/',
    },

    plugins: [
        new LodashModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            favicon: './src/client/assets/img/favicon.ico',
            template: './src/client/index.html',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.LOG_LEVEL': JSON.stringify(process.env.LOG_LEVEL),
            'process.env.IS_REDUXLOGGER_ENABLED': JSON.stringify(
                process.env.IS_REDUXLOGGER_ENABLED,
            ),
        }),
    ],

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                            },
                        },
                    },
                ],
                include: /\.module\.css$/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.s[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                loader: 'url-loader?limit=100000',
            },
            {
                test: /\.ico$/,
                loader: 'file-loader?name=[name].[ext]',
            },
        ],
    },
};

module.exports = (env, argv) => {
    config.mode = process.env.NODE_ENV || 'development';
    config.devtool = config.mode === 'production' ? false : 'inline-source-map';

    return config;
};
