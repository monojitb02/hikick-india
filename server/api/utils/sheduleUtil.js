'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    sheduleModel = require('../models/shedule');

module.exports = {
    shedule: function(array) {
        var deferred = Q.defer();
        new sheduleModel(sheduleObject)
            .save(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    getShedules: function(sheduleObject) {
        var deferred = Q.defer(),
            sheduleData = lib.flat(sheduleObject);
        delete sheduleData._id;
        sheduleModel
            .findOneAndUpdate({
                _id: sheduleObject._id
            }, {
                $set: sheduleData
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
     *  get shedule details data from database
     *
     */
    findParticipant: function(searchObject) {
        var deferred = Q.defer();
        sheduleModel
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
     *  get shedule data from database
     *
     */
    getSheduleList: function(searchObject) {
        var deferred = Q.defer();
        sheduleModel
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
