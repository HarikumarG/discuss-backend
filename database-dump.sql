/*
    Note: 
        1. Create a database name "discussdb"
        2. Make sure you use that database
        3. Run this dump file
*/

/* Accounts Table to store the details of the users */
CREATE TABLE accounts (user_id bigint PRIMARY KEY AUTO_INCREMENT, user_name varchar(70) NOT NULL, email_id varchar(255) NOT NULL, password varchar(60) NOT NULL, created_time timestamp default now());

/* Discussion Table to store the details of each discussion topic */
CREATE TABLE discussion_list (user_id bigint NOT NULL, topic_id bigint PRIMARY KEY AUTO_INCREMENT, topic_name varchar(128) NOT NULL, description varchar(10000), topic_created_time timestamp default now(), CONSTRAINT fk_list_user_id FOREIGN KEY(user_id) REFERENCES accounts(user_id));

/* Reply Table to store the details of each reply to a particular discussion */
CREATE TABLE discussion_reply (user_id bigint NOT NULL, topic_id bigint NOT NULL, reply_id bigint PRIMARY KEY AUTO_INCREMENT, reply_content varchar(5000) NOT NULL, reply_created_time timestamp default now(), CONSTRAINT fk_reply_user_id FOREIGN KEY(user_id) REFERENCES accounts(user_id),CONSTRAINT fk_reply_topic_id FOREIGN KEY(topic_id) REFERENCES discussion_list(topic_id));

/* Jwt Auth Table to store the token of the active user */
CREATE TABLE jwt_authentication (user_id bigint PRIMARY KEY, is_active BIT(1) default 0, token varchar(255), modified_time timestamp default now() on update now(), CONSTRAINT fk_jwt_user_id FOREIGN KEY(user_id) REFERENCES accounts(user_id));