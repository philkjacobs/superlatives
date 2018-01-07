const fs = require('fs');
const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: ["./web/js/main.jsx"],
    output: {
        path: path.join(__dirname, "/web/static"),
        publicPath: "/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['react']
                }
            }
        ]

    },
    plugins: [
        new webpack.DefinePlugin({
            IS_PROD: JSON.stringify(!fs.existsSync(path.join(__dirname, ".IS_DEV")))
        })
    ]
};