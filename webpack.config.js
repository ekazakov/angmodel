module.exports = {
    context: __dirname + "/src",
    entry: "./angmodel.js",

    output: {
        filename: "angmodel.js",
        path: __dirname + "/dist"
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ["babel-loader"]
            }
        ]
    },

    watch: true,
    debug: true,

    devtool: "source-map"
};
