'use strict';

var Directive = angular.module('app.directive', [])
    .directive('enterEvent', function() {
        return function(scope, element, attrs) {
            element.bind('keyup', function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.enterEvent);
                    });
                    event.preventDefault();
                }
            });
        };
    });

module.exports = Directive;
