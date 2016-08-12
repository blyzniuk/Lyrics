'use strict';

const express = require('express');
const port = require('./config/').port;

const app = express();
const server = require('http').createServer(app);

require('./mongo').connectDB();

require('./config/express')(app);

app.use('/api', require('./api/songs'));

app.use('*', (req, res) => {
    res.status(404).json({ "error": "not found" });
});

app.listen(port, (err) => {
    err ? console.error(err) : console.log('Express server listening on port ' + port);
});