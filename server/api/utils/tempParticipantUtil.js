'use strict';
var lib = require('../../lib'),
    Q = lib.q,
    tempParticipantModel = require('../models/tempParticipant');

module.exports = {
    /**
     *  get participant datafrom database
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
    }
}
