const mongoose = require("mongoose");
const def = require("../../utils/default_val").def;

const subjectPrototype = {
    subjectId:def.string,
    userId:def.string
}
schema = new mongoose.Schema(subjectPrototype)
mongoose.model("subjectFollow", schema);
module.exports = "subjectFollow"
