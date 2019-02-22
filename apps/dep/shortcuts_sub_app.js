const DetailDao = require('../daos/detail_dao');
const co = require('co');

const groupByOperation = (data) => {
    let hist = {}
    data.forEach(el=>{
        let id = el.fileId
        if( id in hist){
            hist[id]++
        }else{
            hist[id] = 1
        }
    })
    return hist
}
const objToArr = (hist)=> {
    let histArr = []
    for(let k in hist){
        let obj = {}
        obj.fileId = k
        obj.value = hist[k]
        histArr.push(obj)
    }
    return histArr            
}
const sortAndCutArr = (histArr) => {
    histArr.sort((a,b)=> -(a.value - b.value))
    return histArr.slice(0,10)
}
const fillDetailInfo = co.wrap(function*(histArr){
    return yield histArr.map(el=>{ //yield
        let params = {_id:el.fileId}
        el.fileArr = DetailDao.getList(params)
        return el
    })
})
const weightModifier = (histArr) => {
    return histArr.map(el=>{
        if( Date.parse(new Date(el.fileArr[0].createDate)) > (Date.parse(new Date()) - 24*60*60*1000*3)){
            el.value = el.value*2
        }
        return el
    })
}
const handleMsOffice = (token) => {
    return function(histArr){
        return histArr.filter(el=>el.fileArr.length != 0).map(el=>{
            let file = el.fileArr[0]
            const suffix = /[^\.]+$/.exec(file.fileName)
            if(suffix == 'docx'||suffix == 'xlsx'||suffix=='pptx'||suffix=='pdf'){
                file.link = 'https://api4.workplus.io/v1/medias/'+file.mediaId+'?access_token='+token
            }
            el.file = file
            return el
        })
    }
}
module.exports = {
    groupByOperation,
    objToArr,
    sortAndCutArr,
    fillDetailInfo,
    handleMsOffice,
    weightModifier
}