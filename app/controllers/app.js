'use strict'
var mongoose = require('mongoose');
var User = mongoose.model('User');
var robot = require('../service/robot');
var uuid = require('uuid');
exports.signature = function *(next) {
    var body = this.request.body;
    var cloud = body.cloud;
    var token;
    var key;
    if(cloud=='qiniu') { //七牛
        key = uuid.v4() + '.jpg';
        token = robot.getQiniuToken(key);
    }else{
        token = robot.getCloudinaryToken(body)
    }

    this.body = {
        success: true,
        data: {
            token: token,
            key: key
        }
    }
}
exports.hasBody = function *(next) {
    var body = this.request.body || {};
    if(Object.keys(body).length == 0) {
        this.body = {
            success: false,
            err: '遗漏参数'
        }
    }
    yield next;
}
exports.hasToken = function *(next) {
    var accessToken = this.query&&this.query.body&&this.query.body.accessToken;
    if(!accessToken) {
        accessToken = this.request.body.accessToken;
    }
    if(!accessToken) {
        this.body = {
            success: false,
            err: '请重新登录1'
        }
        return next;
    }

    var user = yield User.findOne({
        accessToken: accessToken
    }).exec();
    if(!user) {
        this.body = {
            success: false,
            err: '无此用户请重新登录2'
        }
        return next;
    }
    this.session = this.session || {};
    this.session.user = user;
    yield next;
}