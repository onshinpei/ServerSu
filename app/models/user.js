'use strict';
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    phoneNumber: {
        unique: true,
        type: String
    },
    areaCode: String,
    verifyCode: String,
    accessToken: String,
    nickname: String,
    gender: String,
    age: String,
    avatar: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.pre('save', function(next) {
    if(!this.isNew) {
        this.meta.createAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});
var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;