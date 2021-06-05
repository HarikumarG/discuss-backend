const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'accounts',
        required: true
    },
    token: {
        type: String,
        default: null
    },
    created_time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('authenticate', authSchema, "authentication");