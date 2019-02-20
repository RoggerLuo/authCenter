module.exports = {
    toObject, operations
}
function toObject(mongooseObj) {
	if (!mongooseObj) {
		return mongooseObj
	}
	if (mongooseObj instanceof Array) {
		return mongooseObj.map(obj => obj.toObject());
	} else {
        if(mongooseObj.toObject) {
            return mongooseObj.toObject()
        } else {
            return null
        }
	}
}
function operations(){
    const count = condition => {
        return this.count(condition)
    }
    const find = (condition, projection, option) => {
        console.log("查询条件是", condition);
        return this.find(condition, projection, option).select(projection || {})
    }
    const insertOne = (obj) => {
        console.log("创建对象", obj)
        return this.create(obj)
    }
    const findOne = (condition) => {
        return this.findOne(condition)
    }
    const findOneAndRemove = (condition, option) => {
        console.log("删除条件是", condition)
        return this.findOneAndRemove(condition, option)
    }
    const findOneAndUpdate = (condition, update, option) => {
        console.log("需要更新的对象是", condition, update);
        return this.findOneAndUpdate(condition, update, option);
    };
    return {count,find,findOne,insertOne,findOneAndRemove,findOneAndUpdate} 
}
