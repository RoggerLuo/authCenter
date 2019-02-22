const {toObject} = require('../utils/dao')
function* pagination(query,condition,ops){
    let {startIndex,pageSize} = query
    if(startIndex) startIndex = parseInt(startIndex)
    if(pageSize) pageSize = parseInt(pageSize)
    const [count,data] = yield [
        ops.count(condition),
        ops.find(condition).skip(startIndex||0).limit(pageSize||10).sort({_id: -1}).exec().then(toObject)
    ]
    return [count,data]
}
module.exports = pagination