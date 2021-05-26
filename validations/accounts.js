//checks whether the user details has null or undefined or contains only white-space
const checkString = require('../utils/string-operations');

function signUpValidation(userDetails) {
    if(checkString.isValid(userDetails.user_name) && checkString.isValid(userDetails.email_id) && checkString.isValid(userDetails.password)) {
        return true;
    }
    return false;
}

function signInValidation(userInfo) {
    if(checkString.isValid(userInfo.email_id) && checkString.isValid(userInfo.password)) {
        return true;
    }
    return false;
}

function signOutValidation(userInfo) {
    if(checkString.isValid(userInfo.user_id)) {
        return true;
    }
    return false;
}

module.exports = {signUpValidation, signInValidation, signOutValidation};