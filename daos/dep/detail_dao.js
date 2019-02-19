'use strict';
const mongoose = require("mongoose");
const fileRepo = mongoose.model("fileRepo");
const Default_Val = require('../utils/default_val');
const Db_Tool = require('../utils/db_tool');
const find = Db_Tool.find.bind(fileRepo);
const findOne = Db_Tool.findOne.bind(fileRepo);
const insertOne = Db_Tool.insertOne.bind(fileRepo);
const findOneAndRemove = Db_Tool.findOneAndRemove.bind(fileRepo);
const findOneAndUpdate = Db_Tool.findOneAndUpdate.bind(fileRepo);

const getCreatDateCondition = require('../utils/tools').getCreatDateCondition;
const escapeString = require('workplus-escape').escapeString;

const getQueryCondition = function(params){
	console.log(params)
	const condition = params;

	// const condition = {};
	// condition.appId = params.appId;
	// condition.father = params.father;

	if(params.from || params.to){
		condition.createDate = getCreatDateCondition(params.from, params.to);
	}
	if(params.url){
		condition.url = params.url;
	}
	if(params.type){
		condition.type = params.type;
	}
	return condition;
};
const updateFile = function(params){
	const condition = {_id:params._id}
	return findOneAndUpdate(condition,{mediaId:params.mediaId,link:params.link})
}
const getFile = function(params){
	console.log(' ********** getQueryCondition ********** ')
	const condition = getQueryCondition(params);
	console.log('condition', condition);
	console.log(' ********** getQueryCondition ********** ')
	const sort = {
		_id: -1
	};
	const thisParams = {
		sort,
		size: params.size
	};
	return find(condition)
		.limit(thisParams.size || Default_Val.size)
		.sort(thisParams.sort || Default_Val.sortType)
		.exec()
		.then(Db_Tool.toSimpleObject);
}

const getList = function(params){
	console.log(' ********** getQueryCondition ********** ')
	const condition = getQueryCondition(params);
	console.log('condition', condition);
	console.log(' ********** getQueryCondition ********** ')
	const projection = {
		name: 1,
		createDate: 1,
	};
	const sort = {
		_id: -1
	};
	const thisParams = {
		projection,
		sort,
		size: params.size
	};
	return find(condition)
		.limit(thisParams.size || Default_Val.size)
		.sort(thisParams.sort || Default_Val.sortType)
		.exec()
		.then(Db_Tool.toSimpleObject);
};

const createFile = function(params){
	const file = Object.assign({}, params, this);
	return insertOne(file);
}
const createDir = function(params){
	const file = Object.assign({}, params, this);
	return insertOne(file);
}

const getFileNameByMediaId = function(mediaId){
	const condition = Object.assign({}, this);
	condition.mediaId = mediaId;
	return findOne(condition)
		.exec()
		.then(Db_Tool.toSimpleObject)	
		.then(data=>data.fileName||mediaId)
}
const getBugById = function(id, appId){
	const condition = Object.assign({}, this);
	condition._id = id;
	condition.appId = appId;
	return findOne(condition)
		.populate('appId')
		.exec()
		.then(Db_Tool.toSimpleObject);
};

const deleteFile = function({fileId,ownerId}){
	const condition = Object.assign({}, this);
	condition._id = fileId;
	condition.ownerId = ownerId;
	return findOneAndRemove(condition);
};


module.exports = {
	getList,
	createFile,
	getBugById,
	deleteFile,
	createDir,
	getFileNameByMediaId,
	updateFile,
}


