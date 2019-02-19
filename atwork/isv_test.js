"use strict";
const isvClient = require("isv-client");
const param = {
	suiteKey: "mYTZatO-EQPo1WVZ3bBVQg",
	suiteSecret: "wMShM6l002CwhT36mHQGJXzONlpZvKrC",
	orgId: "031c00a5-8b60-485a-909f-4066eb372b19",//"85939199-6424-4f28-84d4-fce2aedf0e64",
	domainId: "atwork",
	appId: "9Oma6r-hUSS5Tpt5CmJ1Vr",
	userId: "bdcae2f0c8924f5f88e6cfad925bbb72"//"a86e83a26be44eb59806901cc8be5d5c"
};
const isv = isvClient(param);
let atworkInstance, config;
const initAtworkInstance = function(result) {
	console.log("获取到的token和地址是", result);
	config = Object.assign({
		token: result.api_access_token,
		adminServer: result.access_endpoint,
		getAccessToken: isv.getContacts.bind(isv)
	}, param);
	atworkInstance = require("./index")(config);
};
let uploadImg = function() {
	const image = {
		path: "imgs/pig.jpg",
		originalname: "hehe.jpg"
	};
	return atworkInstance.uploadImage(image);
};

const disableToken = function() {
	console.log("准备刷掉原有的token");
	return isv.getContacts();
};

const isUserOfThisApp = function() {
	return atworkInstance.isUserOfThisApp("image");
};
const isAdminOfThisApp = function() {
	return atworkInstance.isAdminOfThisApp("image");
};

const notifyWithImageText = function() {
	const args = {
		users: [param.userId],
		title: "图文推送测试",
		description: "description",
		coverMediaID: "Z3JvdXAxL00wMC8wMy9DQi9yQkFDLUZpdjZnMkFVYUREQUFBTTBDYmxqWVk3ODEuanBn",
		url: "http://www.baidu.com/"
	};
	return atworkInstance.notifyWithImageText(args);
};

const notifyWithText = function() {
	const args = {
		users: [param.userId],
		content: "文本推送测试",
		"@targetUrl": "http://www.baidu.com/"
	};
	return atworkInstance.notifyWithText(args);
};
const translate = function() {
	const file = {
		path: "imgs/rbtree.pdf",
		originalname: "rbtree.pdf"
	};
	const translate = function() {
		return atworkInstance.translate("pdf", "jpg", mediaId);
	};
	let mediaId;
	return atworkInstance.uploadFile(file)
		.then(result => mediaId = result.result)
		.then(translate);
};

const searchForEmployee = function() {
	return atworkInstance.searchForEmployee("13681111111");
};
const getOrgInfo = function() {
	return atworkInstance.getOrgInfo(param.orgId);
};
const getOrgSettingInfo = function() {
	return atworkInstance.getOrgSettingInfo(param.orgId);
};
const getOrgInfoBySend = function() {
	const options = {
		url: `${config.adminServer}/admin/organizations/${param.orgId}/view`,
		json: true
	};
	return atworkInstance.send(options);
};

isv.getContacts()
	.then(initAtworkInstance)
	.then(notifyWithText)
	.then(notifyWithImageText)	
	.then(uploadImg)
	.then(disableToken)
	.then(uploadImg)
	.then(isUserOfThisApp)
	.then(isAdminOfThisApp)
	.then(translate)
	.then(searchForEmployee)
	.then(getOrgInfo)
	.then(getOrgSettingInfo)
	.then(getOrgInfoBySend)
	.then(() => {
		let result = require("./index").isTokenExist("isv", param.domainId, param.orgId, param.suiteKey);
		console.log("判断token是否存在结果", result);
		if (!result) {
			throw new Error("token不存在?!");
		}
	})
	.catch(e => {
		console.error(e, e.stack);
	});



/*const validateTicket = function(){
	return atworkInstance.validateUserTicket("11a35a32a32149168520467119133e96","13533545408");
};

isv.getContacts()
	.then(initAtworkInstance)
	.then(disableToken)
	.then(validateTicket)
	.catch(e => {
		console.error(e, e.stack);
	});	*/