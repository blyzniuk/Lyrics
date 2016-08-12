'use strict';

const MongoClient = require('mongodb').MongoClient;
const mongoUrl = require('./config/').mongoUrl;
let db;

function connectDB() {
    console.log(mongoUrl);
    MongoClient.connect(mongoUrl, (err, currentDB) => {
        err ? console.error(err) : console.log('mongo connected');
        db = currentDB;
    });
}

function dissconnectDB() {
    db.close();
}

module.exports.connectDB = connectDB;
module.exports.dissconnectDB = dissconnectDB;
module.exports.db = db;
