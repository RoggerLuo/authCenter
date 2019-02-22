module.exports = toObject
function toObject(mongooseObj) {
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
}

