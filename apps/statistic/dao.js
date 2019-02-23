const {getDao} = require('../../utils/dao')
const dao = getDao(require('./model'))
function* existOrCreate(username){
    const date = getToday()
    const entry = yield dao.findOne({date,username})
    if(!entry){
        yield dao.create({date,username})
    }
    return {date,username}
}
module.exports = {
    ...dao,
    *incrementCreateCount(username){
        const condition = yield existOrCreate(username)
        const update = {"$inc": {createCount: 1}}
        return dao.operations.findOneAndUpdate(condition, update, {new: true}).exec()
    },
    incrementModifyCount(username){
        const condition = yield existOrCreate(username)
        const update = {"$inc": {modifyCount: 1}}
        return dao.operations.findOneAndUpdate(condition, update, {new: true}).exec()
    },
}
function getToday(){
    return new Date(new Date().setHours(0, 0, 0, 0))/1000
}
