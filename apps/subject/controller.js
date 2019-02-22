const co = require('co');
const HandleRes = require('../../utils/handle_res');
const dao = require('./dao');
const {controller} = require('../../utils/controller')
const {isFollowed} = require('../subjectFollow/controller')

const userId = 'c80250ac61534b178ffb9d001f537da7'

//用户禁言
const getbannedusers = function(req, res){
    const client = HandleRes.getResFn(res)
    const mockData = [
        {id:0,username:'张三',bannedBeginTime:'2019-1-29',bannedEndTime:'2019-10-20'},
        {id:1,username:'李四',bannedBeginTime:'2019-1-30',bannedEndTime:'2019-10-21'},
        {id:2,username:'小五',bannedBeginTime:'2019-1-31',bannedEndTime:'2019-10-22'}
        
    ]
	co(function*(){
		client.success(mockData)
	}).catch(client.fail);
};
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
	co(function*(){
		client.success(mockData)
	}).catch(client.fail);
};
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
	}).catch(client.fail);
};
//帖子详情
const getpostdetails = function(req, res){
    const client = HandleRes.getResFn(res)
    const mockData = [
         {id:0,username:'张三',sectorname:'上下班拼车',PostingTime:'2018-12-29',PostTitle:'拼拼拼车上下班！拼',readNumber:'43',PostCon:'每位5元，不赚钱，交个朋友',attention:'100',PostNumber:'200',Popula:'500',commentsTime:'2018-10-23',
         comments:'这是评论，这评论，这是评论，这是评',replier:'李四',repliers:'王五'}   
    ]
	co(function*(){
		client.success(mockData)
	}).catch(client.fail);
}

module.exports = {
    
	getList: controller([],function*({req}){
        const data = yield dao.getList()
        const isFollowedStatus = yield data.map(el=>isFollowed({subjectId:el._id,userId}))
        data.forEach((el,ind)=>{
            el.followedStatus = isFollowedStatus[ind]
        })
        return data
    }),
	create: controller(['name'],function*({req}){
        let entry = yield dao.create(req.body)
        return {subjectKey: entry._id}
    }),
    deleteOne: controller([ '_id' ],function*({req}){
		const res = yield dao.deleteOne({_id:req.params._id})
        return res
    }),
    getbannedusers,getbannedusersadd,getpostAdmin,getpostdetails
}
