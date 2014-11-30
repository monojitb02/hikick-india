window.name = "NG_DEFER_BOOTSTRAP!";

window._ = require('underscore');
// window.$ = require('jquery');
window.lang = require('./app/lang');


require('angular');
require('angular-ui-router');
require('angular-bootstrap');
require('ng-tags-input');

require("jquery");
require("jqueryUi");
require("jqueryMigrate");
require("bootstrap");
require("modernizr");
require("jquerySparkline");
require("toggles");
require("retina");
require("jqueryCookies");
require("mouseWheel");
// require("tagsInput");
require("custom");

require('flipclock');


var App = require('./app/application/app.module');

angular.element().ready(function() {
    angular.resumeBootstrap([App['name']]);
});
