"use strict";
const test = require("ava").test;
const request = require("request");
const config = {
	clientId: "12E9bbfNkKN6BISucZpO8I",
	clientSecret: "TQJEVI52tH5LaVOdrFmSv4OGZpcDX3Nb",
	domainId: "atwork",
	adminServer: "http://120.236.169.14:7081/v1",
	orgId: "031c00a5-8b60-485a-909f-4066eb372b19", //注意orgid必须是要和client id secret关联起来
	userId: "6ea0018a94904c05ba49d3aaedce3013",
	sourceType: "NATIVE"
};
const config2 = {
	clientId: "12E9bbfNkKN6BISucZpO8I",
	clientSecret: "TQJEVI52tH5LaVOdrFmSv4OGZpcDX3Nb",
	domainId: "atwork",
	adminServer: "http://120.236.169.14:7081/v1",
	orgId: "031c00a5-8b60-485a-909f-4066eb372b19",
	userId: "6ea0018a94904c05ba49d3aaedce3013",
	sourceType: "NATIVE"
};
const fail = function(e, t) {
	console.error(e, e.stack);
	t.fail();
};

const disableTheToken = function() {
	const options = {
		method: "POST",
		url: `${config.adminServer}/token`,
		json: true,
		body: {
			grant_type: "client_credentials",
			scope: "app",
			domain_id: config.domainId,
			client_id: config.clientId,
			client_secret: config.clientSecret,
			org_id: config.orgId
		}
	};
	const send = function(options) {
		return new Promise((success, fail) => {
			console.log("准备刷掉原有的token， 参数是\n", options);
			request(options, (e, res, body) => {
				console.log("刷掉token响应是", body);
				if (e) {
					console.error("网络错误");
					fail(e);
				} else if (body.status !== 0) {
					console.error("刷掉token返回非0，刷掉失败");
					const e = new Error("token_error");
					fail(e);
				} else {
					success(body);
				}
			});
		});
	};
	return send(options);
};
const testGetToken = function(desc, tokenModule) {
	test(desc, t => {
		return tokenModule.getAccessToken().then(() => t.pass()).catch(e => fail(e, t));
	});
};
const tokenModule = require("./lib/token")(config);
testGetToken("正常获取token1", tokenModule);
testGetToken("正常获取token2", tokenModule);
testGetToken("正常获取token3", tokenModule);
const tokenModule2 = require("./lib/token")(config2);
testGetToken("正常获取token4", tokenModule2);
testGetToken("正常获取token5", tokenModule2);
testGetToken("正常获取token6", tokenModule2);

test("token not found", t => {
	const tokenModule = require("./lib/token")(config);
	const uploadImage = function() {
		const store = require("./lib/store")(config);
		const image = {
			path: "imgs/pig.jpg",
			originalname: "hehe.jpg"
		};
		return store.uploadImage(image).then(() => t.pass()).catch(e => fail(e, t));
	};
	return tokenModule.getAccessToken()
		.then(disableTheToken)
		.then(uploadImage);
});

const store = require("./lib/store")(config);
test.serial("图片上传", t => {
	const image = {
		path: "imgs/pig.jpg",
		originalname: "hehe.jpg"
	};
	return disableTheToken()
		.then(() => store.uploadImage(image))
		.then(() => t.pass()).catch(e => fail(e, t));
});



test.serial("文件上传", t => {
	const file = {
		path: "imgs/test.txt",
		originalname: "hehe.txt"
	};
	return store.uploadFile(file).then(() => t.pass()).catch(e => fail(e, t));
});

test.serial("媒体转换", t => {
	const file = {
		path: "imgs/rbtree.pdf",
		originalname: "rbtree.pdf"
	};
	const translate = function() {
		return store.translate("pdf", "jpg", mediaId);
	};
	let mediaId;
	return store.uploadFile(file)
		.then(result => mediaId = result.result)
		.then(translate)
		.then(() => t.pass()).catch(e => fail(e, t));
});


