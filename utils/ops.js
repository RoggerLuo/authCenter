
function init(){
    const find = (condition, projection, option) => {
        console.log("查询条件是", condition);
        return this.find(condition, projection, option).select(projection || {})
    }
    const insertOne = (obj) => {
        console.log("创建对象", obj)
        return this.create(obj)
    }
    const findOneAndRemove = (condition, option) => {
        console.log("删除条件是", condition)
        return this.findOneAndRemove(condition, option)
    }
    const findOneAndUpdate = function(condition, update, option) {
        console.log("需要更新的对象是", condition, update);
        return this.findOneAndUpdate(condition, update, option);
    };
    return {find,insertOne,findOneAndRemove,findOneAndUpdate} 
}

module.exports = init
