'use strict';

const express = require('express');
const db = require('../../mongo').db;
const SongsController = require('./songs.controller');
const songsController = new SongsController();
const router = express.Router();

router.route('/song')
    .post(songsController.getSong.bind(songsController, db));
router.route('/songs')
    .post(songsController.getSongs.bind(songsController, db));

module.exports = router;