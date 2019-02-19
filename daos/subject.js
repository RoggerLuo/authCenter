const mongoose = require("mongoose")
const wrap = require('../utils/toSimpleObject')
const _ops = require('../utils/ops')
const _model = mongoose.model("subject")
const ops = _ops.bind(_model)()
const getCreatDateCondition = require('../utils/tools').getCreatDateCondition
function getQueryCondition({url,type,appId,...params}){
    const condition = {}
    if(appId) condition.appId = appId
	if(url) condition.url = url		
    if(type) condition.type = type
    if(params.from || params.to){
		condition.createDate = getCreatDateCondition(params.from, params.to)
	}
	return condition
}

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
	return findOneAndRemove(condition)
}
module.exports = {
	getList:wrap(getList),
	create:wrap(create),
	// get:wrap(get),
	deleteOne:wrap(deleteOne)
}
/* 
*/