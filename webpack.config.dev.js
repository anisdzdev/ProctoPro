import path from 'path'
import webpack from 'webpack';

export default {
    devtools: 'eval-source-map',
    historyApiFallback: true,
    entry: [
        'webpack-hot-middleware/client',
        path.join(__dirname, '/client/index.js')
    ],
    output: {
        path: '/',
        publicPath: '/'
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.join(__dirname, 'client'),
                    path.join(__dirname, 'server/shared')
                ],
                loaders: ['react-hot', 'babel']
            },
            {
                test: /\.(css|less)$/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader'
            },
        ]
    },
    resolve: {
        extentions: ['', '.js']
    }
}