const notify = require("./lib/notify")(config);
test.serial("文本推送", t => {
	const param = {
		users: [config.userId],
		content: "文本推送测试",
		"@targetUrl": "http://www.baidu.com/"
	};
	return notify.notifyWithText(param).then(() => t.pass()).catch(e => fail(e, t));
});
test.serial("单图文推送", t => {
	const param = {
		users: [config.userId],
		title: "图文推送测试",
		description: "description",
		cover_media_id: "Z3JvdXAxL00wMC8wMC8xQy9yQkFDLUZkOGYzaUFkWTd1QUFDYlZ4YkVIVHc0OTYuanBn",
		url: "http://www.baidu.com/"
	};
	return notify.notifyWithImageText(param).then(() => t.pass()).catch(e => fail(e, t));
});
const employee = require("./lib/employee")(config);
test.serial("查询雇员信息", t => {
	return disableTheToken()
		.then(() => employee.searchForEmployee("13681111111"))
		.then(() => t.pass()).catch(e => fail(e, t));
});
const org = require("./lib/org")(config);
test.serial("查询机构信息", t => {
	return disableTheToken()
		.then(() => org.getOrgInfo(config.orgId))
		.then(() => t.pass()).catch(e => fail(e, t));
});
test.serial("查询机构设置", t => {
	return disableTheToken()
		.then(() => org.getOrgSettingInfo(config.orgId))
		.then(() => t.pass()).catch(e => fail(e, t));
});

const app = require("./lib/app")(config);
const keyWord = "明明就";
test.serial("查询用户是否在app的使用范围", t => {
	return disableTheToken()
		.then(() => app.isUserOfThisApp(keyWord))
		.then(() => t.pass()).catch(e => fail(e, t));
});
test.serial("查询用户是否为app的admin", t => {
	return disableTheToken()
		.then(() => app.isAdminOfThisApp(keyWord))
		.then(() => t.pass()).catch(e => fail(e, t));
});

const getOrgInfoBySend = function() {
	const options = {
		url: `${config.adminServer}/admin/organizations/${config.orgId}/view`,
		json: true
	};
	return require("./index")(config).send(options);
};
test.serial("测试send", t => {
	return disableTheToken()
		.then(getOrgInfoBySend)
		.then(() => t.pass()).catch(e => fail(e, t));
});

/*const ticket = require("./lib/ticket")(config);
test("校验ticket", t => {
	return ticket.validateUserTicket("d5af5c63bd714907b10220ece52e863d", "6ea0018a94904c05ba49d3aaedce3013");
});*/



/*test.only("图片上传", t => {
	const image = {
		path: "C:\\Users\\Chris\\Desktop\\tmp\\33.jpg",
		originalname: "hehe.jpg"
	};
	return store.uploadImage(image).then(() => t.pass()).catch(e => fail(e, t));
});
test.only("图片上传", t => {
	const image = {
		path: "C:\\Users\\Chris\\Desktop\\tmp\\49.jpg",
		originalname: "hehe.jpg"
	};
	return store.uploadImage(image).then(() => t.pass()).catch(e => fail(e, t));
});
test.only("图片上传", t => {
	const image = {
		path: "C:\\Users\\Chris\\Desktop\\tmp\\51.jpg",
		originalname: "hehe.jpg"
	};
	return store.uploadImage(image).then(() => t.pass()).catch(e => fail(e, t));
});
test.only("图片上传", t => {
	const image = {
		path: "C:\\Users\\Chris\\Desktop\\tmp\\57.jpg",
		originalname: "hehe.jpg"
	};
	return store.uploadImage(image).then(() => t.pass()).catch(e => fail(e, t));
});
test.only("图片上传", t => {
	const image = {
		path: "C:\\Users\\Chris\\Desktop\\tmp\\88.jpg",
		originalname: "hehe.jpg"
	};
	return store.uploadImage(image).then(() => t.pass()).catch(e => fail(e, t));
});
test.only("图片上传", t => {
	const image = {
		path: "C:\\Users\\Chris\\Desktop\\tmp\\90.jpg",
		originalname: "hehe.jpg"
	};
	return store.uploadImage(image).then(() => t.pass()).catch(e => fail(e, t));
});*/