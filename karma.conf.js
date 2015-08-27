'use strict'

var webpack = require('webpack');
//var babelify = require('babelify');

module.exports = function(config) {
    config.set({
        plugins: [
            require('karma-webpack'),
            //require('karma-browserify'),
            require('karma-tap'),
            require('karma-chrome-launcher'),
            require('karma-phantomjs-launcher'),
            require('karma-spec-reporter'),
            require('karma-tape-reporter'),
        ],

        basePath: '',
        frameworks: [ 'tap' ],
        files: [ 'test/index.js' ],

        preprocessors: {
            'test/index.js': [ 'webpack' ]
            //'test/index.js': [ 'browserify' ]
        },

        /*browserify: {
            debug: true,
            transform: [
                babelify.configure({
                    blacklist: ["strict"]
                })
            ],
            configure: function (bundle) {
                bundle.on('bundled', function (error) {
                    if (error != null)
                        console.error(error.message);
                });
            }
        },*/

        webpack: {
            node : {
                fs: 'empty'
            },

            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: "babel-loader",
                        query: {
                            blacklist: ["strict"]
                        }
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
