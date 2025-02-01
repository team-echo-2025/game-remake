// webpack.config.mjs (ESM style)
import path from 'path';

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
};
