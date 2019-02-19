const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    user_id: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
});

const AccountModel = mongoose.model('Account', AccountSchema);
module.exports = AccountModel;
