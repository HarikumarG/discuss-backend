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
        let result = {};
        let url = "SELECT accounts.user_name,discussion_list.topic_id,discussion_list.topic_name,discussion_list.description,discussion_list.topic_created_time FROM discussion_list LEFT JOIN accounts ON discussion_list.user_id = accounts.user_id WHERE discussion_list.topic_id="+topic_id+"";
        mysql_connection.query(url,(error, topicRows) => {
            if(!error) {
                result.topic_data = topicRows;
                if(topicRows.length === 1) {
                    let subUrl = "SELECT accounts.user_name,discussion_reply.reply_id,discussion_reply.reply_content,discussion_reply.reply_created_time FROM discussion_reply LEFT JOIN accounts ON discussion_reply.user_id = accounts.user_id WHERE discussion_reply.topic_id="+topic_id+" ORDER BY reply_created_time ASC";
                    mysql_connection.query(subUrl, (error,replyRows) => {
                        if(!error) {
                            result.reply_data = replyRows;
                            resolve(result);
                        } else {
                            resolve(error);
                        }
                    });
                } else {
                    resolve(result);
                }
            } else {
                resolve(error);
            }
        });
    });
}

//function to create discussion
function createDiscussion(newdiscussionData) {
    return new Promise(resolve => {
        let url = "INSERT INTO discussion_list(user_id,topic_name,description)VALUES("+newdiscussionData.user_id+",'"+newdiscussionData.topic_name+"','"+newdiscussionData.description+"')";
        mysql_connection.query(url,(error,rows) => {
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
    });
}

//function to delete a particular topic
function deleteDiscussion(userData) {
    return new Promise(resolve => {
        let url = "SELECT user_id FROM discussion_list WHERE topic_id="+userData.topic_id+" AND user_id="+userData.user_id+"";
        mysql_connection.query(url, (error, rows) => {
            if(!error) {
                if(rows.length === 1) {
                    let subUrl = "DELETE FROM discussion_reply WHERE topic_id="+userData.topic_id+";DELETE FROM discussion_list WHERE topic_id="+userData.topic_id+"";
                    mysql_connection.query(subUrl,[],(error, rows) => {
                        if(!error) {
                            if(rows[1].affectedRows === 1) {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        } else {
                            resolve(error);
                        }
                    });
                } else {
                    resolve(false);
                }
            } else {
                resolve(error);
            }
        });
    })
}

//function to create a discussion reply
function createDiscussionReply(replyData) {
    return new Promise(resolve => {
        let url = "INSERT INTO discussion_reply(user_id,topic_id,reply_content)VALUES("+replyData.user_id+","+replyData.topic_id+",'"+replyData.reply_content+"')";
        mysql_connection.query(url,(error,rows) => {
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
    });
}

//function to delete a reply from a discussion
function deleteDiscussionReply(replyData) {
    return new Promise(resolve => {
        let url = "SELECT topic_id FROM discussion_reply WHERE reply_id="+replyData.reply_id+" AND user_id="+replyData.user_id+";SELECT topic_id FROM discussion_list WHERE topic_id="+replyData.topic_id+" AND user_id="+replyData.user_id+"";
        mysql_connection.query(url,[],(error,rows) => {
            if(!error) {
                if(rows[0].length === 1 || rows[1].length === 1) {
                    let subUrl = "DELETE FROM discussion_reply WHERE reply_id="+replyData.reply_id+"";
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
                } else {
                    resolve(false);
                }
            } else {
                resolve(error);
            }
        });
    });
}

module.exports = {getAllDiscussionsData, getDiscussionData, createDiscussion, deleteDiscussion, createDiscussionReply, deleteDiscussionReply};