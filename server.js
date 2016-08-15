'use strict';

const express = require('express');
const config = require('./config/');

const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

mongoose.connect(config.mongoUrl, (err) => {
    err ? console.error(err) : console.log('mongo connected');
});

const app = express();
const server = require('http').createServer(app);

// const getLyricsLibraryContent = require('./getLyricsLibraryContent');

require('./config/express')(app);

app.use('/api', require('./api/songs'));

app.use('*', (req, res) => {
    res.status(404).json({ "error": "not found" });
});

app.listen(config.port, (err) => {
    err ? console.error(err) : console.log('Express server listening on port ' + config.port);
});