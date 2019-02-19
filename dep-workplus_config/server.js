module.exports = privateConfig()
function privateConfig(){
	if(process.env.NODE_ENV === 'development'){
		return {
			apiServer: { //apiServer的对内和对外访问地址
				internal: "https://api4.workplus.io/v1",
				public: "https://api4.workplus.io/v1"
			},
			clientId: "9844ad9c7536b343bf48249de4bd4ad308c297bc",
			clientSecret: "48d8d92803364212b84976e0f7c6c08a",
			// port: 8090,
			// appAccessUrl: "http://172.16.1.178:8090"
		}
	}else{
		return {
			apiServer: { //apiServer的对内和对外访问地址
				internal: "https://api4.workplus.io/v1",
				public: "https://api4.workplus.io/v1"
			},
			clientId: "9844ad9c7536b343bf48249de4bd4ad308c297bc",
			clientSecret: "48d8d92803364212b84976e0f7c6c08a",
		}		
	}
}
/* const config = {
	isIsv: false, //千万别忘记配置这个，非常重要，见参数解释
	// isvConfig,
	privateConfig
};
 */

// privateConfig.adminServer = privateConfig.apiServer.internal;
	// config.isvConfig :
	


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

/* 
const isvConfig = {
	port: 8312,
	suiteKey: "O5Ed92P6kWbqwZbKnGLw83",
	suiteSecret: "T3hdwA6BOZ4Q189PahJPupfa7OQGAgqV",
	appAccessUrl: "http://172.16.1.150:5001",
	isvServer: "http://172.16.1.150:8411",
	appId: "67uwHsxfEMN6Tz6-mMuRFW"
};
 */
