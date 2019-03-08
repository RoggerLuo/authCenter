const dao = require('./dao')
const statisticDao = require('../statistic/dao')
const historyDao = require('../history/dao')
const {controller} = require('../../utils/controller')
/* error code basic: 1 */

var http = require('http');
var querystring = require('querystring');
function postReq(content){
    var contents = querystring.stringify({content})
    var options = {
        // host:'192.168.1.2',
        host:'0.0.0.0',
        port:'6664',
        path:'/wordscut',
        method:'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':contents.length
        }
    }    
    return new Promise((resolve)=>{
        var req = http.request(options, function(res){
            res.setEncoding('utf8')
            res.on('data',function(data){
                console.log("data:",data)   //一段html代码
                resolve(data)
            })
        })
        req.write(contents)
        req.end
    })
}

module.exports = {
    keywords: controller([],function*({req}){
        const limit = req.query.limit
        const username = req.headers.username
        const condition = {username, status:0}
        const data = yield dao.find(condition)
        const kwMap = {}
        data.forEach(entry=>{
            let factor = 1
            if(entry.modifyTime > (Date.now() - 1000*60*60*24*7) ) {
                factor = 2
            }
            entry.wordList.forEach(word=>{
                if(kwMap[word]){
                    kwMap[word] += factor
                }else{
                    kwMap[word] = factor
                }
            })
        })
        const arr = Object.entries(kwMap)
        arr.sort((a,b)=>b[1]-a[1])
        const wordArr = arr.map(el=>el[0])
        const returnArr = wordArr.filter(el=>el.length>1).slice(0,limit||24)
        // returnArr.sort(function() {
        //     return .5 - Math.random()
        // })
        return returnArr
    }),
    searchKeyword: controller(['keywords'],function*({req}){
        const username = req.headers.username
        let {startIndex,pageSize} = req.query
        if(startIndex) {startIndex = parseInt(startIndex||0)} else {startIndex=0}
        if(pageSize) { pageSize = parseInt(pageSize) } else { pageSize=10}
        const kwArr = req.query.keywords.split(',')
        const condition = {username,status:0}
        const data = yield dao.find(condition,{sort:{modifyTime:-1}})
        const finalData = data.filter(entry=>{
            if(entry.wordList) {
                return entry.wordList.some(word=>kwArr.indexOf(word)!==-1)
            }
        })
        return finalData.slice(startIndex,startIndex+pageSize)
    }),
    similar: controller(['_id'],function*({req}){
        const username = req.headers.username
        const _id = req.params._id
        const condition = {username, status:0}
        const data = yield dao.find(condition)
        const note = yield dao.findOne({_id})
        const wordList = note.wordList
        const returnList = []
        data.forEach(_note=>{
            if(_note._id.toString()===note._id.toString()) return
            let count = 0
            const match_list = []
            _note.wordList.forEach(word=>{
                if(wordList.indexOf(word)!==-1) {
                    count+=1
                    match_list.push(word)
                }
            })
            if(count>0){
                _note.count = count
                _note.match_list=match_list
                returnList.push(_note)
            }
        })
        returnList.sort((a,b)=>b.count-a.count)
        return returnList
    }),
    
    search: controller(['keywords'],function*({req}){
        const username = req.headers.username
        let {startIndex,pageSize} = req.query
        if(startIndex) startIndex = parseInt(startIndex)
        if(pageSize) { pageSize = parseInt(pageSize) } else { pageSize=10}

        const kw = req.query.keywords.split(',')
        if(kw[0]) {
            const reg = RegExp(kw[0],"i")
            const condition = {username: req.headers.username,content:{$regex:reg}}
            const [count,data] = yield [dao.count(condition),dao.find(condition,{skip:startIndex,limit:pageSize})]
            yield kw.map(name => historyDao.addHistory({name,username}))
            return {total:count,data}
        }else{
            return {total:0,data:[]}
        }
    }),
    getList: controller([],function*({req}){
        let {startIndex,pageSize,star,reverse} = req.query
        if(startIndex) startIndex = parseInt(startIndex)
        if(pageSize) { pageSize = parseInt(pageSize) } else { pageSize=10}

        const condition = {username: req.headers.username,status:0}
        if(star==='true') {
            condition.starred = true
        }
        let sort = -1
        if(reverse=='true') {
            sort = 1
        }
        const [count,data] = yield [dao.count(condition),dao.find(condition,{skip:startIndex,limit:pageSize,sort:{modifyTime:sort}})]
        return {total:count,data}
    }),
    updateOne: controller(['_id','content'],function*({req,fail}){
        const username = req.headers.username
        const content = req.body.content
        const modifyTime = Date.now()
        const _id = req.params._id
        const exist = yield dao.findOne({_id})
        if(exist) {
            // 更新 wordList
            const _wordListStr = yield postReq(content)
            const _wordList = JSON.parse(_wordListStr)
            const wordList = [] 
            _wordList.forEach(el=>{
                if(wordList.indexOf(el) === -1) {
                    wordList.push(el)
                }
            })

            yield dao.updateOne({_id},{content,modifyTime,wordList})
            yield statisticDao.incrementModifyCount(username)
            return 'ok'    
        }else{
            fail(4011,'note does not exist')
        }
    }),
    create: controller(['content'],function*({req}){
        const username = req.headers.username
        const content = req.body.content
        const _wordListStr = yield postReq(content)
        const _wordList = JSON.parse(_wordListStr)
        const wordList = [] 
        _wordList.forEach(el=>{
            if(wordList.indexOf(el) === -1) {
                wordList.push(el)
            }
        })
        const createTime = Date.now()
        const entry = yield dao.create({content, username, createTime, modifyTime: createTime,starred:false,status:0,wordList})
        yield statisticDao.incrementCreateCount(username)
        return entry
    }),
    deleteOne: controller(['_id'],function*({req,fail}){
        const condition = {_id:req.params._id}
        const rs = yield dao.findOne(condition)
        if(rs === null) fail(240,'note does not exist')
        yield dao.updateOne(condition,{status:1})
        return 'ok'
    })
}