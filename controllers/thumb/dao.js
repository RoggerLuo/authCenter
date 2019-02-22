const {getDao,toObject} = require('../../utils/dao')
const dao = getDao(require('./model'))
module.exports = {
    ...dao,
}


