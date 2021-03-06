'use strict';

var mongoose = require('../../lib').mongoose,
    Schema = mongoose.Schema,
    participantSchema;

participantSchema = new Schema({
    participantId: {
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
        name: {
            type: String
        },
        value: {
            type: String
        }
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
    choiceOfEvents: {
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
        }
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
    }
}, {
    versionKey: false
});
participantSchema.index({
    participantId: 1
}, {
    unique: true
});
participantSchema.index({
    name: 1,
    email: 1
}, {
    unique: true
});
module.exports = mongoose.model('participant', participantSchema);
