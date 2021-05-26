require('dotenv').config();
const express = require('express');
const accountsRouter = require('./routes/accounts');
const discussionsRouter = require('./routes/discussions');

const app = express();

app.use(express.json());

//all "accounts" and its related routes will be routed to "accountsRouter"
app.use('/accounts',accountsRouter);

//all "discussions" and its related routes will be routed to "discussionsRouter"
app.use('/discussions-list',discussionsRouter);

app.listen(3000);