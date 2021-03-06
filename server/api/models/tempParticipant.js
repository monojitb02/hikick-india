'use strict';

var mongoose = require('../../lib').mongoose,
    Schema = mongoose.Schema,
    tempParticipantSchema;

tempParticipantSchema = new Schema({
    registrationId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
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
        type: String,
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
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profilePictureFile: {
        type: String,
        required: false
    }
}, {
    versionKey: false
});
tempParticipantSchema.index({
    participantId: 1
}, {
    unique: true
});
module.exports = mongoose.model('temp_participant', tempParticipantSchema);
