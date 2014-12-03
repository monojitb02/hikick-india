'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    tempParticipantModel = require('../models/tempParticipant');

module.exports = {
    /**
     *  get participant data by participantId
     *  from database
     */
    findParticipant: function(participantId) {
        var deferred = Q.defer();
        tempParticipantModel
            .findOne({
                participantId: participantId
            })
            .exec(function(err, result) {
                console.log('here', result);
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });

        return deferred.promise;
    }
}
