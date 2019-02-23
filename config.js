const config = () => {
    if(process.env.NODE_ENV === 'development'){
        return {
            port: 8999,
            mongo: {
              uri: 'mongodb://localhost/flow4',
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
