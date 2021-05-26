const express = require('express');
const discussionModel = require('../models/discussions');
const checkString = require('../utils/string-operations');
const API_CONSTANTS = require('../constants/api');

const router = express.Router();

//route for getting all discussions list
router.get(API_CONSTANTS.URL_PATTERNS.ALLDISCUSSIONS, async(request, response) => {
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
});

//route for getting data for particular discussion page
router.get(API_CONSTANTS.URL_PATTERNS.DISCUSSIONS+'/:topic_id', async(request, response) => {
    let topic_id = request.params.topic_id;
    if(checkString.isValid(topic_id)) {
        let discussionData = await discussionModel.getDiscussionData(topic_id);
        if(discussionData.length >= 0) {
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
    } else {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    }
});

module.exports = router;