const co = require('co')
const HandleRes = require('../../utils/handle_res')
const Validate = require('../../utils/validate')
// const AccountDao = require('../daos/account_dao')
const {isLoggedIn,fetchInfo} = require('./helper')

// const response = require('../util/response-util');
// const router = require("koa-router")();
const AccountModel = require('./model');
var jwt = require('jsonwebtoken');
// const key = require('../config/secret-key');
const md5 = require('md5');
const {controller,delay} = require('../../utils/controller')
const key = 'b296c7ec-a441-46cb-948a-30a1514084ef'
function guid() { 
    function S4() { 
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
     }; 
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()); 
}; 
const register = controller(['username','password'],function*({req,fail}){
    let requestAccount = req.body
    if (!requestAccount.username || requestAccount.username.length < 3) {
        fail(111,'length of username need >= 3');
    }
    if (!requestAccount.password || requestAccount.password.length < 6) {
        fail(112,'length of password need >= 6')
    }
    const isDuplicatedUsername = yield AccountModel.findOne({'username': requestAccount.username});
    if(isDuplicatedUsername) {
        fail(113,'duplicated username')
    }
    requestAccount.password = md5(key + requestAccount.password);
    requestAccount.user_id = guid()
    let result = yield AccountModel.create(requestAccount);
    if (result) {
        return result
    } else {
        throw Error('create account failed');
    }
})
const logout = async (ctx) => {
    let username = ctx.query.username;
    if (!username) {
        ctx.throw(400, 'need username');
    }

    let result = await  AccountModel.findOneAndDelete(username);
    if (result) ctx.body = response.createOKResponse(result);
    else ctx.body = response.createFailedResponse(500, 'delete account fail')
}
//登陆接口
const login = controller(['username','password'],function*({req,fail}){ //async (ctx) => {
    let requestAccount = req.body
    if (!requestAccount.username || requestAccount.username.length < 3) {
        fail(111,'length of username need >= 3');
    }
    if (!requestAccount.password || requestAccount.password.length < 6) {
        fail(112,'length of password need >= 6')
    }
    requestAccount.password = md5(key + requestAccount.password);
    let account = yield AccountModel.findOne(requestAccount);
    if (account) {
        // let cert = fs.readFileSync(path.resolve(__dirname, '../config/jwt.pem'));
        let userToken = jwt.sign({
                _id: account._id,
                username: account.username
            },key)
            // , cert,
            // {
            //     algorithm: 'RS256',
            //     expiresIn: '1h'
            // });
        return userToken
    } else {
        fail(114, 'wrong username or password')
    }

})
//登陆鉴权测试接口
router.get('/test', async (ctx) => {
    userToken = ctx.request.get('Authorization');
    let cert = fs.readFileSync(path.resolve(__dirname, '../config/jwt_pub.pem'));

    try {
        const decoded = await jwt.verify(userToken, cert);
        ctx.body = response.createOKResponse(decoded);
    } catch (e) {
        ctx.throw(401, 'need authorization')
    }
});
module.exports = {
    login,
    // logout,
    register
}