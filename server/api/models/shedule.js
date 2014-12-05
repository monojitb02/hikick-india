/**
 * shedule.js
 *
 */
'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    sheduleSchema = new Schema({
        event: {
            type: Schema.Types.ObjectId,
            ref: 'event',
            required: true
        },
        participant: {
            type: Schema.Types.ObjectId,
            ref: 'participant',
            required: true
        },
        currentLevel: {
            type: Number,
            default: 1
        },
        secretSerialNumber: {
            type: Number
        },
        byFlag: {
            type: Boolean,
            default: false
        }
    }, {
        versionKey: false
    });
module.exports = lib.mongoose.model('shedule', sheduleSchema);
