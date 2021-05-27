const mysql_connection = require('../dao/mysql-connection');

//function to create account for a user
function registerUser(userDetails) {
    return new Promise(resolve => {
        let url = "INSERT INTO accounts(user_name,email_id,password)VALUES('"+userDetails.user_name+"','"+userDetails.email_id+"','"+userDetails.password+"');SELECT user_id FROM accounts WHERE email_id='"+userDetails.email_id+"' AND password='"+userDetails.password+"'";
        mysql_connection.query(url,[],(error, rows) => {
            if(!error) {
                if(rows[0].affectedRows === 1) {
                    if(rows[1].length === 1) {
                        let subUrl = "INSERT INTO jwt_authentication(user_id)VALUES("+rows[1][0].user_id+")";
                        mysql_connection.query(subUrl,(error,rows) => {
                            if(!error) {
                                if(rows.affectedRows === 1) {
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            } else {
                                resolve(error);
                            }
                        });
                    }
                } else {
                    resolve(false);
                }
            } else {
                resolve(error);
            }
        });
    });
}

//function to verify, if the particular user account exists or not
function verifyUser(userInfo) {
    return new Promise(resolve => {
        let url = "SELECT user_id,user_name,email_id FROM accounts WHERE BINARY email_id='"+userInfo.email_id+"' AND BINARY password='"+userInfo.password+"'";
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

//function to check whether account already exists or not
function verifyAccount(userDetails) {
    return new Promise(resolve => {
        let url = "SELECT user_id FROM accounts WHERE email_id='"+userDetails.email_id+"'";
        mysql_connection.query(url,(error, rows) => {
            if(!error) {
                if(rows.length === 1) {
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

module.exports = {registerUser, verifyUser, verifyAccount};