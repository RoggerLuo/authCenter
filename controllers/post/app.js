const HandleRes = require('../../utils/handle_res')
const Validate = require('../../utils/validate')
const dao = require('./dao')
const thumbApp = require('../thumb/app')
const {getAuthor} = require('../auth/dao')
const {getSubject,updatePostCount,updatePopularity} = require('../subject/dao')
const {controller} = require('../../utils/controller')
const userId = 'c80250ac61534b178ffb9d001f537da7'
/* post error code basic: 2 */
module.exports = {
    getList: controller(['subjectId'],function*({req}){
        const {startIndex,pageSize} = req.query
        const condition = {subjectId:req.query.subjectId}
        const {count,data} = yield dao.paginationFind(condition,{startIndex,pageSize})
        const authors = yield data.map(el=>getAuthor(el.authorId))
        const thumbStatus = yield data.map(el=>thumbApp.isThumbed({postId:req.params._id,userId}))
        const subjectInfo = yield getSubject(req.query.subjectId)
        data.forEach((el,ind)=>{
            el.authorInfo = authors[ind]
            el.thumbStatus = thumbStatus[ind]
            delete el.authorid
        })
        return {total:count,data,subjectInfo}
    }),
    create: controller([ 'title', 'content', 'images', 'subjectId' ],function*({req, res}){
        let entry = yield dao.create({...req.body, authorId:userId, createTime: Date.now()})
        const len = yield dao.count({subjectId:req.body.subjectId})
        yield updatePostCount(req.body.subjectId,len)
        yield updatePopularity(req.body.subjectId)
        return {_id: entry._id}
    }),
    getOne: controller(['_id'],function*({req}){
        let post = yield dao.incrementReadNumber(req.params._id) // 阅读+1
        if(post) {
            post.thumbStatus = yield thumbApp.isThumbed({postId:req.params._id,userId})
            post.authorInfo = yield getAuthor(userId)
        }
        return post
    }),
    deleteOne: controller(['_id'],function*({req,fail}){
        const rs = yield dao.findOne({_id:req.params._id})
        if(rs === null) fail(240,'post does not exist')
        const subjectId = yield dao.getSubjectId(req.params._id)
        yield dao.deleteOne(req.params)

        const len = yield dao.count({subjectId})
        yield updatePostCount(subjectId,len)
        return 'ok'
    }),
}





// const co = require('co')
const updateAppById = function(req, res){
	const client = HandleRes.getResFn(res);
	co(function*(){
		let rParams = [ 'id', 'name' ];
		let params = Object.assign({}, req.params, req.body);
		yield Validate.isParamsLost(rParams, params);
		let app = yield ApplicationDao.updateAppById(req.params.id, req.body.name);
		client.success({appKey: app._id});
	}).catch(client.fail);
};




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
