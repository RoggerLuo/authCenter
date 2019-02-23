const dao = require('./dao')
const statisticDao = require('../statistic/dao')
/* error code basic: 1 */
module.exports = {
    search: controller(['keyword'],function*({req}){
        const {startIndex,pageSize} = req.query
        const reg = RegExp(req.query.keyword,"i")
        const condition = {username: req.headers.username,content:{$regex:reg}}
        const {count,data} = yield dao.find(condition,{startIndex,pageSize})
        return {total:count,data}
    }),
    getList: controller([],function*({req}){
        const {startIndex,pageSize} = req.query
        const condition = {username: req.headers.username}
        const {count,data} = yield dao.paginationFind(condition,{startIndex,pageSize})
        return {total:count,data}
    }),
    updateOne: controller(['_id','content'],function*({req}){
        const username = req.headers.username
        const content = req.body.content
        const modifyTime = Date.now()
        yield dao.updateOne({_id:req.body._id},{content,modifyTime})
        statisticDao.incrementModifyCount(username)
        return 'ok'
    }),
    create: controller(['content'],function*({req}){
        const username = req.headers.username
        const content = req.body.content
        const createTime = Date.now()
        const entry = yield dao.create({content, username, createTime, modifyTime: createTime})
        statisticDao.incrementCreateCount(username)
        return entry
    }),

    deleteOne: controller(['_id'],function*({req,fail}){
        const condition = {_id:req.params._id}
        const rs = yield dao.findOne(condition)
        if(rs === null) fail(240,'note does not exist')
        yield dao.updateOne(condition,{status:1})
        return 'ok'
    }),
}