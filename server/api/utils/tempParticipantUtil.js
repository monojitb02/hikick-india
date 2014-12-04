'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    tempParticipantModel = require('../models/tempParticipant');

module.exports = {
    /**
     *  get participant details registration data from database
     *
     */
    findParticipant: function(searchObject) {
        var deferred = Q.defer();
        tempParticipantModel
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
        tempParticipantModel
            .find(searchObject, 'registrationId name country state clubName -_id')
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
