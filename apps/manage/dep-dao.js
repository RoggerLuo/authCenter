const mongoose = require("mongoose")
require('./model')
const _model = mongoose.model("post")
const {toObject,operations} = require('../../utils/dao')
const ops = operations.bind(_model)()
const pagination = require('../pagination')
module.exports = {
	getList(query) {
        const condition = {subjectId:query.subjectId}
        return pagination(query,condition,ops)
    },
	create: params => ops.insertOne({...params}).then(toObject),
    find:condition => ops.find(condition).exec().then(toObject), 
    count:condition => ops.count(condition).exec(), 
    deleteOne: ({_id}) => ops.findOneAndRemove({_id}).exec().then(toObject),
    incrementReadNumber(_id){
        const update = {"$inc": {readNumber: 1}}
        return ops.findOneAndUpdate({_id}, update, {new: true}).exec().then(toObject) 
    },
    updateThumb:(_id,thumbNumber) => {
        const update = {"$set": {thumbNumber}}
        return ops.findOneAndUpdate({_id}, update, {new: true}).exec() 
    },
    getSubjectId: postId => ops.find({_id:postId}).exec().then(toObject).then(data=>data[0]?data[0].subjectId:undefined),
}

