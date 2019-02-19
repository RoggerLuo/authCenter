const config = () => {
    if(process.env.NODE_ENV === 'development'){
        return {
            port: 8093,
            ctx:{
                domainId: 'workplus',
                orgId: "e63bf7a5-ce40-4c03-bd08-3204d33034ac", //'e63bf7a5-ce40-4c03-bd08-3204d33034ac'
            }, 
            workplus: {
                apiServer: { //apiServer的对内和对外访问地址
                    internal: "https://api4.workplus.io/v1",
                    public: "https://api4.workplus.io/v1"
                },
                clientId: "907ed931b41398b0f07c1d551a14160ea6be3889",//"9844ad9c7536b343bf48249de4bd4ad308c297bc",
                clientSecret: "07379bd84d0f4785849069bf68ac0cd8"
                // "48d8d92803364212b84976e0f7c6c08a",
            },
            mongo: {
              uri: 'mongodb://localhost/userAutoCenter',
              opts: {
                user: '',
                pass: '',
                server: {
                  reconnectTries: Number.MAX_VALUE,
                  reconnectInterval: 3000
                }
              }
            },
            log4js: {
              appenders: [{
                type: 'console'
              }, {
                type: 'dateFile',
                filename: 'logs/bbs.log',
                pattern: '-yyyy-MM-dd',
                alwaysIncludePattern: false
              }],
              replaceConsole: true
            }
        }
    }
}
module.exports = config();
