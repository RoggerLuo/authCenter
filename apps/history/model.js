const mongoose = require("mongoose");
const def = require("../../utils/default_val").def;

const subjectPrototype = {
    name: {type:String,required:true},
    username:{type:String,required:true},
    createTime:Number
}
schema = new mongoose.Schema(subjectPrototype)
mongoose.model("history", schema);

module.exports = 'history'