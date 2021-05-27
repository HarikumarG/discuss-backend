const mysql_connection = require('../dao/mysql-connection')

//function to verify jwt auth token with user_id which is currently active
function verifyJwtAuth(user_id,token) {
    return new Promise(resolve => {
        let url = "SELECT user_id FROM jwt_authentication WHERE user_id="+user_id+" AND token='"+token+"' AND is_active=1";
        mysql_connection.query(url,(error, rows) => {
            if(!error) {
                if(rows.length === 1) {
                    resolve(rows[0]);
                } else {
                    resolve(null);
                }
            } else {
                resolve(error);
            }
        });
    });
}

//function to update jwt auth token when user logged in
function updateJwtAuth(packet) {
    return new Promise(resolve => {
        let url = "UPDATE jwt_authentication SET is_active=1,token='"+packet.JWT_TOKEN+"' WHERE user_id="+packet.DATA.user_id+"";
        mysql_connection.query(url,(error, rows) => {
            if(!error) {
                if(rows.changedRows === 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(error);
            }
        });
    });
}

//function to update jwt auth token when user logged out
function updateJwtAuthToDefault(userInfo) {
    return new Promise(resolve => {
        let url = "UPDATE jwt_authentication SET is_active=0,token=NULL WHERE user_id="+userInfo.user_id+" AND is_active=1";
        mysql_connection.query(url,(error, rows) => {
            if(!error) {
                if(rows.changedRows === 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(error);
            }
        });
    });
}

module.exports = {verifyJwtAuth, updateJwtAuth, updateJwtAuthToDefault};