'use strict'
var mongoose = require('mongoose');
var User = mongoose.model('User');
var xss = require('xss');
var uuid = require('uuid');
var sms = require('../service/sms');
exports.signup = function *(next) {
    var phoneNumber = xss(this.request.body.phoneNumber.trim());
    var user = yield User.findOne({
        phoneNumber: phoneNumber
    }).exec();
    var verifyCode = sms.getCode();
    if(!user) {
        var accessToken = uuid.v4();
        user = new User({
            phoneNumber: xss(phoneNumber),
            accessToken: accessToken,
            verifyCode: verifyCode,
            nickname: '新用户',
            avatar: 'http://oejb8m2hg.bkt.clouddn.com/default1.jpg'
        })

    }else{
        user.verifyCode = verifyCode
    }
    try {
        user = yield user.save();
    }catch(e) {
        this.body = {
            success: false
        }
        return;
    }
    //发送验证码
    //sms.send(user.phoneNumber, user.verifyCode)

    this.body={
        success: true
    }
}
exports.verify = function *(next) {
    var verifyCode = this.request.body.verifyCode;
    var phoneNumber = this.request.body.phoneNumber;
    if(!verifyCode || !phoneNumber) {
        this.body= {
            success: false,
            err: '验证没通过'
        }
        return next;
    }
    var user = yield User.findOne({
        phoneNumber: phoneNumber,
        verifyCode: verifyCode
    }).exec();

    if(user) {
        user.verified = true;
        user = yield user.save();
        this.body={
            success: true,
            data: {
                nickname: user.nickname,
                accessToken: user.accessToken,
                avatar: user.avatar,
                _id: user._id
            }
        }
    }else{
        this.body= {
            success: false,
            err: '验证没通过'
        }
    }

}

exports.update = function *(next) {
    var body = this.request.body;
    var user = this.session.user;
    var fields = 'avatar,gender,age,nickname'.split(',');
    fields.forEach(function(field) {
       if(body[field]) {
           user[field] = xss(body[field].trim())
       }
    });
    user = yield user.save();

    this.body={
        success: true,
        data: {
            nickname: user.nickname,
            accessToken: user.accessToken,
            avatar: user.avatar,
            age: user.age,
            _id: user._id
        }
    }
}



