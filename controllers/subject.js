const co = require('co');
const mongoose = require('mongoose');
const uuid = require('node-uuid');
const HandleRes = require('../utils/handle_res');
const Validate = require('../utils/validate');
// const ApplicationDao = require('../daos/application_dao');
const dao = require('../daos/subject');
const deleteOne = function(req, res){
	const client = HandleRes.getResFn(res)
	co(function*(){
		let rParams = [ '_id' ]
		yield Validate.isParamsLost(rParams, req.params)
		const res = yield dao.deleteOne({_id:req.params._id})
		client.success(res)
	}).catch(client.fail)
};
const getList = function(req, res){
    const client = HandleRes.getResFn(res)
    // const mockData = [
    //     {id:0,name:'上下班拼车',popularity:100,logoImage:''},
    //     {id:1,name:'二手市场',popularity:200,logoImage:''},
    //     {id:2,name:'直通CEO',popularity:300,logoImage:''},
    //     {id:3,name:'篮球俱乐部',popularity:400,logoImage:''},
    //     {id:4,name:'羽毛球俱乐部',popularity:200,logoImage:''},
    //     {id:5,name:'象棋俱乐部',popularity:100,logoImage:''}        
    // ]

	co(function*(){
		// let condition = {}//{ownerId:req.session.userId}
		const data = yield dao.getList()
		client.success(data)
	}).catch(client.fail);
};

const create = function(req, res){
	const client = HandleRes.getResFn(res);
	// if(!req.session.userId){
	// 	client.success('PleaseLogIn')
	// 	return
	// }
	co(function*(){
		let rParams = [ 'name' ]
		yield Validate.isParamsLost(rParams, req.body)
		let entry = yield dao.create(req.body)
		client.success({subjectKey: entry._id})
	}).catch(client.fail)
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
		// let apps = yield ApplicationDao.getList(condition);
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
    // if(!req.session.userId){
	// 	client.success('PleaseLogIn')
	// 	return
	// }
	co(function*(){
		// let condition = {}//{ownerId:req.session.userId}
		// let apps = yield ApplicationDao.getList(condition);
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
};



const getAppById = function(req, res){
	const client = HandleRes.getResFn(res);
	if(!req.session.userId){
		client.success('PleaseLogIn')
		return
	}


	co(function*(){
		let rParams = [ 'id' ];
		yield Validate.isParamsLost(rParams, req.params);
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			client.fail(new Error('e_find_no_app'));
			return;
		}
		// let app = yield ApplicationDao.getAppById(req.params.id);
		client.success('app');
	}).catch(client.fail);
};

const getAppByName = function(req, res){
	const client = HandleRes.getResFn(res);
	if(!req.session.userId){
		client.success('PleaseLogIn')
		return
	}


	co(function*(){
		// let app = yield ApplicationDao.getAppByName(req.query.name);
		client.success('app');
	}).catch(client.fail);
};

const updateAppById = function(req, res){
	const client = HandleRes.getResFn(res);
	if(!req.session.userId){
		client.success('PleaseLogIn')
		return
	}

	co(function*(){
		let rParams = [ 'id', 'name' ];
		let params = Object.assign({}, req.params, req.body);
		yield Validate.isParamsLost(rParams, params);
		// let app = yield ApplicationDao.updateAppById(req.params.id, req.body.name);
		client.success('{appKey: app._id}');
	}).catch(client.fail);
};




const categorize = function(req, res) {
    const client = HandleRes.getResFn(res);
    co(function*() {
        let rParams = ['appId', 'categoryId'];
        let params = Object.assign({}, req.params, req.body)
        params.ownerId = req.session.userId
        yield Validate.isParamsLost(rParams, params)
        // let ok = yield ApplicationDao.categorize(params)
        client.success('ok')
    }).catch(client.fail)
}

module.exports = {
	getList,
	create,
	getAppById,
	getAppByName,
	updateAppById,
	deleteOne,
	categorize,
	getbannedusers,
	getbannedusersadd,
	getpostAdmin,
	getpostdetails
};