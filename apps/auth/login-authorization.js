const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

module.exports = async function (ctx) {
    const requestToken = ctx.request.get('Authorization');
    let cert = fs.readFileSync(path.resolve(__dirname, '../config/jwt_pub.pem'));
    try {
        return await jwt.verify(requestToken, cert);
    } catch (e) {
        ctx.throw(401);
    }
};

//这样其他地方要获取解析后的jwt直接调用该方法就可以了。