'use strict';
var utility = require('../../util');
var api = require('../../util/api');
module.exports = function($scope, $rootScope, $state, $http) {

    //checking login status
    var id = utility.getCookie('uid');
    if (!id) {
        $state.go('login');
    }
    //logout user
    $scope.logout = function() {
        $http({ //get image urls from remote server
            url: api.logout,
            method: 'POST'
        }).success(function(result) {
            if (result.success) {
                utility.deleteCookie('uid');
                $state.go('login');
            }
        }).error(function() {
            //TODO: show error message
        });
    };
    $rootScope.$watch('user', function(value) {
        $scope.name = value.name;
    }, true);

    $scope.$on('$viewContentLoaded', function(event) {
        var originalHash = window.location.hash.replace(/\?.*$/, '');
        var activeListElement = jQuery('a[href="' + originalHash + '"]').closest("li");
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



    jQuery('.nav-parent > a').click(function() {
        var parent = jQuery(this).parent();
        var sub = parent.find('> ul');
        // Dropdown works only when leftpanel is not collapsed
        if (!jQuery('body').hasClass('leftpanel-collapsed')) {
            if (sub.is(':visible')) {
                sub.slideUp(200, function() {
                    parent.removeClass('nav-active');
                    jQuery('.mainpanel').css({
                        height: ''
                    });
                    adjustmainpanelheight();
                });
            } else {
                closeVisibleSubMenu();
                parent.addClass('nav-active');
                sub.slideDown(200, function() {
                    adjustmainpanelheight();
                });
            }
        }
        return false;
    });

    function closeVisibleSubMenu() {
        jQuery('.nav-parent').each(function() {
            var t = jQuery(this);
            if (t.hasClass('nav-active')) {
                t.find('> ul').slideUp(200, function() {
                    t.removeClass('nav-active');
                });
            }
        });
    }

    function adjustmainpanelheight() {
        // Adjust mainpanel height
        var docHeight = jQuery(document).height();
        if (docHeight > jQuery('.mainpanel').height())
            jQuery('.mainpanel').height(docHeight);
    }


    jQuery('.nav-bracket > li').hover(function() {
        jQuery(this).addClass('nav-hover');
    }, function() {
        jQuery(this).removeClass('nav-hover');
    });
    jQuery('.menutoggle').click(function() {
        console.log('menue toggle from custom.js');
        var body = jQuery('body');
        var bodypos = body.css('position');

        if (bodypos != 'relative') {

            if (!body.hasClass('leftpanel-collapsed')) {
                body.addClass('leftpanel-collapsed');
                jQuery('.nav-bracket ul').attr('style', '');

                jQuery(this).addClass('menu-collapsed');

            } else {
                body.removeClass('leftpanel-collapsed chat-view');
                jQuery('.nav-bracket li.active ul').css({
                    display: 'block'
                });

                jQuery(this).removeClass('menu-collapsed');

            }
        } else {

            if (body.hasClass('leftpanel-show'))
                body.removeClass('leftpanel-show');
            else
                body.addClass('leftpanel-show');

            adjustmainpanelheight();
        }

    });
};
