const mysql_connection = require('../dao/mysql-connection');

//function to get all discussions list
function getAllDiscussionsData() {
    return new Promise(resolve => {
        let url = "SELECT accounts.user_name,discussion_list.topic_id,discussion_list.topic_name,discussion_list.topic_created_time FROM discussion_list LEFT JOIN accounts ON discussion_list.user_id = accounts.user_id ORDER BY discussion_list.topic_created_time DESC";
        mysql_connection.query(url,(error, rows) => {
            if(!error) {
                resolve(rows);
            } else {
                resolve(error);
            }
        });
    });
}

//function to get particular discussion topic data
function getDiscussionData(topic_id) {
    return new Promise(resolve => {
        let url = "SELECT accounts.user_name,discussion_list.topic_id,discussion_list.topic_name,discussion_list.description,discussion_list.topic_created_time FROM discussion_list LEFT JOIN accounts ON discussion_list.user_id = accounts.user_id WHERE discussion_list.topic_id="+topic_id+"";
        mysql_connection.query(url,(error, rows) => {
            if(!error) {
                resolve(rows);
            } else {
                resolve(error);
            }
        });
    });
}

module.exports = {getAllDiscussionsData, getDiscussionData};