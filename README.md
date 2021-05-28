# discuss-backend

This is an simple discussion forum application with nodejs as backend and emberjs as frontend

https://github.com/HarikumarG/discuss-frontend (Frontend)

# Prerequisites

1. Install node (v12.14.0 - preferable)
2. Install mysql (5.5.29)

# Steps to Installation and Run

1. `git clone https://github.com/HarikumarG/discuss-backend && cd discuss-backend`
2.  Run the command `npm install`
3.  Login to mysql and create a database named discussdb `create database discussdb`
4.  Run the dump file which is given in the project folder `source <path to file>/database-dump.sql`
5.  Before running the application kindly do check "discuss-backend/dao/mysql-connection.js" and set "host,user,password,database as 'discussdb'"
6.  Run the command `npm run devStart`

Note: Kindly do check the frontend repo link given above for UI

# Reference
Do check https://github.com/HarikumarG/discuss-backend/blob/master/api-structure-design.txt
