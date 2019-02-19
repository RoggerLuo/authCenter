const mongoose = require('mongoose');
const def = require('../utils/default_val').def;
let accountSchema = null;

const createSchema = function() {

  const accountPrototype = {
    username: def.string,
    password: def.string,
    mobile: def.string,
  };

  accountSchema = new mongoose.Schema(accountPrototype);
};

const createIndex = function() {
  const usernameIndex = {
    username: 1,
    mobile: 1
  };
  accountSchema.index(usernameIndex, {
    unique: true
  });
};

createSchema();
createIndex();

mongoose.model('Account', accountSchema);
