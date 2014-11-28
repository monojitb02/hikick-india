'use strict';
require('../services');
require('../directives');
var Search = angular.module('app.search', ['ui.router', 'ui.bootstrap', 'app.service', 'app.directive'])
    .controller('searchCtrl', ['$scope', '$rootScope', '$http', '$state', 'generateVideoId', require('./controllers/searchCtrl')])
    .config(require('./router/router'));

module.exports = Search;
