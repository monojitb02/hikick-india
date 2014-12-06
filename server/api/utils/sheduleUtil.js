'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    applicationEndsOn = require('../../config').applicationEndsOn,
    sheduleModel = require('../models/shedule'),
    eventModel = require('../models/event'),
    participantModel = require('../models/participant'),
    participantUtil = require('../utils/participantUtil'),
    getByCount = function(count) {
        return Math.pow(2, Math.ceil(Math.log(count) / Math.LN2)) - count;
    },
    prepareQueryforEvent = function(eventObject) {
        var queryObject = {
            weight: {
                $lt: eventObject.weightLimitUpper,
                $gte: eventObject.weightLimitLower
            },
            dob: {
                $lte: new Date(new Date(applicationEndsOn).setFullYear(applicationEndsOn.getFullYear() - eventObject.ageLimitLower)),
                $gt: new Date(new Date(applicationEndsOn).setFullYear(applicationEndsOn.getFullYear() - eventObject.ageLimitUpper))
            },
            gender: eventObject.gender
        };
        switch (eventObject.eventName) {
            case 'WEAPONS':
                queryObject['choiceOfEvents.weapons'] = true;
                break;
            case 'KATA':
                queryObject['choiceOfEvents.kata'] = true;
                break;
            case 'KUMITE':
                queryObject['choiceOfEvents.kumite'] = true;
                break;
        };
        return queryObject;
    },
    getParticipantForEvent = function(event) {
        var deferred = Q.defer(),
            queryObject = prepareQueryforEvent(event);
        participantModel
            .find(queryObject)
            .exec(function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
        return deferred.promise;
    },
    getEvents = function() {
        var deferred = Q.defer(),
            resultTempStorage,
            result = [],
            errorCount = 0,
            finished = false;
        eventModel
            .find()
            .exec(function(err, events) {
                var queryObject;
                if (err) {
                    deferred.reject(err);
                } else {
                    events.forEach(function(event) {
                        getParticipantForEvent(event)
                            .then(function(participants) {
                                var tempEvent = event.toObject();
                                tempEvent.maximumByCount = getByCount(participants.length);
                                result.push(tempEvent);
                            }, function(err) {
                                errorCount++;
                            })
                            .done(function() {
                                if (!finished && events.length === (errorCount + result.length)) {
                                    finished = true;
                                    deferred.resolve(result);
                                }
                            });
                    })
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
            result = [];
        Q.all([getEvents(), getShedule()])
            .spread(function(events, shedules) {
                events.forEach(function(event) {
                    var resultTempStorage = event;
                    resultTempStorage.candidatesGotBy = shedules[event._id] || [];
                    result.push(resultTempStorage);
                });
                deferred.resolve(result);
            });
        return deferred.promise;
    },
    searchParticipant: function(query, eventId) {
        var deferred = Q.defer(),
            queryObject = {},
            reg;
        eventModel
            .findOne({
                eventId: eventId
            })
            .exec(function(err, eventDetails) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (eventDetails) {
                        queryObject = prepareQueryforEvent(eventDetails);
                        if (isNaN(query)) {
                            queryObject.name = {
                                $regex: new RegExp(query.split(' ').join('|')),
                                $options: 'i'
                            }
                        } else {
                            queryObject.participantId = Number(query);
                        }
                        console.log(queryObject);
                        participantUtil
                            .findParticipant(queryObject)
                            .then(function(searchResult) {
                                deferred.resolve(searchResult);
                            }, function() {
                                deferred.reject();
                            })
                    } else {
                        deferred.reject();
                    }
                }
            });
        return deferred.promise;
    },

    /**
     *  get shedule details data from database
     *
     */
    //TO_DO:not verified
    getCompeteShedule: function(eventId) {
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