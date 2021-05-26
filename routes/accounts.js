const express = require('express');
const accountsModel = require('../models/accounts');
const jwtModel = require('../models/auth-jwt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport')(passport);
const accounts_validation = require('../validations/accounts');
const API_CONSTANTS = require('../constants/api');

const router = express.Router();

//route for account registration
router.post(API_CONSTANTS.URL_PATTERNS.ACCOUNT_SIGNUP, async(request,response, next) => {
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
            let isAccountAlreadyExists  = await accountsModel.verifyAccount(userDetails);
            if(isAccountAlreadyExists === true) {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.ACCOUNT_ALREADY_EXISTS
                }
                response.status(409).send(JSON.stringify(statusMessage));
            } else {
                let status = await accountsModel.registerUser(userDetails);
                if(status === true) {
                    let statusMessage = {
                        STATUS: API_CONSTANTS.STATUS_MESSAGE.REGISTER_SUCCESS
                    }
                    response.status(201).send(JSON.stringify(statusMessage));
                } else {
                    let statusMessage = {
                        STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
                    }
                    response.status(500).send(JSON.stringify(statusMessage));
                }
            }
        } catch(error) {
            next(error);
        }
    }
});

//route for account login
router.post(API_CONSTANTS.URL_PATTERNS.ACCOUNT_SIGNIN, async(request, response, next) => {
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
            let userData = await accountsModel.verifyUser(userInfo);
            if(userData !== null && userData.user_id !== undefined) {
                //jwt token will expire in one day
                const token = jwt.sign({user_id: userData.user_id},process.env.JWT_AUTH_SECRET_KEY, {expiresIn: '1d'});
                let verifiedUser = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.LOGIN_SUCCESS,
                    DATA: userData,
                    JWT_TOKEN: token
                }
                let updateAuth = await jwtModel.updateJwtAuth(verifiedUser);
                if(updateAuth === true) {
                    response.status(200).send(JSON.stringify(verifiedUser));
                } else {
                    let serverError = {
                        STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
                    }
                    response.status(500).send(JSON.stringify(serverError));
                }
            }
            else if(userData === null){
                let unverifierUser = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.UNAUTHORIZED
                }
                response.status(401).send(JSON.stringify(unverifierUser));
            } else {
                let serverError = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
                }
                response.status(500).send(JSON.stringify(serverError));
            } 
        } catch(error) {
            next(error);
        }
    }
});

//route for account logout
router.post(API_CONSTANTS.URL_PATTERNS.ACCOUNT_SIGNOUT, passport.authenticate('jwt',{session: false}), async(request, response, next) => {
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
            let status = await jwtModel.updateJwtAuthToDefault(userInfo);
            if(status === true) {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.LOGOUT_SUCCESS
                }
                response.status(200).send(JSON.stringify(statusMessage));
            } else if(status === false){
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.UNAUTHORIZED
                }
                response.status(401).send(JSON.stringify(statusMessage));
            } else {
                let statusMessage = {
                    STATUS: API_CONSTANTS.STATUS_MESSAGE.INTERNAL_SERVER_ERROR
                }
                response.status(500).send(JSON.stringify(statusMessage));
            }
        } catch(error) {
            next(error);
        }
    }
});

module.exports = router;