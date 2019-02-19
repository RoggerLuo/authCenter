
const mongoose = require("mongoose");

const toSimpleObject = function(mongooseObj) {
	if (!mongooseObj) {
		return mongooseObj;
	}
	if (mongooseObj instanceof Array) {
		return mongooseObj.map(obj => obj.toObject());
	} else {
		return mongooseObj.toObject();
	}
};
function init(){
    const find = (condition, projection, option) => {
        console.log("查询条件是", condition);
        const obj = this.find(condition, projection, option).select(projection || {})
        obj.toSimpleObject = obj => toSimpleObject(obj)
        return obj 
    };
    const insertOne = (obj) => {
        console.log("创建对象", obj);
        return this.create(obj).then(toSimpleObject);
    }
    const findOneAndRemove = function(condition, option) {
        console.log("删除条件是", condition);
        return this.findOneAndRemove(condition, option).exec().then(toSimpleObject);
    };
    
    return {find,insertOne,findOneAndRemove}
}
const findOneAndUpdate = function(condition, update, option) {
	console.log("需要更新的对象是", condition, update);
	return this.findOneAndUpdate(condition, update, option).exec().then(toSimpleObject);
};


const find = function(condition, projection, option) {
	console.log("查询条件是", condition);
	return this.find(condition, projection, option).select(projection || {});
};
const insertOne = function(obj) {
	console.log("创建对象", obj);
	return this.create(obj).then(toSimpleObject);
};
const insertMany = function(objs) {
	if (objs.length < 10) {
		console.log("批量创建对象", objs);
	} else {
		console.log("批量创建对象数量太多不显示了");
	}
	return this.insertMany(objs).then(toSimpleObject);
};
const findOne = function(condition, projection, option) {
	console.log("查询条件是", condition);
	return this.findOne(condition, projection, option).select(projection || {});
};
const remove = function(condition) {
	console.log("删除条件是", condition);
	return this.remove(condition).exec();
};
const findOneAndRemove = function(condition, option) {
	console.log("删除条件是", condition);
	return this.findOneAndRemove(condition, option).exec().then(toSimpleObject);
};
const count = function(condition) {
	console.log("计数条件是", condition);
	return this.count(condition).exec();
};

const getRandomChar = function(length, range) {
	let result = "";
	for (let i = 0; i < length; i++) {
		result += String.fromCharCode(((Math.random() * range) + 97)); //97就是a
	}
	return result;
};
/*
//这三者究竟什么关系
mongoose.mongo.ObjectId：原生驱动里面的东西，可以用来将字符串转为原生的ObjectId
mongoose.Types.ObjectId：和上面的东西通过===比较结果是true
mongoose.Schema.Types.ObjectId：本质上是为了表明类型，和String，Number是同一个抽象层次的东西，用于schema中表明一样东西是ObjectId类型
*/

const dateToObjectId = function(date, realObjectId = false) {
	if (typeof date === "string" || typeof date === "number") {
		date = new Date(date);
	}
	if (date.toString() === "Invalid Date") {
		throw new Error("给个能代表日期的参数");
	}
	const suffix = realObjectId === true ? getRandomChar(16, 6) : "0000000000000000"; //当需要objectId对象的时候，才随机化后面的部分
	if (realObjectId === true) {
		//利用了mongo的原生驱动
		return new mongoose.mongo.ObjectId(Math.floor(date.getTime() / 1000).toString(16) + suffix);
	} else {
		return Math.floor(date.getTime() / 1000).toString(16) + suffix;
	}
};

const update = function(condition, update, option) {
	console.log("批量更新条件是", condition);
	return this.update(condition, update, option).exec();
};

module.exports = {
    init,
	findOneAndUpdate,
	toSimpleObject,
	find,
	insertOne,
	insertMany,
	findOne,
	count,
	dateToObjectId,
	remove,
	findOneAndRemove,
	update
};