const AccountModel = require('./model')
var jwt = require('jsonwebtoken')
const md5 = require('md5')
const {controller} = require('../../utils/controller')
const encrypt_key = '30a1514084ef'
module.exports = {
    login: controller(['username','password'],function*({req,fail}){
        let params = req.body
        if (!params.username || params.username.length < 3) {
            fail(111,'username length should >= 3')
        }
        if (!params.password || params.password.length < 6) {
            fail(112,'password length should >= 6')
        }
        params.password = md5(encrypt_key + params.password)
        let account = yield AccountModel.findOne(params)
        if (account) {
            let userToken = jwt.sign(
                {username:params.username}, // 只有使用对象
                encrypt_key,
                { expiresIn: '100h' } // 才能设置过期时间
            )
            return userToken
        } else {
            fail(114,'incorrect username or password')
        }
    }),
    register: controller(['username','password'],function*({req,fail}){
        let params = req.body
        if (!params.username || params.username.length < 3) {
            fail(111,'username length should >= 3')
        }
        if (!params.username || params.username.length > 50) {
            fail(1112,'username length should <= 50')
        }
        if (!params.password || params.password.length < 6) {
            fail(112,'password length should >= 6')
        }
        if (!params.password || params.password.length > 30) {
            fail(1122,'password length should <= 30')
        }
        const isDuplicatedUsername = yield AccountModel.findOne({'username': params.username})
        if(isDuplicatedUsername) {
            fail(113,'duplicated username')
        }
        params.password = md5(encrypt_key + params.password)
        let result = yield AccountModel.create(params)
        if (result) {
            return result
        } else {
            fail(114,'create account failed')
        }
    }),
    verify: controller([],function*({req,fail}){ //登陆鉴权测试接口
        const userToken = req.headers.token
        try {
            const decoded = yield jwt.verify(userToken, encrypt_key)
            return decoded
        } catch (e) {
            fail(401, 'authorization failed')
        }
    })
}
