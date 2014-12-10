'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    applicationEndsOn = require('../../config').applicationEndsOn,
    sheduleModel = require('../models/shedule'),
    eventModel = require('../models/event'),
    participantModel = require('../models/participant'),
    participantUtil = require('../utils/participantUtil'),
    getByCount = function(count) {
        if (count === 1) {
            return 1;
        }
        return Math.pow(2, Math.ceil(Math.log(count) / Math.LN2)) - count;
    },
    getMaxPlayerPossible = function(originalNumber) {
        if (originalNumber === 1) {
            return 1;
        }
        return Math.pow(2, Math.ceil(Math.log(originalNumber) / Math.LN2));
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
            .lean()
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
                                tempEvent.participantCount = participants.length;
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
            .find({
                byFlag: true
            })
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
    },
    getFixtures = function(participants, participantsGotBy) {
        var maximumSerialNo = getMaxPlayerPossible(participants.length),
            secretSerialNo1,
            secretSerialNo2,
            player1,
            player2,
            possiblePlayer2array = [],
            resultArray = [],
            hasGotBy = function(participant) {
                return participantsGotBy.filter(function(playerGotby) {
                    return playerGotby.participantId === participant.participantId;
                }).length;
            };
        if (participants.length === 0) {
            return false;
        }
        participantsGotBy = participantsGotBy || [];
        if (participants.length !== maximumSerialNo) {
            if ((maximumSerialNo - participants.length) > participantsGotBy.length) {
                var extraAutoByCount = maximumSerialNo - participants.length - participantsGotBy.length,
                    selectedCandidate;
                for (var i = 0; i < extraAutoByCount; i++) {
                    selectedCandidate = participants[Math.floor((Math.random() * participants.length))];
                    while (hasGotBy(selectedCandidate)) {
                        selectedCandidate = participants[Math.floor((Math.random() * participants.length))];
                    }
                    participantsGotBy.push(selectedCandidate);
                }

            }
        } else {
            participantsGotBy = [];
        }
        // console.log('maximumSerialNo', maximumSerialNo, participantsGotBy);
        for (var groupId = 0; groupId < (maximumSerialNo / 2); groupId++) {
            secretSerialNo1 = groupId * 2 + 1;
            secretSerialNo2 = secretSerialNo1 + 1;

            player1 = participants.splice(Math.floor((Math.random() * participants.length)), 1)[0];
            // console.log('groupId', groupId, 'player1', player1);
            if (hasGotBy(player1)) {
                // console.log('player1 got by in grpid', groupId, 'player', player1);
                player1.byFlag = true;
                player1.currentLevel = 2;
                player1.secretSerialNumber = secretSerialNo1;
                resultArray.push(player1);
            } else {
                possiblePlayer2array = participants.filter(function(player2) {
                    if (!hasGotBy(player2) && player2.clubName.trim().toUpperCase() !== player1.clubName.trim().toUpperCase()) {
                        return true;
                    }
                });
                // console.log('groupId', groupId, 'possiblePlayer2array', possiblePlayer2array);
                if (!possiblePlayer2array.length) {
                    possiblePlayer2array = participants.filter(function(player2) {
                        return !hasGotBy(player2)
                    });
                }
                player2 = possiblePlayer2array.splice(Math.floor(Math.random() * possiblePlayer2array.length), 1)[0];
                participants = participants.filter(function(participant) {
                    return participant.participantId !== player2.participantId;
                });
                // console.log('player2', player2);
                player1.secretSerialNumber = secretSerialNo1;
                player2.currentLevel = 1;
                resultArray.push(player1);
                player2.secretSerialNumber = secretSerialNo2;
                player1.currentLevel = 1;
                resultArray.push(player2);
            }
        }
        return resultArray;
    },
    saveShedule = function(sheduledList, event_id) {
        var deferred = Q.defer(),
            count = sheduledList.length,
            successCount = 0,
            errorCount = 0,
            responseLock = false;
        sheduleModel.remove({
            event: event_id
        }).exec(function(err, data) {
            sheduledList.forEach(function(participant) {
                new sheduleModel({
                        event: event_id,
                        participant: participant._id,
                        currentLevel: participant.currentLevel,
                        secretSerialNumber: participant.secretSerialNumber,
                        byFlag: participant.byFlag
                    })
                    .save(function(err, data) {
                        if (err) {
                            console.log('Error in save Shedules', err);
                            errorCount++;
                        } else {
                            successCount++;
                        }
                        if (successCount + errorCount === sheduledList.length && !responseLock) {
                            responseLock = true;
                            if (errorCount) {
                                deferred.reject();
                            } else {
                                deferred.resolve();
                            }
                        }
                    })
            })
        })

        return deferred.promise;
    };
module.exports = {

    getEventList: function() {
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
                    var resultTempStorage = event,
                        candidatesGotBy = shedules[event._id] || [];
                    resultTempStorage.candidatesGotBy = candidatesGotBy.map(function(shedule) {
                        return shedule.participant.name + ' ID: ' + shedule.participant.participantId;
                    })
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
    getShedule: function(queryObject) {
        var deferred = Q.defer();
        sheduleModel
            .find(queryObject)
            .populate('participant')
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
        return deferred.promise;
    },

    sheduleEvent: function(eventId, candidateGiveBy) {

        var deferred = Q.defer();
        eventModel
            .findOne({
                eventId: eventId
            })
            .exec(function(err, result) {
                if (err) {
                    deferred.reject(err);
                }
                if (result) {
                    getParticipantForEvent(result)
                        .then(function(participants) {
                            // participants = participants.toObject();
                            // console.log('eventsParticipants:', participants);
                            var reorderedParticipants = getFixtures(participants, candidateGiveBy);
                            // console.log('reorderedParticipants:', reorderedParticipants);
                            saveShedule(reorderedParticipants, result._id)
                                .then(function() {
                                    eventModel
                                        .update({
                                            eventId: eventId
                                        }, {
                                            $set: {
                                                pending: false
                                            }
                                        })
                                        .exec(function(err, data) {
                                            if (err) {
                                                console.log('Error setting pending false in shedule', err);
                                            }
                                            deferred.resolve();
                                        })
                                }, function(err) {
                                    deferred.reject(err);
                                });
                        }, function(err) {
                            deferred.reject(err);
                        });
                } else {
                    eferred.reject();
                }
            });
        return deferred.promise;
    }
};
