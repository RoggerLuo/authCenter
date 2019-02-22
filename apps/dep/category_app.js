const co = require('co')
const mongoose = require('mongoose')
const uuid = require('node-uuid')
const getUserAgent = require('../utils/tools').getUserAgent
const HandleRes = require('../utils/handle_res')
const Validate = require('../utils/validate')
const categoryDao = require('../daos/category_dao')
const ApplicationDao = require('../daos/application_dao')
function authAdmin(req){
    arr = ['13631489071','13302382076','15913145477','15652815619']
    if(arr.indexOf(req.session.mobile) === -1){
        return false
    }
    return true
}
const getCategories = function(req, res){
	const client = HandleRes.getResFn(res)
	co(function*(){
		let params = Object.assign({}, req.params, req.query)
		let categories = yield categoryDao.getCategories(params)
		client.success(categories)
	}).catch(client.fail)
}

const modifyOrder = function(req, res){
	const client = HandleRes.getResFn(res)
    if(!authAdmin(req)){
       client.fail('sorry，权限不够，您不在管理员列表中') 
       return 
    }  
	co(function*(){
		let rParams = [ 'order', 'id' ]
		let params = Object.assign({}, req.params, req.body);
		yield Validate.isParamsLost(rParams, params);
		let category = yield categoryDao.modifyOrder(params)
		client.success(category);
	}).catch(client.fail);
}

const createCate = function(req, res){
	const client = HandleRes.getResFn(res)
    if(!authAdmin(req)){
       client.fail('sorry，权限不够，您不在管理员列表中') 
       return
    }  

	co(function*(){
		let rParams = [ 'name' ]
		let params = Object.assign({}, req.params, req.body);
		yield Validate.isParamsLost(rParams, params);
		let category = yield categoryDao.createCate(params)
		client.success(category);
	}).catch(client.fail);
}


const deleteById = function(req, res){
	const client = HandleRes.getResFn(res)
    if(!authAdmin(req)){
       client.fail('sorry，权限不够，您不在管理员列表中') 
       return 
    }  
	co(function*(){
		let rParams = [ 'categoryId' ];
		let params = Object.assign({}, req.params, req.body);
		yield Validate.isParamsLost(rParams, params);
		let cate = yield categoryDao.deleteById(params.categoryId);
		client.success(cate)
	}).catch(client.fail);
}



module.exports = {
	getCategories,
	createCate,
	deleteById,
	modifyOrder,
};