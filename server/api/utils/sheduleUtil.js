'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    sheduleModel = require('../models/shedule'),
    eventModel = require('../models/event'),
    participantModel = require('../models/participant'),
    getEvents = function() {
        var deferred = Q.defer();
        eventModel
            .find()
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },
    getShedule = function() {
        var deferred = Q.defer(),
            result = {};
        sheduleModel
            .find()
            .populate('participant')
            .exec(function(err, shedules) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (shedules.length) {
                        result = lib._.groupBy(shedules, function(shedule) {
                            return shedule.event;
                        });
                    }
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    };

module.exports = {

    /**
     *  get all shedule hint data from database
     *
     */
    getSheduleStatus: function() {
        var deferred = Q.defer(),
            result = [],
            resultTempStorage = {};
        Q.all([getEvents(), getShedule()])
            .spread(function(events, shedules) {
                events.forEach(function(event) {
                    resultTempStorage = event;
                    resultTempStorage.candidatesGotBy = shedules[event._id] || [];
                    console.log(resultTempStorage)
                    result.push(resultTempStorage);
                });
                deferred.resolve(result);
            });
        return deferred.promise;
    },

    /**
     *  get shedule details data from database
     *
     */
    //TO_DO:not verified
    getShedule: function(eventId) {
        var deferred = Q.defer(),
            event;
        sheduleModel
            .find({
                event: eventId
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (result.length) {
                        event = result[0].event;
                        result.forEach(function(sheduleObject) {
                            lib._.omit(sheduleObject, 'event');
                        });
                        console.log(result);
                    }
                    deferred.resolve({
                        event: event,
                        shedule: result
                    });
                }
            });
        return deferred.promise;
    },


    shedule: function(sheduleObject) {
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
};
