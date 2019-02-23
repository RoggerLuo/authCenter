const {getDao} = require('../../utils/dao')
const dao = getDao(require('./model'))
module.exports = {
    ...dao,
    *addHistory({username,name}){
        return yield dao.create({name,username,createTime:Date.now()})
    }
}

