'use strict'

var webpack = require('webpack');

module.exports = function(config) {
    config.set({
        plugins: [
            require('karma-webpack'),
            require('karma-tap'),
            require('karma-chrome-launcher'),
            require('karma-phantomjs-launcher'),
            require('karma-spec-reporter'),
            require('karma-tape-reporter'),
        ],

        basePath: '',
        frameworks: [ 'tap' ],
        files: [ 'test/**/*.js' ],

        preprocessors: {
            'test/**/*.js': [ 'webpack' ]
        },

        webpack: {
            node : {
                fs: 'empty'
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

            debug: true,

            devtool: "inline-source-map"
        },

        webpackMiddleware: {
            noInfo: true
        },

        reporters: [ 'dots' ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false
    })
};
