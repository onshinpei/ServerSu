'use strict';
var qiniu = require('qiniu');
var config = require('../../config/config');

qiniu.conf.ACCESS_KEY = config.qiniu.AK;
qiniu.conf.SECRET_KEY = config.qiniu.SK;
//上传到七牛后保存的文件名

//要上传的空间
var bucket = 'wfung';
//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    return putPolicy.token();
}

exports.getQiniuToken = function(key) {
    var token = uptoken(bucket, key);
    /*putPolicy.callbackUrl = 'http://your.domain.com/callback';
    putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';*/
    return token
}
exports.getCloudinaryToken = function(body) {

}






