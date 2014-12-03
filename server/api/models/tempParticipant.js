'use strict';

var mongoose = require('../../lib').mongoose,
    Schema = mongoose.Schema,
    tempParticipantSchema = new Schema({
        registrationId: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        }
        /*,
                instructor: {
                    type: String,
                    required: true
                },
                country: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: false
                },
                gender: {
                    type: String,
                    required: true
                },
                clubName: {
                    type: String,
                    required: false
                },
                dob: {
                    type: Date,
                    required: true
                },
                weight: {
                    type: Number,
                    required: true
                },
                kata: {
                    type: Boolean,
                    default: false
                },
                kumite: {
                    type: Boolean,
                    default: false
                },
                weapons: {
                    type: Boolean,
                    default: false
                },
                email: {
                    type: String,
                    required: true
                },
                contactNumber: {
                    type: Number,
                    required: true
                },
                address: {
                    type: String,
                    required: true
                },
                profilePictureFile: {
                    type: String,
                    required: false
                }*/
    }, {
        versionKey: false
    });
// tempParticipantSchema.index({
//     registrationId: 1
// }, {
//     unique: true
// });
module.exports = mongoose.model('tempParticipant', tempParticipantSchema);
