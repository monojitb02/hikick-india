var fs = require('fs');

module.exports = function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.search', {
            url: '/search',
            views: {
                'body': {
                    template: fs.readFileSync(__dirname + '/../templates/search.html'),
                    controller: 'searchCtrl'
                }
            }
        });
}
