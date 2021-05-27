//checks whether the discussion data has null or undefined or contains only white-space
const checkString = require('../utils/string-operations');

function getDiscussionValidation(topic_id) {
    if(checkString.isValid(topic_id)) {
        return true;
    }
    return false;
}

function createDiscussionValidation(discussionData) {
    if(checkString.isValid(discussionData.user_id) && checkString.isValid(discussionData.topic_name)) {
        //description value should be empty if null or undefined
        if(discussionData.description === null || discussionData.description === undefined) {
            discussionData.description = "";   
        }
        return discussionData;
    }
    return null;
}

function deleteDiscussionValidation(userData) {
    if(checkString.isValid(userData.topic_id) && checkString.isValid(userData.user_id)){
        return true;
    }
    return false;
}

module.exports = {getDiscussionValidation, createDiscussionValidation, deleteDiscussionValidation};