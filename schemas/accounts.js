const mongoose = require('mongoose');

const accountsSchema = mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('accounts',accountsSchema, "accounts");