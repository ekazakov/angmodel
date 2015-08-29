'use strict'

require('babel-core/polyfill');
require('tap-browser-color')();

//var testsContext = require.context(".", true, /-test\.js$/);
//testsContext.keys().forEach(testsContext);

require('./provider-test');
require('./scope-test');
require('./dom-compiler-test');
require('./directives-test');
/*
*/
