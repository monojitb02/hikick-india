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
        console.log('maximumSerialNo', maximumSerialNo);
        for (var groupId = 0; groupId < (maximumSerialNo / 2); groupId++) {
            secretSerialNo1 = groupId * 2 + 1;
            secretSerialNo2 = secretSerialNo1 + 1;

            player1 = participants.splice(Math.floor((Math.random() * participants.length)), 1)[0];
            console.log('groupId', groupId, 'player1', player1);
            if (hasGotBy(player1)) {
                console.log('player1 got by in grpid', groupId, 'player', player1);
                player1.byFlag = true;
                player1.secretSerialNo = secretSerialNo1;
                resultArray.push(player1);
            } else {
                possiblePlayer2array = participants.filter(function(player2) {
                    if (!hasGotBy(player2) && player2.clubName.trim().toUpperCase() !== player1.clubName.trim().toUpperCase()) {
                        return true;
                    }
                });
                console.log('groupId', groupId, 'possiblePlayer2array', possiblePlayer2array);
                // TO_DO : have to check player 2 is in by list or not 

                if (!possiblePlayer2array.length) {
                    possiblePlayer2array = participants.filter(function(player2) {
                        return !hasGotBy(player2)
                    });
                }
                player2 = possiblePlayer2array.splice(Math.floor(Math.random() * possiblePlayer2array.length), 1)[0];
                participants = participants.filter(function(participant) {
                    return participant.participantId !== player2.participantId;
                });
                console.log('player2', player2);
                player1.secretSerialNo = secretSerialNo1;
                resultArray.push(player1);
                player2.secretSerialNo = secretSerialNo2;
                resultArray.push(player2);
            }
        }
        return resultArray;
    },
    saveShedule = function(sheduledList) {
        var deferred = Q.defer(),
            count = sheduledList.length,
            successCount = 0,
            responseLock = false;
        sheduledList.forEach(function(participant) {
            new sheduleModel(participant)
                .save(function(err, data) {
                    if (err) {
                        console.log('Error in save Shedules', err);
                    }
                    successCount++;
                    if (successCount === sheduledList.length && !responseLock) {
                        responseLock = true;
                        deferred.resolve();
                    }
                })
        })
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

    sheduleEvent: function(eventId, candidateGiveBy) {
        var deferred = Q.defer(),
            sheduleData = lib.flat(sheduleObject);
        delete sheduleData._id;
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
                            var reorderedParticipants = getFixtures(participants, candidateGiveBy);
                            saveShedule(reorderedParticipants)
                                .then(function() {
                                    deferred.resolve();
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
