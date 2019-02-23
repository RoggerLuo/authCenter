const mongoose = require("mongoose")
const prototype = {
    date: {type:Number,required:true},
    username: {type:String,required:true},
    createCount: Number,
    modifyCount: Number
}
schema = new mongoose.Schema(prototype)
mongoose.model("statistic", schema)
module.exports = "statistic"