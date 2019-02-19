'use strict';

const co = require('co');
const mongoose = require('mongoose');
const Application = mongoose.model('App');
const Default_Val = require('../utils/default_val');
const Db_Tool = require('../utils/db_tool');
const find = Db_Tool.find.bind(Application);
const findOne = Db_Tool.findOne.bind(Application);
const insertOne = Db_Tool.insertOne.bind(Application);
const findOneAndRemove = Db_Tool.findOneAndRemove.bind(Application);
const findOneAndUpdate = Db_Tool.findOneAndUpdate.bind(Application);


const deleteAppById = function(id,userId){
	const condition = Object.assign({}, this);
	condition._id = id;
	condition.ownerId = userId

	return findOneAndRemove(condition);
};


const getBugNumberOfTheDay = (appId) => {
	/* 减去时差 */
	const endDate = new Date(Date.parse(new Date()) - (new Date()).getTimezoneOffset()*60*1000 )
	const startDate = new Date(Date.parse(new Date()) - 60*60*24*1000 - (new Date()).getTimezoneOffset()*60*1000 )
	const condition = {
		appId:appId,
		createDate:{
			$lte: endDate,
			$gte: startDate
		}
	}
	const bugModel = mongoose.model('Bug')
	const bugFind = Db_Tool.find.bind(bugModel)
	return bugFind(condition).then(Db_Tool.toSimpleObject)
}

const getApps = co.wrap(function*(condition){
	const projection = {
		name: 1,
		createDate: 1,
		modifyDate: 1,
	};
	const sort = {
		_id: -1
	};
	const param = {
		projection,
		sort,
		size: 2048
	};
	
	const appList = yield find(condition)
		.limit(param.size || Default_Val.size)
		.sort(param.sort || Default_Val.sortType)
		.exec()
		.then(Db_Tool.toSimpleObject)
	
	// const promiseMap = appList.map((el)=>{
	// 	return getBugNumberOfTheDay(el._id).then(bugs=>{
	// 		el.bugNumberToday = bugs.length
	// 		return el
	// 	})
	// })
	return appList
})

const createApp = function(rawApp){
	const app = Object.assign({}, rawApp, this);
	return insertOne(app);
};

const getAppById = function(id){
	const condition = Object.assign({}, this);
	condition._id = id;
	return findOne(condition);
};

const getAppByName = function(name){
	const condition = Object.assign({}, this);
	condition.name = name;
	return findOne(condition);
};

const updateAppById = function(id, name){
	const condition = Object.assign({}, this);
	condition._id = id;
	const update = {
		"$set": {
			name
		}
	};
	const option = {
		new: true
	};
	update.modifyDate = new Date();
	return findOneAndUpdate(condition, update, option);
};


const categorize = function(params) {
	const condition = Object.assign({}, this);
	condition._id = params.appId;
	const update = {
		"$set": {
			categoryId: params.categoryId
		}
	};
	const option = {
		// new: true
	};
	update.modifyDate = new Date();
	return findOneAndUpdate(condition, update, option);
}
module.exports = {
	getApps,
	createApp,
	getAppById,
	getAppByName,
	deleteAppById,
	updateAppById,
	categorize

};