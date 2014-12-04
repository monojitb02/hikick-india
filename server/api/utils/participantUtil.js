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
     *  get participant registration data from database
     *
     */
    getParticipantList: function(searchObject) {
        var deferred = Q.defer();
        participantModel
            .find(searchObject, 'participantId name country state clubName')
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
