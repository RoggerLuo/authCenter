const mongoose = require("mongoose")
const operations = require('./operations')
const toObject = require('./toObject')
module.exports = {getModelMethods,getDao,toObject,operations}
function getDao(modelName){
    const _model = mongoose.model(modelName)
    return getModelMethods(_model)
}
function getModelMethods(_model){
    const ops = operations.bind(_model)()
    return {
        operations:ops,
        find(condition={},options={}) {
            const {skip,limit,sort} = options
            const basic = ops.find(condition)
            if(skip!==undefined) basic.skip(skip)
            if(limit!==undefined) basic.limit(limit)
            if(sort!==undefined) basic.sort(sort)
            return basic.exec().then(toObject)
        },
        create: params => ops.insertOne({...params}).then(toObject),
        findOne: condition => ops.findOne({...condition}).exec().then(toObject), 
        deleteOne: condition => ops.findOneAndRemove(condition).exec().then(toObject),
        updateOne:(condition,params) => ops.findOneAndUpdate(condition, {"$set": params}, {new: true}).exec(),
        count: condition => ops.count(condition).exec()
    }
}
