'use strict';

const Artist = require('./artist.model');
const mongoose = require('mongoose');
const q = require('q');
const util = require('util')

class SongsController {
    getSong({ body: { artist, title } }, res) {
        return getArtist(artist)
            .then((artistObj) => {
                const { original, ru } = artistObj.songs.find(
                    ({ original }) => original.title.toLowerCase() === title.toLowerCase()
                );
                res.status("200").json({ artist, original, ru, title });
            })
            .catch((err) => {
                res.status("404").json(err);
            });
    }

    getSongs({ body: { artists } }, res) {
        const artistsSongsPromises = artists.map(({ artist, songs }) => getArtistRequestPromise(artist.toLowerCase(), songs));

        return q.all(artistsSongsPromises)
            .then((result) => res.status(200).json(result))
            .catch((err) => {
                res.status("404").json(err);
            });
    }
}

function getArtistRequestPromise(artist, songs) {
    return getArtist(artist)
        .then((artistObj) => ({
            artist,
            songs: getArtistSongs(artistObj, songs)
        }));
}

function getArtistSongs({ songs }, neededSongs) {
    return songs.reduce(
        (result, song) => {
            if (isSongRequested(neededSongs, song)) {
                result.push(song);
            }
            return result;
        }, []
    );
}

function isSongRequested(neededSongs, song) {
    return neededSongs.some((title) => song.original.title.toLowerCase() === title.toLowerCase())
}

function getArtist(artist) {
    return mongoose.model('Artist', Artist, getCollectionName(artist)).findOne({ artist });
}

function getCollectionName(artistName) {
    return artistName[0].toLowerCase();
}

module.exports = SongsController;