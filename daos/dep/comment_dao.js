'use strict';

const mongoose = require("mongoose");
const Comment = mongoose.model("comment");
const Default_Val = require('../utils/default_val');
const Db_Tool = require('../utils/db_tool');
const find = Db_Tool.find.bind(Comment);
const findOne = Db_Tool.findOne.bind(Comment);
const insertOne = Db_Tool.insertOne.bind(Comment);
const findOneAndRemove = Db_Tool.findOneAndRemove.bind(Comment);

const getCreatDateCondition = require('../utils/tools').getCreatDateCondition;
const escapeString = require('workplus-escape').escapeString;

const deleteById = function(id,ownerId){
	const condition = Object.assign({}, this);
	condition._id = id;
	condition.ownerId = ownerId;
	return findOneAndRemove(condition);
}

const getListById = function({dirId}){
	const condition = Object.assign({}, this)
	condition.dirId = dirId
	return find(condition)
		.exec()
		.then(Db_Tool.toSimpleObject)
}

const getQueryCondition = function(params){
	console.log(params)
	const condition = {};
	condition.appId = params.appId;
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

const getBugs = function(params){
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

const createComment = function(params){
	const bug = Object.assign({}, params, this);
	return insertOne(bug);
};


module.exports = {
	getBugs,
	createComment,
	getListById,
	deleteById,
};