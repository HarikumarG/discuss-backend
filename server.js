require('dotenv').config();
const express = require('express');
const cors = require('cors');
const accountsRouter = require('./routes/accounts');
const discussionsRouter = require('./routes/discussions');
const mongoConnect = require('./dao/mongodb-connection');
const favicon = require("serve-favicon");

const app = express();

app.use(favicon(__dirname + '/assets/server.png'));

app.use(cors())

app.use(express.json());

//all "accounts" and its related routes will be routed to "accountsRouter"
app.use('/accounts',accountsRouter);

//all "discussions" and its related routes will be routed to "discussionsRouter"
app.use('/discussions-list',discussionsRouter);

app.get("/", function (request, response) {
    let data = "<h1>Server Started and running successfully</h1>";
    response.send(data);
});

mongoConnect.connection();
app.listen(process.env.PORT || 5000);