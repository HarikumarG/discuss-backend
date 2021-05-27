//constants for all URLs
const URL_PATTERNS = {
    ACCOUNT_SIGNUP: "/signup",
    ACCOUNT_SIGNIN: "/signin",
    ACCOUNT_SIGNOUT: "/signout",
    DISCUSSIONS: "/discussions",
    CREATE_DISCUSSION: "/create-discussion",
    CREATE_REPLY: "/create-reply",
    REPLY: "/reply"
}

//constants for all Status Messages
const STATUS_MESSAGE = {
    REGISTER_SUCCESS: "REGISTRATION SUCCESSFUL",
    LOGIN_SUCCESS: "LOGIN SUCCESSFUL",
    LOGOUT_SUCCESS: "LOGOUT SUCCESSFUL",
    ACCOUNT_ALREADY_EXISTS: "ACCOUNT ALREADY EXISTS",
    INTERNAL_SERVER_ERROR: "INTERNAL SERVER ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    MISSING_PARAMETER: "MISSING AUTHENTICATION PARAMETERS IN REQUEST BODY",
    SUCCESS: "SUCCESS",
    RESOURCE_NOT_FOUND: "REQUESTED RESOURCE NOT FOUND"
}

module.exports = {URL_PATTERNS, STATUS_MESSAGE};

