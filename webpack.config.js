const path = require('path');

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
                query:
                {
                    presets:['react']
                }
            }
        ]

    }
};