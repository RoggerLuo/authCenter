const mongoose = require("mongoose")
require('./model')
const _model = mongoose.model("commentThumb")
const {toObject,operations} = require('../../utils/dao')
const ops = operations.bind(_model)()
module.exports = {
	create: params => ops.insertOne({...params}).then(toObject),
	find: (condition) => { 
        return ops.find(condition).exec().then(toObject)
    },
    deleteOne({_id}){
        const condition = {_id}
        return ops.findOneAndRemove(condition).exec().then(toObject)
    },
    incrementReadNumber(_id){
        const update = {"$inc": {readNumber: 1}}
        return ops.findOneAndUpdate({_id}, update, {new: true}).exec() 
    },
    getList: (condition={}) => {
        const sort = {_id: -1}
        return ops.find(condition).sort(sort).exec().then(toObject)
    }
}


