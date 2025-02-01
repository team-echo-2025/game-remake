// webpack.config.mjs (ESM style)
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
    mode: 'development',
    entry: './src/sketch.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(process.cwd(), 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        static: {
            directory: path.join(process.cwd(), 'public'),
        },
        port: 8080,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html', // use your existing index
            inject: false
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/assets', to: 'assets' }, // copy assets folder
                { from: 'public/globals.css', to: 'globals.css' }, // copy assets folder
                { from: 'public/favicon.ico', to: 'favicon.ico' }, // copy assets folder
            ],
        }),
    ],
};
