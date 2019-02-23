const {getDao} = require('../../utils/dao')
const dao = getDao(require('./model'))
module.exports = {
    ...dao,
    *addHistory({username,name}){
        const exist = yield dao.findOne({name,username})
        if(exist) {
            yield dao.updateOne({name,username},{createTime:Date.now()})
        }else {
            yield dao.create({name,username,createTime:Date.now()})
        }
    }
}