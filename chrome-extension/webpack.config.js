var path = require("path");
var webpack = require("webpack");

module.exports = {
    mode: "production",
    watch: true,
    entry: "./app/scripts/content/src/main.js",
    output: {
        path: path.resolve(__dirname, "app/scripts/content/dist/"),
        filename: "content-script.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel-preset-env"]
                    }
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: "source-map"
};