'use strict';

const Artist = require('./artist.model');
const mongoose = require('mongoose');

class SongsController {
    getSong({ body: { artist, title } }, res) {
        const collectionName = getCollectionName(artist);
        const collection = mongoose.model('Artist', Artist, collectionName)

        return collection.findOne({ artist })
            .then((artistObj) => {
                const {original, ru} = artistObj.songs.find(({ original }) => original.title === title);
                res.status("200").json({ artist, original, ru, title });
            })
            .catch((err) => {
                res.status("404").json(err);
            });
    }

    getSongs(req, res) {
        console.log('get songs');
        return res.status(200).json({ "key": "value" });
    }
}

function getCollectionName(artistName) {
    return artistName[0].toLowerCase();
}

module.exports = SongsController;