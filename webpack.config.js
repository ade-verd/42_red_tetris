const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

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
    ],

    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },

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
    config.devtool = argv.mode === 'production' ? false : 'inline-source-map';

    return config;
};
