const mongoose = require("mongoose")
const operations = require('./operations')
const toObject = require('./toObject')
module.exports = {getDao,toObject,operations}
function getDao(modelName){
    const _model = mongoose.model(modelName)
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
        count: condition => ops.count(condition).exec(),
        * paginationFind(condition,{startIndex,pageSize}){
            if(startIndex) startIndex = parseInt(startIndex)
            if(pageSize) pageSize = parseInt(pageSize)
            const [count,data] = yield [
                ops.count(condition),
                ops.find(condition).skip(startIndex||0).limit(pageSize||10).sort({_id: -1}).exec().then(toObject)
            ]
            return {count,data}
        }
    }
}