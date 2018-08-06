/* global __dirname */
var path = require("path");

var contentScript = {
    mode: "production",
    watch: true,
    entry: "./app/content/scripts/src/main.js",
    output: {
        path: path.resolve(__dirname, "app/content/scripts/dist/"),
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
                        presets: ["babel-preset-env"],
                        plugins: ["transform-class-properties"]
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

var backgroundScript = {
    mode: "production",
    watch: true,
    entry: "./app/background/scripts/src/main.js",
    output: {
        path: path.resolve(__dirname, "app/background/scripts/dist/"),
        filename: "background-script.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel-preset-env"],
                        plugins: ["transform-class-properties"]
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

module.exports = [contentScript, backgroundScript];