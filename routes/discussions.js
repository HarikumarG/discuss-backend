const express = require('express');
const discussionModel = require('../models/discussions');
const checkString = require('../utils/string-operations');
const API_CONSTANTS = require('../constants/api');
const passport = require('passport');
require('../config/passport')(passport);
const discussions_validation = require('../validations/discussions');

const router = express.Router();

//route for getting all discussions list
router.get(API_CONSTANTS.URL_PATTERNS.DISCUSSIONS, async(request, response, next) => {
    try {
        let discussionsData = await discussionModel.getAllDiscussionsData();
        if(discussionsData.length >= 0) {
            let discussionsResponse = {
                STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS,
                DATA: discussionsData
            }
            response.status(200).send(JSON.stringify(discussionsResponse));
        } 
        else {
            let serverError = {
                STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
            }
            response.status(500).send(JSON.stringify(serverError));
        }
    } catch(error) {
        next(error);
    }
});

//route for getting data for particular discussion page
router.get(API_CONSTANTS.URL_PATTERNS.DISCUSSIONS+'/:topic_id', async(request, response, next) => {
    let topic_id = request.params.topic_id;
    if(discussions_validation.getDiscussionValidation(topic_id)) {
        try {
            let discussionData = await discussionModel.getDiscussionData(topic_id);
            if(discussionData.topic_data !== undefined) {
                let discussionResponse = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS,
                    DATA: discussionData
                }
                response.status(200).send(JSON.stringify(discussionResponse));
            } else {
                let serverError = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
                }
                response.status(500).send(JSON.stringify(serverError));
            }
        } catch(error) {
            next(error);
        }
    } else {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    }
});

//route for creating a discussion
router.post(API_CONSTANTS.URL_PATTERNS.CREATE_DISCUSSION, passport.authenticate('jwt',{session: false}), async(request, response, next) => {
    let newdiscussionData = {
        user_id: request.body.user_id,
        topic_name: request.body.topic_name,
        description: request.body.description
    }
    newdiscussionData = discussions_validation.createDiscussionValidation(newdiscussionData);
    if(newdiscussionData !== null) {
        try {
            let status = await discussionModel.createDiscussion(newdiscussionData);
            if(status === true) {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS
                }
                response.status(200).send(JSON.stringify(statusMessage));
            } else {
                let serverError = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
                }
                response.status(500).send(JSON.stringify(serverError));
            }
        } catch(error) {
            next(error);
        }
    } else {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    }
});

//route for deleting a particular discussion
router.delete(API_CONSTANTS.URL_PATTERNS.DISCUSSIONS+'/:topic_id', passport.authenticate('jwt',{session: false}), async(request, response, next) => {
    let userData = {
        topic_id : request.params.topic_id,
        user_id: request.body.user_id
    }
    if(discussions_validation.deleteDiscussionValidation(userData)) {
        try {
            let status = await discussionModel.deleteDiscussion(userData);
            if(status === true) {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS
                }
                response.status(200).send(JSON.stringify(statusMessage));
            } else if(status === false){
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.UNAUTHORIZED
                }
                response.status(401).send(JSON.stringify(statusMessage));
            } else {
                let serverError = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
                }
                response.status(500).send(JSON.stringify(serverError));
            }
        } catch(error) {
            next(error);
        }
    } else {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    }
});

//route for creating a reply for a particular discussion
router.post(API_CONSTANTS.URL_PATTERNS.DISCUSSIONS+'/:topic_id'+API_CONSTANTS.URL_PATTERNS.CREATE_REPLY, passport.authenticate('jwt',{session: false}), async(request, response, next) => {
    let replyData = {
        user_id: request.body.user_id,
        topic_id: request.params.topic_id,
        reply_content: request.body.reply_content
    }
    if(discussions_validation.createReplyValidation(replyData)) {
        try {
            let status = await discussionModel.createDiscussionReply(replyData);
            if(status === true) {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS
                }
                response.status(200).send(JSON.stringify(statusMessage));
            } else {
                let serverError = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
                }
                response.status(500).send(JSON.stringify(serverError));
            }
        } catch(error) {
            next(error);
        }
    } else {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    }
});

//route for deleting a reply from particular discussion
router.delete(API_CONSTANTS.URL_PATTERNS.DISCUSSIONS+'/:topic_id'+API_CONSTANTS.URL_PATTERNS.REPLY+'/:reply_id', passport.authenticate('jwt',{session: false}), async(request, response, next) => {
    let replyData = {
        user_id: request.body.user_id,
        topic_id: request.params.topic_id,
        reply_id: request.params.reply_id
    }
    if(discussions_validation.deleteReplyValidation(replyData)) {
        try {
            let status = await discussionModel.deleteDiscussionReply(replyData);
            if(status === true) {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS
                }
                response.status(200).send(JSON.stringify(statusMessage));
            } else if(status === false){
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.UNAUTHORIZED
                }
                response.status(401).send(JSON.stringify(statusMessage));
            } else {
                let serverError = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
                }
                response.status(500).send(JSON.stringify(serverError));
            }
        } catch(error) {
            next(error);
        }
    } else {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    }
});

module.exports = router;