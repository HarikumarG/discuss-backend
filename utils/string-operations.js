//check whether the string is null or undefined or contains only white-space
function isValid(str) {
    if(!str || /^\s*$/.test(str)) {
        return false;
    }
    if(str === "null" || str === "undefined") {
        return false;
    }
    return true;
}

module.exports = {isValid};