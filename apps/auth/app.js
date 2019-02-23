const AccountModel = require('./model')
var jwt = require('jsonwebtoken')
const md5 = require('md5')
const {controller} = require('../../utils/controller')
const encrypt_key = 'b296c7ec-a441-46cb-948a-30a1514084ef'
module.exports = {
    login: controller(['username','password'],function*({req,fail}){
        let requestAccount = req.body
        if (!requestAccount.username || requestAccount.username.length < 3) {
            fail(111,'length of username need >= 3')
        }
        if (!requestAccount.password || requestAccount.password.length < 6) {
            fail(112,'length of password need >= 6')
        }
        requestAccount.password = md5(encrypt_key + requestAccount.password)
        let account = yield AccountModel.findOne(requestAccount)
        if (account) {
            let userToken = jwt.sign(
                {
                    _id: account._id,
                    username: account.username
                },
                encrypt_key
            )
            return userToken
        } else {
            fail(114, 'wrong username or password')
        }
    }),
    register: controller(['username','password'],function*({req,fail}){
        let requestAccount = req.body
        if (!requestAccount.username || requestAccount.username.length < 3) {
            fail(111,'length of username need >= 3')
        }
        if (!requestAccount.password || requestAccount.password.length < 6) {
            fail(112,'length of password need >= 6')
        }
        const isDuplicatedUsername = yield AccountModel.findOne({'username': requestAccount.username})
        if(isDuplicatedUsername) {
            fail(113,'duplicated username')
        }
        requestAccount.password = md5(encrypt_key + requestAccount.password)
        requestAccount.user_id = guid()
        let result = yield AccountModel.create(requestAccount)
        if (result) {
            return result
        } else {
            fail(114,'create account failed')
        }
    }),
    verify: controller([],function*({req,fail}){ //登陆鉴权测试接口
        const userToken = req.query.token
        try {
            const decoded = yield jwt.verify(userToken, encrypt_key)
            return decoded
        } catch (e) {
            fail(401, 'authorization failed')
        }
    })
}
function guid() { 
    function S4() { 
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1) 
    } 
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()) 
} 
