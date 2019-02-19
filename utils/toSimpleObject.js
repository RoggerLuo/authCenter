const toSimpleObject = function(mongooseObj) {
	if (!mongooseObj) {
		return mongooseObj
	}
	if (mongooseObj instanceof Array) {
		return mongooseObj.map(obj => obj.toObject());
	} else {
        if(mongooseObj.toObject) {
            return mongooseObj.toObject()
        } else {
            return null
        }
	}
};
const wrap = func => params => {
    return func(params).then(toSimpleObject)
}

module.exports = wrap
