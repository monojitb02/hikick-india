"use strict";
var api = require("./api"),
    Util = {
        deleteCookie: function(name) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        },
        setCookie: function(cname, cvalue, exdays) {
            document.cookie = cname + "=" + cvalue + "; ";
        },
        getCookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    };
module.exports = Util;
