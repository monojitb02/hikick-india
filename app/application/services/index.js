'use strict';

var Service = angular.module('app.service', [])
    .factory('generateVideoId',
        function() {
            var video,
                generateVideoId = {
                    setVideo: function(obj) {
                        video = obj;
                    },
                    getVideo: function() {
                        return video;
                    }
                };
            return generateVideoId;

        }
    );

module.exports = Service;
