'use strict';
var Home = angular.module('app.home', ['ui.router', 'ui.bootstrap'])
    .controller('homeCtrl', require('./controllers/homeCtrl'))
    .config(require('./router/router'));

module.exports = Home;
