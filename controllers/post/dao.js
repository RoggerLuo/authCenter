const {getDao,toObject} = require('../../utils/dao')
const dao = getDao(require('./model'))
module.exports = {
    ...dao,
    incrementReadNumber(_id){
        const update = {"$inc": {readNumber: 1}}
        return dao.operations.findOneAndUpdate({_id}, update, {new: true}).exec().then(toObject) 
    },
    updateThumb:(_id,thumbNumber) => dao.updateOne({_id},{thumbNumber}),
    getSubjectId: postId => dao.findOne({_id:postId}).then(data=>data.subjectId)
}
