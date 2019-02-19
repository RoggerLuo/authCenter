'use strict';

const co = require('co');
const mongoose = require('mongoose');
const uuid = require('node-uuid');
const getUserAgent = require('../utils/tools').getUserAgent;
const HandleRes = require('../utils/handle_res');
const Validate = require('../utils/validate');
const BugDao = require('../daos/bug_dao');
const ApplicationDao = require('../daos/application_dao');

const getBugs = function(req, res){
	const client = HandleRes.getResFn(res);
	co(function*(){
		let params = Object.assign({}, req.params, req.query);
		let bugs = yield BugDao.getBugs(params);
		let numStart = params.start || 0;
		let rBugs = bugs.slice(numStart);
		client.success(rBugs);
	}).catch(client.fail);
};

const getBugTypes = function(req, res){
	const client = HandleRes.getResFn(res);
	co(function*(){
		let bugs = yield BugDao.getBugs({appId: req.params.appId});
		let bugUrls = _.uniq(_.map(bugs, 'url'));
		let bugBrowsers = _.map(bugs, 'userAgent.browser');
		let bugType = {};
		_.forEach(bugBrowsers, function(browser){
			if(!bugType[browser.name]){
				bugType[browser.name] = [browser.major];
				return;
			}
			if(bugType[browser.name].indexOf(browser.major) != -1)
				return;
			bugType[browser.name].push(browser.major);
		});
		let rBugInfos = {
			types: bugType,
			urls: bugUrls
		};
		client.success(rBugInfos);
	}).catch(client.fail);
};

const createBug = function(req, res){
	// 统计终端类型，并提供接口返回
	const client = HandleRes.getResFn(res);
	co(function*(){
		let rParams = [ 'appId' ];
		let params = Object.assign({}, req.params, req.body);
		yield Validate.isParamsLost(rParams, params);
		params.userAgent = getUserAgent(req.headers['user-agent']);
		params.type = params.userAgent.browser.name + '$' + params.userAgent.browser.major;
		let bug = yield BugDao.createBug(params);
		client.success(bug._id);
	}).catch(client.fail);
};

const getBugById = function(req, res){
	const client = HandleRes.getResFn(res);
	co(function*(){
		let rParams = [ 'appId', 'bugId' ];
		let params = Object.assign({}, req.params, req.body);
		if(!mongoose.Types.ObjectId.isValid(req.params.bugId)){
			client.fail(new Error('e_find_no_bug'));
			return;
		}
		yield Validate.isParamsLost(rParams, params);
		let bug = yield BugDao.getBugById(params.bugId, params.appId);
		client.success(bug);
	}).catch(client.fail);
};

const deleteBugById = function(req, res){
	const client = HandleRes.getResFn(res);
	co(function*(){
		let rParams = [ 'appId', 'bugId' ];
		let params = Object.assign({}, req.params, req.body);
		yield Validate.isParamsLost(rParams, params);
		let bug = yield BugDao.deleteBugById(params.bugId);
		client.success(bug);
	}).catch(client.fail);
};

module.exports = {
	getBugs,
	getBugTypes,
	createBug,
	getBugById,
	deleteBugById,
};