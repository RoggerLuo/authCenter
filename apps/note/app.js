const dao = require('./dao')
const statisticDao = require('../statistic/dao')
const historyDao = require('../history/dao')
const {controller} = require('../../utils/controller')
/* error code basic: 1 */
module.exports = {
    search: controller(['keywords'],function*({req}){
        const username = req.headers.username
        const {startIndex,pageSize} = req.query
        const kw = req.query.keywords.split(',')
        if(kw[0]) {
            const reg = RegExp(kw[0],"i")
            const condition = {username: req.headers.username,content:{$regex:reg}}
            const {count,data} = yield dao.paginationFind(condition,{startIndex,pageSize})
            yield kw.map(name => historyDao.addHistory({name,username}))
            return {total:count,data}
        }else{
            return {total:0,data:[]}
        }
    }),
    getList: controller([],function*({req}){
        const {startIndex,pageSize} = req.query
        const condition = {username: req.headers.username,status:0}
        const {count,data} = yield dao.paginationFind(condition,{startIndex,pageSize})
        return {total:count,data}
    }),
    updateOne: controller(['_id','content'],function*({req,fail}){
        const username = req.headers.username
        const content = req.body.content
        const modifyTime = Date.now()
        const _id = req.params._id
        const exist = yield dao.findOne({_id})
        if(exist) {
            yield dao.updateOne({_id},{content,modifyTime})
            yield statisticDao.incrementModifyCount(username)
            return 'ok'    
        }else{
            fail(4011,'note does not exist')
        }
    }),
    create: controller(['content'],function*({req}){
        const username = req.headers.username
        const content = req.body.content
        const createTime = Date.now()
        const entry = yield dao.create({content, username, createTime, modifyTime: createTime,status:0})
        yield statisticDao.incrementCreateCount(username)
        return entry
    }),
    deleteOne: controller(['_id'],function*({req,fail}){
        const condition = {_id:req.params._id}
        const rs = yield dao.findOne(condition)
        if(rs === null) fail(240,'note does not exist')
        yield dao.updateOne(condition,{status:1})
        return 'ok'
    })
}