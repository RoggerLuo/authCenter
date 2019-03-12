const config = () => {
    return {

        port: 8999,

        mongo: {
            uri: 'mongodb://192.168.1.2:6666/flow4',
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
module.exports = config();
