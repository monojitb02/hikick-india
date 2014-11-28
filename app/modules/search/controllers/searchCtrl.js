'use strict';
var apiKey = require('../../../config').apiKey,
    api = require('../../../util/api');
module.exports = function($scope, $rootScope, $http, $state, generateVideoId) {
    $scope.searchKey = '';
    //find videoes from youtube api  
    $scope.findVideoes = function() {
        $http({ //get image urls from remote server
            url: api.search,
            method: 'GET',
            params: {
                part: 'snippet',
                q: $scope.searchKey,
                safeSearch: 'strict',
                type: 'video',
                order: 'viewCount',
                regionCode: 'IN',
                videoEmbeddable: true,
                maxResults: 30,
                key: apiKey
            }
        }).success(function(result) {
            if (result.pageInfo.totalResults === 0) {
                $scope.noResult = true;
            } else {
                $scope.videoList = result.items;
                localStorage.setItem("searchResult", JSON.stringify(result.items));
            }

        }).error(function() {
            //while any error occured
        });
    };
    //loads video player and plays video 
    $scope.playVideo = function(video) {
        generateVideoId.setVideo(video);
        $state.go('app.player');
    };
    //close the alert of no result found
    $scope.closeAlert = function(index) {
        $scope.noResult = false;
    };
    if (localStorage.getItem('searchResult')) {
        $scope.videoList = JSON.parse(localStorage.getItem('searchResult'));
    } else {
        $scope.findVideoes();
    };
    //adds to playlist in local storage 
    $scope.addToPlaylist = function(video) {
        var playlist = [],
            flag = true;
        if (localStorage.getItem('playlist')) {
            playlist = JSON.parse(localStorage.getItem('playlist'));
            playlist.forEach(function(item) {
                var videoId = item.id.videoId || item.id;
                if (videoId === video.id.videoId) {
                    flag = false;
                }
            });
            if (flag) {
                playlist.push(video);
                localStorage.setItem('playlist', JSON.stringify(playlist));
                $scope.added = true;
                setTimeout(function() {
                    $scope.added = false;
                    $scope.$apply();
                }, 2000);
            } else {
                $scope.alreadyExists = true;
                setTimeout(function() {
                    $scope.alreadyExists = false;
                    $scope.$apply();
                }, 2000);
            }
        }
    };
};
