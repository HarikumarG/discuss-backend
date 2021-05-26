//checks whether the user details has null or undefined or contains only white-space
function signUpValidation(userDetails) {
    if(!userDetails.user_name || /^\s*$/.test(userDetails.user_name)) {
        return false;
    }
    if(!userDetails.email_id || /^\s*$/.test(userDetails.email_id)) {
        return false;
    }
    if(!userDetails.password || /^\s*$/.test(userDetails.password)) {
        return false
    }
    return true;
}

function signInValidation(userInfo) {
    if(!userInfo.email_id || /^\s*$/.test(userInfo.email_id)) {
        return false;
    }
    if(!userInfo.password || /^\s*$/.test(userInfo.password)) {
        return false
    }
    return true;
}

function signOutValidation(userInfo) {
    if(!userInfo.user_id || /^\s*$/.test(userInfo.user_id)) {
        return false
    }
    return true;
}

module.exports = {signUpValidation, signInValidation, signOutValidation};