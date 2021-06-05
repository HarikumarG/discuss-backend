const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport')(passport);
const accounts_validation = require('../validations/accounts');
const API_CONSTANTS = require('../constants/api');

const authSchema = require('../schemas/authenticate');
const accountsSchema = require('../schemas/accounts');

const router = express.Router();

//route for account registration
router.post(API_CONSTANTS.URL_PATTERNS.ACCOUNT_SIGNUP, async(request,response) => {
    let userDetails = {
        user_name: request.body.user_name,
        email_id: request.body.email_id,
        password: request.body.password
    }
    let validationStatus = accounts_validation.signUpValidation(userDetails);
    if(validationStatus === false) {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    } else {
        try {
            let isAccountExists = null;
            let findDocument = await accountsSchema.findOne({email_id: userDetails.email_id});
            if(findDocument === null) {
                isAccountExists = false;
            }
            if(isAccountExists === false) {
                let document = await new accountsSchema(userDetails).save();
                await new authSchema({
                    user_id: document._id
                }).save();
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.REGISTER_SUCCESS
                }
                response.status(201).send(JSON.stringify(statusMessage));
            } else {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.ACCOUNT_ALREADY_EXISTS
                }
                response.status(409).send(JSON.stringify(statusMessage));
            }
        } catch(error) {
            let statusMessage = {
                STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
            }
            response.status(500).send(JSON.stringify(statusMessage));
        }
    }
});

//route for account login
router.post(API_CONSTANTS.URL_PATTERNS.ACCOUNT_SIGNIN, async(request, response) => {
    let userInfo = {
        email_id: request.body.email_id,
        password: request.body.password
    }
    let validationStatus = accounts_validation.signInValidation(userInfo);
    if(validationStatus === false) {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    } else {
        try {
            let userData = null;
            userData = await accountsSchema.findOne(userInfo).select({
                'password': false,
                'created_time': false
            });
            if(userData !== null) {
                //jwt token will expire in one day
                const token = jwt.sign({user_id: userData._id},process.env.JWT_AUTH_SECRET_KEY, {expiresIn: '1d'});
                await authSchema.findOneAndUpdate({user_id: userData._id},{token: token});
                let verifiedUser = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.LOGIN_SUCCESS,
                    DATA: userData,
                    JWT_TOKEN: token
                }
                response.status(200).send(JSON.stringify(verifiedUser));
            }
            else if(userData === null){
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
    }
});

//route for account logout
router.post(API_CONSTANTS.URL_PATTERNS.ACCOUNT_SIGNOUT, passport.authenticate('jwt',{session: false}), async(request, response) => {
    let userInfo = {
        user_id: request.body.user_id
    }
    let validationStatus = accounts_validation.signOutValidation(userInfo);
    if(validationStatus === false) {
        let validationMessage = {
            STATUS: API_CONSTANTS.STATUS_MESSAGE.MISSING_PARAMETER
        }
        response.status(401).send(JSON.stringify(validationMessage));
    } else {
        try {
            let status = await authSchema.findOneAndUpdate({user_id: userInfo.user_id},{token: null});
            if(status !== null) {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.LOGOUT_SUCCESS
                }
                response.status(200).send(JSON.stringify(statusMessage));
            } else {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.UNAUTHORIZED
                }
                response.status(401).send(JSON.stringify(statusMessage));
            }
        } catch(error) {
            let statusMessage = {
                STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
            }
            response.status(500).send(JSON.stringify(statusMessage));
        }
    }
});

module.exports = router;