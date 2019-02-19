"use strict";

/*
参数解释
isIsv:
	true表示以isv模式运行，否则以私有化部署的方式运行,
	appAccessUrl：本机对外的访问地址，什么nginx，二级域名之类玩蛋去，反正确定外面可以访问就是了

isvConfig：
	当isIsv为true的时候需要配置，否则不需要配置这一块

privateConfig
	当isIsv不为true的时候需要配置，否则不需要配置这一块	
	apiServer:管理后台地址，一般来说apiServer的internal和public是一样的，但在及其操蛋的情况下，内网机器访问apiServer不能使用外网ip，此时才需要区分internal和public
	appAccessUrl：本机对外的访问地址，什么nginx，二级域名之类玩蛋去，反正确定外面可以访问就是了
*/

const isvConfig = {
	port: 8312,
	suiteKey: "O5Ed92P6kWbqwZbKnGLw83",
	suiteSecret: "T3hdwA6BOZ4Q189PahJPupfa7OQGAgqV",
	appAccessUrl: "http://172.16.1.150:5001",
	isvServer: "http://172.16.1.150:8411",
	appId: "67uwHsxfEMN6Tz6-mMuRFW"
};

const privateConfig = {
	apiServer: { //apiServer的对内和对外访问地址
		internal: "http://120.236.169.14:7081/v1",
		public: "http://120.236.169.14:7081/v1"
	},
	clientId: "P4ezEc4FkB4IUIiK0Eg_3h",
	clientSecret: "0HDMeZfmf7uJvn6oPqIohFjwnazfR480",
	port: 8000,
	appAccessUrl: "http://172.16.1.178:8000"
};
const config = {
	isIsv: false, //千万别忘记配置这个，非常重要，见参数解释
	isvConfig,
	privateConfig
};


privateConfig.adminServer = privateConfig.apiServer.internal;
module.exports = config.isIsv === true ?
	config.isvConfig :
	config.privateConfig;



/*const config = {
	apiServer: { //apiServer的对内和对外访问地址
		internal: "http://120.236.169.14:7081/v1",
		public: "http://120.236.169.14:7081/v1"
	},
	//以下选项在isv接入之后将会全部去掉
	clientId: "12E9bbfNkKN6BISucZpO8I",
	clientSecret: "TQJEVI52tH5LaVOdrFmSv4OGZpcDX3Nb"
};*/