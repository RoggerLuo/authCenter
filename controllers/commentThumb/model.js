const mongoose = require("mongoose")
const def = require("../../utils/default_val").def
const prototype = {
    userId:def.string,
    commentId:def.string,
}
schema = new mongoose.Schema(prototype)
mongoose.model("commentThumb", schema)

