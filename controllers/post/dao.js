const mongoose = require("mongoose")
const wrap = require('../../utils/toSimpleObject')
const _ops = require('../../utils/ops')
require('./model')
const _model = mongoose.model("post")
const ops = _ops.bind(_model)()
const create = params => ops.insertOne({...params})
const getList = (params={}) => {
    const condition = getQueryCondition(params)
	console.log(' ********** getQueryCondition ********** ')
	console.log('condition', condition)
	console.log(' ********** getQueryCondition ********** ')
	const sort = {_id: -1}
	return ops.find(condition).sort(sort).exec()
}
const deleteOne = function({_id}){
	const condition = {_id}
	return ops.findOneAndRemove(condition).exec()
}
const find = (condition) => { 
    return ops.find(condition).exec() 
}

// const Db_Tool = require('../../utils/db_tool')
// const getCreatDateCondition = require('../../utils/tools').getCreatDateCondition
// const getQueryCondition = function({url,type,appId,...params}){
//     const condition = {}
//     if(appId) condition.appId = appId
// 	if(url) condition.url = url		
//     if(type) condition.type = type
//     if(params.from || params.to){
// 		condition.createDate = getCreatDateCondition(params.from, params.to)
// 	}
// 	return condition
// }

module.exports = {
	getList:wrap(getList),
	create:wrap(create),
	find:wrap(find),
	deleteOne:wrap(deleteOne)
}