const express = require('express');
const API_CONSTANTS = require('../constants/api');
const passport = require('passport');
require('../config/passport')(passport);
const discussions_validation = require('../validations/discussions');

const accountsSchema = require('../schemas/accounts');
const discussionListSchema = require('../schemas/discussion-list');
const discussionReplySchema = require('../schemas/discussion-reply');

const router = express.Router();

//route for getting all discussions list
router.get(API_CONSTANTS.URL_PATTERNS.DISCUSSIONS, async(request, response) => {
    try {
        let discussionsData = await discussionListSchema.find({}).select({
            'description': false
        }).sort({
            'topic_created_time': -1
        }).populate({
            path: 'user_id', select: ['user_name']
        });
        let discussionsResponse = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS,
            DATA: discussionsData
        }
        response.status(200).send(JSON.stringify(discussionsResponse));
    } catch(error) {
        let serverError = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
        }
        response.status(500).send(JSON.stringify(serverError));
    }
});

//route for getting data for particular discussion page
router.get(API_CONSTANTS.URL_PATTERNS.DISCUSSIONS+'/:topic_id', async(request, response) => {
    let topic_id = request.params.topic_id;
    if(discussions_validation.getDiscussionValidation(topic_id)) {
        try {
            let discussionData = {};
            discussionData.topic_data = await discussionListSchema.findById(topic_id).populate({
                path: 'user_id', select: ['user_name']
            });
            discussionData.reply_data = await discussionReplySchema.find({topic_id: topic_id}).sort({
                'reply_created_time': -1
            }).populate({
                path: 'user_id', select: ['user_name']
            }); 
            let discussionResponse = {
                STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS,
                DATA: discussionData
            }
            response.status(200).send(JSON.stringify(discussionResponse));
        } catch(error) {
            let serverError = {
                STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
            }
            response.status(500).send(JSON.stringify(serverError));
        }
    } else {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    }
});

//route for creating a discussion
router.post(API_CONSTANTS.URL_PATTERNS.CREATE_DISCUSSION, passport.authenticate('jwt',{session: false}), async(request, response) => {
    let newdiscussionData = {
        user_id: request.body.user_id,
        topic_name: request.body.topic_name,
        description: request.body.description
    }
    newdiscussionData = discussions_validation.createDiscussionValidation(newdiscussionData);
    if(newdiscussionData !== null) {
        try {
            let verifyUser = await accountsSchema.findById(newdiscussionData.user_id);
            if(verifyUser !== null) {
                await new discussionListSchema(newdiscussionData).save();
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS
                }
                response.status(201).send(JSON.stringify(statusMessage));
            } else {
                let unverifierUser = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.UNAUTHORIZED
                }
                response.status(401).send(JSON.stringify(unverifierUser));
            }
        } catch(error) {
            let serverError = {
                STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
            }
            response.status(500).send(JSON.stringify(serverError));
        }
    } else {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    }
});

//route for creating a reply for a particular discussion
router.post(API_CONSTANTS.URL_PATTERNS.DISCUSSIONS+'/:topic_id'+API_CONSTANTS.URL_PATTERNS.CREATE_REPLY, passport.authenticate('jwt',{session: false}), async(request, response) => {
    let replyData = {
        user_id: request.body.user_id,
        topic_id: request.params.topic_id,
        reply_content: request.body.reply_content
    }
    if(discussions_validation.createReplyValidation(replyData)) {
        try {
            let verifyUser = await accountsSchema.findById(replyData.user_id);
            if(verifyUser !== null) {
                let verifyTopicId = await discussionListSchema.findById(replyData.topic_id);
                if(verifyTopicId !== null) {
                    await new discussionReplySchema(replyData).save();
                    let statusMessage = {
                        STATUS: API_CONSTANTS.STATUS_MESSAGE.SUCCESS
                    }
                    response.status(201).send(JSON.stringify(statusMessage));
                } else {
                    let statusMessage = {
                        STATUS: API_CONSTANTS.STATUS_MESSAGE.BAD_REQUEST
                    }
                    response.status(400).send(JSON.stringify(statusMessage));
                }
            } else {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.UNAUTHORIZED
                }
                response.status(401).send(JSON.stringify(statusMessage));
            }
        } catch(error) {
            let serverError = {
                STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
            }
            response.status(500).send(JSON.stringify(serverError));
        }
    } else {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    }
});

module.exports = router;