const mongoose = require("mongoose");
const def = require("../../utils/default_val").def;

const subjectPrototype = {
    name:def.string,
    popularity:def.number,
    image:def.string,
    postCount:Number,
    followedCount:Number
}
schema = new mongoose.Schema(subjectPrototype)
mongoose.model("subject", schema);

module.exports = 'subject'