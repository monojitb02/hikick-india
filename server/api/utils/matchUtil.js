'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    matchModel = require('../models/match');

module.exports = {
    save: function(matchObject) {
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
    getShedules: function(matchObject) {
        var deferred = Q.defer(),
            matchData = lib.flat(matchObject);
        delete matchData._id;
        matchModel
            .findOneAndUpdate({
                _id: matchObject._id
            }, {
                $set: matchData
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });

        return deferred.promise;
    },
    /**
     *  get match details data from database
     *
     */
    findParticipant: function(searchObject) {
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
    },
    /**
     *  get match data from database
     *
     */
    getSheduleList: function(searchObject) {
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
