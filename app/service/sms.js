var https = require('https');
var querystring = require('querystring');
var Promise = require('bluebird');
var speakeasy = require('speakeasy');
exports.getCode = function() {
    var code = speakeasy.totp({
        secret: 'immocisnice',
        digits: 6
    });
    return code
}
exports.send = function(phoneNumber, verifyCode) {
    return new Promise(function(resolve, reject) {
        if(!phoneNumber) {
            return reject(new Erro('手机号错误'))
        }
        /*
         var postData = {
         "appId": 1000,
         "templateId": 133,
         "to": phoneNumber,
         "datas": [

         ],
         "sign": "42559714651188cc1367d88162735146"
         };
         */

        var postData = {
            apikey: 'd8189190fe29a54dfce9f803c683bcd1',
            mobile: phoneNumber,
            text: '【速新闻】尊敬的用户你好，您正在注册速新闻平台，验证码为' + verifyCode + ',验证码有效期为5分钟，请在页面中输入验证'
        }

        var content = querystring.stringify(postData);

        var options = {
            host:'sms.yunpian.com',
            path:'/v1/sms/send.json',
            method:'POST',
            headers:{
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' :content.length
            }
        };
        var str = '';
        var req = https.request(options,function(res){
            if(res.statusCode ==404) {
                reject(new Error('短信服务器错误'));
                return
            }
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                str += chunk;
                console.log(chunk);
            });
            res.on('end',function(){
                var data;
                try{
                    data = JSON.parse(str)
                }catch (e) {
                    reject(e)
                }
                
            });
        });

        req.write(content);
        req.end();
    })
}
