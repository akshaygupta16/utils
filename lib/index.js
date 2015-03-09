'use strict';

var Collection = require('./collection').Collection;

var slice = exports.slice = Function.call.bind(Array.prototype.slice);

exports.collection = function(items, start, total) {
    return new Collection(items, start, total);
};

exports.cork = function (fn) {
    var corked = true;
    var invocations = [];

    var corkFn = function () {
        if (corked) {
            invocations.push([this].concat(slice(arguments)));
        } else {
            fn.apply(this, arguments);
        }
    };

    corkFn.cork = function () {
        corked = true;
    };

    corkFn.uncork = function () {
        corked = false;
        invocations.forEach(function (invocation) {
            fn.apply(invocation.shift(), invocation);
        });
        invocations = [];
    };

    return corkFn;
};