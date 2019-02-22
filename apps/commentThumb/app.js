const co = require('co')
// const mongoose = require('mongoose')
const HandleRes = require('../../utils/handle_res')
const Validate = require('../../utils/validate')
const dao = require('./dao')
const {controller} = require('../../utils/controller')
const {updateThumb} = require('../comment/dao')

const userId = 'c80250ac61534b178ffb9d001f537da7'
function* isThumbed({commentId,userId}){
    const data = yield dao.getList({commentId,userId})
    return data.length > 0
}
module.exports = {
	getList(req, res){
        const client = HandleRes.getResFn(res)    
        co(function*(){
            yield Validate.isParamsLost(['subjectId'], req.query)
            const data = yield dao.getList(req.query)
            client.success(data)
        }).catch(client.fail)
    },
    create: controller(['commentId'],function*({req, res}){
        const commentId = req.params.commentId
        const thumbed = yield isThumbed({commentId,userId})
        if(!thumbed) {
            yield dao.create({commentId,userId}) //增加点赞
            const thumbNumber = yield dao.count({commentId})
            yield updateThumb(commentId,thumbNumber) //更新冗余字段    
        }
        return 'ok'
    }),
    deleteOne(req, res){
        const client = HandleRes.getResFn(res)
        co(function*(){
            let rParams = [ '_id' ]
            yield Validate.isParamsLost(rParams, req.params)
            yield dao.deleteOne(req.params)
            client.success('ok')
        }).catch(client.fail)
    },
}



//用户禁言
const getbannedusers = function(req, res){
    const client = HandleRes.getResFn(res)
    const mockData = [
        {id:0,username:'张三',bannedBeginTime:'2019-1-29',bannedEndTime:'2019-10-20'},
        {id:1,username:'李四',bannedBeginTime:'2019-1-30',bannedEndTime:'2019-10-21'},
        {id:2,username:'小五',bannedBeginTime:'2019-1-31',bannedEndTime:'2019-10-22'}
    ]
    // if(!req.session.userId){
	// 	client.success('PleaseLogIn')
	// 	return
	// }
	co(function*(){
		// let condition = {}//{ownerId:req.session.userId}
		// let apps = yield ApplicationDao.getList(condition)
		client.success(mockData)
	}).catch(client.fail)
}
//获取用户
const getbannedusersadd = function(req, res){
    const client = HandleRes.getResFn(res)
    const mockData = [
        {id:0,username:'张三',age:'14'},
        {id:1,username:'李四',age:'32'},
        {id:3,username:'小五',age:'23'},
        {id:4,username:'老六',age:'32'},
        {id:5,username:'小七',age:'12'}
        
    ]
    // if(!req.session.userId){
	// 	client.success('PleaseLogIn')
	// 	return
	// }
	co(function*(){
		// let condition = {}//{ownerId:req.session.userId}
		// let apps = yield ApplicationDao.getList(condition)
		client.success(mockData)
	}).catch(client.fail)
}
//帖子管理
const getpostAdmin = function(req, res){
    const client = HandleRes.getResFn(res)
    const mockData = [
         {id:0,username:'张三',sectorname:'上下班拼车',PostingTime:'2018-12-29',PostTitle:'拼拼拼车上下班！拼'},
        {id:1,username:'李四',sectorname:'二手市场',PostingTime:'2018-12-31',PostTitle:'拼拼拼'},
        {id:3,username:'小五',sectorname:'直通CEO',PostingTime:'2018-12-29',PostTitle:'下班！拼'},
        {id:4,username:'老六',sectorname:'上下班拼车',PostingTime:'2018-12-29',PostTitle:'上下班！拼'},
        {id:5,username:'小七',sectorname:'上下班拼车',PostingTime:'2018-12-29',PostTitle:'拼拼拼车上下班'}
    ]
	co(function*(){
		client.success(mockData)
	}).catch(client.fail)
}