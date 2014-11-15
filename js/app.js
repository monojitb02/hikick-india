var mainModule = angular.module('hikick', ['ngRoute']);
mainModule
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/dashboard.html', {
                    templateUrl: 'dashboard.html'
                })
                .when('/general-forms.html', {
                    templateUrl: 'general-forms.html'
                })
                .when('/form-layouts.html', {
                    templateUrl: 'form-layouts.html'
                })
                .when('/form-validation.html', {
                    templateUrl: 'form-validation.html'
                })
                .when('/form-wizards.html', {
                    templateUrl: 'form-wizards.html'
                })
                .when('/wysiwyg.html', {
                    templateUrl: 'wysiwyg.html'
                })
                .when('/buttons.html', {
                    templateUrl: 'buttons.html'
                })
                .when('/icons.html', {
                    templateUrl: 'icons.html'
                })
                .when('/typography.html', {
                    templateUrl: 'typography.html'
                })
                .when('/alerts.html', {
                    templateUrl: 'alerts.html'
                })
                .when('/tabs-accordions.html', {
                    templateUrl: 'tabs-accordions.html'
                })
                .when('/sliders.html', {
                    templateUrl: 'sliders.html'
                })
                .when('/graphs.html', {
                    templateUrl: 'graphs.html'
                })
                .when('/widgets.html', {
                    templateUrl: 'widgets.html'
                })
                .when('/extras.html', {
                    templateUrl: 'extras.html'
                })
                .otherwise({
                    redirectTo: '/dashboard.html'
                });
            //$locationProvider.html5Mode(true)
            /*.when('/Book/:bookId/ch/:chapterId', {
                templateUrl: 'chapter.html',
                controller: 'ChapterCtrl',
                controllerAs: 'chapter'
            });*/
            /*
                        $locationProvider.html5Mode(true);*/
        }
    ])
    .controller('mainController', ['$scope', '$route', function($scope, $route) {
        $scope.$on('$viewContentLoaded', function(event) {
            var activeListElement = jQuery('a[href="#/' + $route.current.loadedTemplateUrl + '"]').closest("li");
            /*
                        var closeVisibleSubMenu = function() {
                            jQuery('.nav-parent').each(function() {
                                var t = jQuery(this);
                                if (t.hasClass('nav-active')) {
                                    t.find('> ul').slideUp(200, function() {});
                                }
                            });
                        };*/
            // closeVisibleSubMenu();


            if (jQuery('.nav-active').length &&
                !jQuery.contains(jQuery('.nav-active')[0], activeListElement[0])) {
                jQuery('.nav-active > ul').slideUp(200);
                jQuery('.nav-active').removeClass('nav-active');
            }

            //For only intra-sub menu 
            jQuery('.leftpanelinner li.active').removeClass('active');
            activeListElement.addClass('active');
            if (activeListElement.parents('ul').hasClass('children')) {
                activeListElement.parents('.nav-parent').addClass('active nav-active');
                activeListElement.parents('ul').slideDown(200);
            }

        });
    }]);
