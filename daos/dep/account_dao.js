'use strict';

const mongoose = require('mongoose');
const Account = mongoose.model('Account');
const Db_Tool = require('../utils/db_tool');
const insertOne = Db_Tool.insertOne.bind(Account);
const findOne = Db_Tool.findOne.bind(Account);
const findOneAndUpdate = Db_Tool.findOneAndUpdate.bind(Account);

const register = account => {
    const rawAccount = Object.assign({}, account, this);
    return insertOne(rawAccount);
};

const login = function(account) {
    return findOne({ mobile: account.mobile }).then(thisAccount => {
        if (!thisAccount) {
            throw new Error('e_not_found');
        }
        if (thisAccount.password != account.password) {
            throw new Error('e_password');
        }        
        return thisAccount.save();
    });
};

module.exports = {
    register,
    login,
};
