const co = require('co')
// const mongoose = require('mongoose')
const HandleRes = require('../../utils/handle_res')
const Validate = require('../../utils/validate')
const dao = require('./dao')
const userId = 'abcde'

const create = function(req, res){
	const client = HandleRes.getResFn(res)
	co(function*(){
		let rParams = [ 'title', 'content', 'images', 'subjectId' ]
        yield Validate.isParamsLost(rParams, req.body)
        req.body.images = JSON.parse(req.body.images) // 为了解析数组
		let entry = yield dao.create({
            ...req.body,
            authorId:userId,
            createTime:Date.now()
        })
		client.success({_id: entry._id})
	}).catch(client.fail)
}
const getList = function(req, res){
    const client = HandleRes.getResFn(res)    
    co(function*(){
        let rParams = [ 'subjectId' ]
		yield Validate.isParamsLost(rParams, req.query)
		// let condition = {}//{ownerId:req.session.userId}
		const data = yield dao.getList(req.query)
		client.success(data)
	}).catch(client.fail)
}

const getOne = function(req, res){
	const client = HandleRes.getResFn(res);
	co(function*(){
        let rParams = [ '_id' ]
        yield Validate.isParamsLost(rParams, req.params)
        let posts = yield dao.find(req.params)
        if(posts.length===0){
            client.success(null)
        }else{
            // 阅读 +1
            const post = posts[0]
            client.success(post)
        }
	}).catch(client.fail)
}
const deleteOne = function(req, res){
	const client = HandleRes.getResFn(res)
	co(function*(){
		let rParams = [ '_id' ]
		yield Validate.isParamsLost(rParams, req.params)
		yield dao.deleteOne(req.params)
		client.success('ok')
	}).catch(client.fail)
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
module.exports = {
	getList,
    create,
    getOne,
    deleteOne,
	// getAppById,
	// getAppByName,
	// updateAppById,
	// deleteOne,
	// categorize,
	// getbannedusers,
	// getbannedusersadd,
	// getpostAdmin,
	// getpostdetails
}


// const dao = require('../daos/post')

// router.get('/', app.getList)
// router.post('/',app.create)
// router.get('/:_id', app.get)
// router.delete('/:_id',app.deleteOne)
// router.get('/search', app.search) 

    // title:def.string,
    // content:def.string,
    // readNumber:def.number,
    // thumbNumber:def.number,
    // replyNumber:def.number,
    // createTime:def.number,
    // images:[],
    // subjectId:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "subject"
    // }
// const uuid = require('node-uuid')
