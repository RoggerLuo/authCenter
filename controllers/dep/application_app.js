'use strict';

const co = require('co');
const mongoose = require('mongoose');
const uuid = require('node-uuid');
const HandleRes = require('../utils/handle_res');
const Validate = require('../utils/validate');
const ApplicationDao = require('../daos/application_dao');

const getApps = function(req, res){
	const client = HandleRes.getResFn(res);
	if(!req.session.userId){
		client.success('PleaseLogIn')
		return
	}


	co(function*(){
		let condition = {}//{ownerId:req.session.userId}
		let apps = yield ApplicationDao.getApps(condition);
		client.success(apps);
	}).catch(client.fail);
};

const createApp = function(req, res){
	const client = HandleRes.getResFn(res);
	if(!req.session.userId){
		client.success('PleaseLogIn')
		return
	}


	co(function*(){
		let rParams = [ 'name' ];
		yield Validate.isParamsLost(rParams, req.body);
		let rawApp = {
			name: req.body.name,
			description: req.body.description || '',
			ownerId:req.session.userId,
			owner:req.session.nickname
		};
		let app = yield ApplicationDao.createApp(rawApp);
		client.success({appKey: app._id});
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
		let app = yield ApplicationDao.getAppById(req.params.id);
		client.success(app);
	}).catch(client.fail);
};

const getAppByName = function(req, res){
	const client = HandleRes.getResFn(res);
	if(!req.session.userId){
		client.success('PleaseLogIn')
		return
	}


	co(function*(){
		let app = yield ApplicationDao.getAppByName(req.query.name);
		client.success(app);
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
		let app = yield ApplicationDao.updateAppById(req.params.id, req.body.name);
		client.success({appKey: app._id});
	}).catch(client.fail);
};

const deleteAppById = function(req, res){
	const client = HandleRes.getResFn(res);
	if(!req.session.userId){
		client.success('PleaseLogIn')
		return
	}

	co(function*(){
		let rParams = [ 'appId' ];

		yield Validate.isParamsLost(rParams, req.params);
		let app = yield ApplicationDao.deleteAppById(req.params.appId,req.session.userId);
		client.success(app);
	}).catch(client.fail);
};


const categorize = function(req, res) {
    const client = HandleRes.getResFn(res);
    co(function*() {
        let rParams = ['appId', 'categoryId'];
        let params = Object.assign({}, req.params, req.body)
        params.ownerId = req.session.userId
        yield Validate.isParamsLost(rParams, params)
        let ok = yield ApplicationDao.categorize(params)
        client.success(ok)
    }).catch(client.fail)
}

module.exports = {
	getApps,
	createApp,
	getAppById,
	getAppByName,
	updateAppById,
	deleteAppById,
	categorize
};