/**
 *match model
 */
'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    matchSchema = new Schema({
        date: {
            type: Date,
            required: true
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: 'event',
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        dojoNumber: {
            type: Number,
            required: true
        },
        redCornerPlayer: {
            type: Schema.Types.ObjectId,
            ref: 'participant',
            required: true
        },
        blueCornerPlayer: {
            type: Schema.Types.ObjectId,
            ref: 'participant',
            required: true
        },
        referee: {
            type: String,
            required: true
        },
        timeBreaks: [{
            type: Date
        }],
        redCornerPoints: [{
            point: {
                type: Number,
                required: true
            },
            time: {
                type: Date
            }
        }],
        redCornerWarnings1: [String],
        redCornerWarnings2: [String],
        blueCornerPoints: [{
            point: {
                type: Number,
                required: true
            },
            time: {
                type: Date
            }
        }],
        blueCornerWarnings1: [String],
        blueCornerWarnings2: [String],
        winner: {
            type: Schema.Types.ObjectId,
            ref: 'participant',
            required: true
        }
    }, {
        versionKey: false
    });
module.exports = lib.mongoose.model('match', matchSchema);
