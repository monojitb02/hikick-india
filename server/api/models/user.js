/**
 * User.js
 *
 */
'use strict';
var lib = require('../../lib'),
    Schema = lib.mongoose.Schema,
    userSchema = new Schema({
        role: {
            registerCandidate: {
                type: Boolean,
                'default': false
            },
            sheduleEvent: {
                type: Boolean,
                'default': false
            },
            dojoMat1: {
                type: Boolean,
                'default': false
            },
            dojoMat2: {
                type: Boolean,
                'default': false
            },
            dojoMat3: {
                type: Boolean,
                'default': false
            },
            dojoMat4: {
                type: Boolean,
                'default': false
            },
            gameHistory: {
                type: Boolean,
                'default': false
            }
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }, {
        versionKey: false
    });
userSchema.index({
    email: 1
}, {
    unique: true
});
module.exports = lib.mongoose.model("user", userSchema)
