"use strict";

const mongoose = require("mongoose");
const def = require("../utils/default_val").def;
let bugSchema = null;

const createSchema = function() {

  const bugPrototype = {
    content: def.string,
    createDate: def.date,
    dirId: def.string,
    owner: def.string,
    ownerId: def.string
  }

  bugSchema = new mongoose.Schema(bugPrototype);
};

const createIndex = function() {
};

createSchema();
createIndex();

mongoose.model("comment", bugSchema);
