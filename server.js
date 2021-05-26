require('dotenv').config();
const express = require('express');
const accountsRouter = require('./routes/accounts');

const app = express();

app.use(express.json());

//all "accounts" and its related routes will be routed to "accountsRouter"
app.use('/accounts',accountsRouter);

app.listen(3000);