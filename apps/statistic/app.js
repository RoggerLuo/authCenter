const dao = require('./dao')
/* error code basic: 4 */
module.exports = {
    getList: controller([],function*({req}){
        const condition = {username: req.headers.username}
        return yield dao.find(condition)
    })
}