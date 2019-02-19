const mongoose = require("mongoose")
const def = require("../utils/default_val").def
let appSchema = null

const createSchema = function() {
  const appPrototype = {
    name: def.string,
    orderIndex: def.number,
  }

  appSchema = new mongoose.Schema(appPrototype)
}

const createIndex = function() {
}

createSchema()
createIndex()

mongoose.model("Category", appSchema)
