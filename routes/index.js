'use strict';
var express = require('express');
var router = express.Router();
var crypto = require('crypto')

var NodeRSA = require('node-rsa')

// var constants = require('constants');
// var _padding = constants.RSA_PKCS1_PADDING;
// var _encoding = 'base64';
// var _signatureAlgorithm = 'RSA-SHA1';
// var publicKey = ''
// var key = new NodeRSA('-----BEGIN PUBLIC KEY-----\n'+ publicKey +'-----END PUBLIC KEY-----\n');

var key = new NodeRSA('-----BEGIN PUBLIC KEY-----\n'+
                      'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMt40R1hg5bQ62CPGrInRYDQf0NeEcCi\n'+
                      '19cDoac7q1WW+pXC5OhOEN/O7/Mwb8ValXdgFvqd1b2jESzLH6mFMwUCAwEAAQ==\n'+
                      '-----END PUBLIC KEY-----\n');


Date.prototype.Format = function(formatStr) {
    var str = formatStr;
    var Week = ['日','一','二','三','四','五','六'];

    str=str.replace(/yyyy|YYYY/,this.getFullYear());
    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

    str=str.replace(/MM/,this.getMonth()>9?this.getMonth().toString():'0' + this.getMonth());
    str=str.replace(/M/g,this.getMonth());

    str=str.replace(/w|W/g,Week[this.getDay()]);

    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
    str=str.replace(/d|D/g,this.getDate());

    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
    str=str.replace(/h|H/g,this.getHours());
    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
    str=str.replace(/m/g,this.getMinutes());

    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
    str=str.replace(/s|S/g,this.getSeconds());

    return str;
}
/* GET home page. */
router.get('/', function(req, res, next) {
    var myDate = new Date();
    var orderid = myDate.Format("yyyyMMddhhmmss");
    orderid += parseInt(1000000 * Math.random());

    var reqSn = myDate.Format("yyyyMMddhhmmss");
    reqSn += parseInt(10000000 * Math.random());

    var sign = getRsaSign(orderid, reqSn)
    res.render('index', {
        title: 'certpay',
        orderid: orderid,
        reqSn: reqSn,
        sign: sign
    });
});

/*

*/
function getMd5Str(orderid, reqSn) {
	var signDataStr = 'amount=100&bankCode=CMBC&bankName=民生银行&bankNo=6226200103146602&cardNo=42062119900109121X&cardType=1&merchantId=M200000250&mobileNo=18810528823&noticeUrl=http://testnoticeUrl&outOrderId='+ orderid +'&productName=充值&realName=潘兴武&reqSn='+ reqSn +'&returnUrl=http://testreturnUrl&secId=RSA&service=MOBILE_CERTPAY_H5_ORDER_CREATE&userId=500666&version=3.0.0'
	var md5DigestStr =  crypto.createHash('md5').update(signDataStr, 'utf-8').digest('hex')
	return md5DigestStr.toLowerCase()
}

function getRsaSign(orderid, reqSn) {
	var result = ''
	var md5Str = getMd5Str(orderid, reqSn)
	// console.log(md5Str)

	var encrypted = key.encrypt(md5Str, 'base64');


	result = encrypted
	return result
}

/*function encrypt(msg) {
    var blockSize = 128;
    var padding = 11;

    var buffer = new Buffer(msg);

    var chunkSize = blockSize - padding;
    var nbBlocks = Math.ceil(buffer.length / (chunkSize));

    var outputBuffer = new Buffer(nbBlocks * blockSize);
    for (var i = 0; i < nbBlocks; i++) {
        var currentBlock = buffer.slice(chunkSize * i, chunkSize * (i + 1));
        var encryptedChunk = crypto.publicEncrypt({
            key: publicKey,
            padding: _padding
        }, currentBlock);

        encryptedChunk.copy(outputBuffer, i * blockSize);
    }

    return {
        data: outputBuffer.toString(_encoding),
        sign: this._sign(outputBuffer)
    };
};*/

module.exports = router;
