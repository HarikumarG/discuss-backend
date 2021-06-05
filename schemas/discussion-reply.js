const mongoose = require('mongoose');

const discussionReplySchema = mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'accounts',
        required: true
    },
    topic_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'discussionList',
        required: true
    },
    reply_content: {
        type: String,
        required: true
    },
    reply_created_time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('discussionReply',discussionReplySchema, "discussion_reply");