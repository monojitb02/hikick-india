'use strict';


var serviceModule = require('../services/index'),

    registerCandidate = angular.module('app.registerCandidate', ['ui.router', 'ui.bootstrap'])
    .controller('registerCandidateCtrl', ['$scope', '$rootScope', '$http', require('./controllers/registerCandidateCtrl')])
    .config(require('./router/router'));

module.exports = registerCandidate;
