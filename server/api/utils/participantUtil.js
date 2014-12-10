'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    participantModel = require('../models/participant');

module.exports = {
    addParticipant: function(participantObject) {
        var deferred = Q.defer();
        new participantModel(participantObject)
            .save(function(err, result) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    },
    deleteParticipant: function(participantObject) {
        var deferred = Q.defer();
        participantModel
            .findOneAndRemove(participantObject)
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
     *  get unique list of clubs from database
     *
     */
    getCubNames: function() {
        var deferred = Q.defer(),
            result = [],
            response = [];
        participantModel
            .find({}, 'clubName')
            .exec(function(err, clubs) {
                if (err) {
                    deferred.reject(err);
                } else {
                    clubs.forEach(function(club) {
                        if (club.clubName && result.indexOf(club.clubName) === -1) {
                            result.push(club.clubName);
                            response.push({
                                name: club.clubName
                            });
                        }
                    })
                    deferred.resolve(response);
                }
            });

        return deferred.promise;
    },
    updateParticipant: function(participantObject) {
        var deferred = Q.defer(),
            participantData = lib.flat(participantObject);
        delete participantData._id;
        participantModel
            .findOneAndUpdate({
                _id: participantObject._id
            }, {
                $set: participantData
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
     *  get participant details registration data from database
     *
     */
    findParticipant: function(searchObject) {
        var deferred = Q.defer();
        participantModel
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
     *  get participant data from database
     *
     */
    getParticipantList: function(searchObject) {
        var deferred = Q.defer();
        participantModel
            .find(searchObject, 'participantId name country dob weight')
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
