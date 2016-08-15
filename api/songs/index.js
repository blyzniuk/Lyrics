'use strict';

const express = require('express');
const SongsController = require('./songs.controller');
const songsController = new SongsController();
const router = express.Router();

router.route('/song')
    .post(songsController.getSong.bind(songsController));
router.route('/songs')
    .post(songsController.getSongs.bind(songsController));

module.exports = router;