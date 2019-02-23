const dao = require('./dao')
/* error code basic: 4 */
const {controller} = require('../../utils/controller')
module.exports = {
    getList: controller([],function*({req}){
        const condition = {username: req.headers.username}
        return yield dao.find(condition)
    })
}