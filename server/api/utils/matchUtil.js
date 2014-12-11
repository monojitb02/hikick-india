'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    matchModel = require('../models/match');

module.exports = {
    addMatches: function(matchObject) {
        var deferred = Q.defer();
        new matchModel(matchObject)
            .save(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    /**
     *  get match details data from database
     *
     */
    findMatch: function(searchObject) {
        var deferred = Q.defer();
        matchModel
            .find(searchObject)
            .populate('event redCornerPlayer blueCornerPlayer winner')
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    },
    /**
     *  get match list from database
     *
     */
    getMatchList: function(searchObject) {
        var deferred = Q.defer();
        matchModel
            .find(searchObject)
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    }
}
