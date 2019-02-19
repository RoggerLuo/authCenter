'use strict';

const parserUA = require("ua-parser-js");
const uuid = require('node-uuid');

// 获取链接上的数据
const getUrlParams = (fromUrl) => {
	fromUrl = fromUrl ? fromUrl : window.location.href;
	var hash = fromUrl.split('?');
	var url = hash[1];
	if (hash.length > 2) {
	  url = hash[1] + '&' + hash[2];
	}
	if (!url) return {};
	let query = {},
	  strs;
	if (url.indexOf("&") > -1) {
	  strs = url.split("&");
	  for (var i = 0; i < strs.length; i++) {
      query[strs[i].split("=")[0]] = strs[i].split("=")[1];
	  }
	} else {
	  var key = url.substring(0, url.indexOf("="));
	  var value = url.substr(url.indexOf("=") + 1);
	  query[key] = decodeURI(value);
	}
	return query;
};

const getUserAgent = (rawAgent) => {
	let agentObj;
	try {
		agentObj = parserUA(rawAgent);
	} catch (e) {
		console.error(e);
		return {};
	}
	return agentObj;
};

const getCreatDateCondition = function(rawStartDate, rawEndDate){
	const startDate = !rawStartDate ? new Date(1418832000000) : new Date(rawStartDate); //2014/12/18日
	const endDate = !rawEndDate ? new Date() : new Date(rawEndDate);
	console.log(startDate, endDate)
	if (startDate.toString === 'Invalid Date' || endDate.toString === 'Invalid Date') {
		console.error(rawStartDate, rawEndDate);
		throw new Error('e_params');
	}
	if (startDate > endDate) {
		console.error(rawStartDate, rawEndDate);
		throw new Error('e_params');
	}
	return {
		$lte: endDate,
		$gte: startDate
	};
};

const createUniqueId = () => {
	return uuid.v4();
};

module.exports = {
	getUrlParams,
	getUserAgent,
	getCreatDateCondition,
	createUniqueId,
};