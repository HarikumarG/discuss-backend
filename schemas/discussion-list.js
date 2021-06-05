const mongoose = require('mongoose');

const discussionListSchema = mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'accounts',
        required: true
    },
    topic_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    topic_created_time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('discussionList',discussionListSchema, "discussion_list");