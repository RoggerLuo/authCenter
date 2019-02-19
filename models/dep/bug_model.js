"use strict";

const mongoose = require("mongoose");
const def = require("../utils/default_val").def;
let bugSchema = null;

const createSchema = function() {

  const userAgent = {
    browser: {},
    cpu: {},
    device: {},
    engine: {},
    os: {},
    ua: {},
  };

  const visitPage = {
    url: def.string,
    name: def.string,
    time: def.string,
  };

  const bugPrototype = {
    url: def.string,
    type: def.string,
    name: def.string,
    description: def.string,
    line: def.string,
    column: def.string,
    createDate: def.date,
    userAgent,
    visitPage,
    stack: [],
    appId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "App"
    },
  };

  bugSchema = new mongoose.Schema(bugPrototype);
};

const createIndex = function() {
};

createSchema();
createIndex();

mongoose.model("Bug", bugSchema);
