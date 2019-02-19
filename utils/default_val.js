'use strict';

const defaultType = function(type, value) {
	const defaultVaue = (typeof value === "function") ? value() : value;
	return {
		type,
		default: defaultVaue
	};
};

module.exports = {
	def: {
		string: defaultType(String, ""),
		number: defaultType(Number, 0),
		boolean: defaultType(Boolean, false),
		date: {
			type: Date,
			default: Date.now
		}
	},
	size: 50,
	sortType: {
		_id: -1
	},
};