'use strict';

const Schema = require('mongoose').Schema;

const ArtistSchema = new Schema({
    artist: {
        type: String,
        required: true
    },
    songs: [{
        original: {
            text: {
                type: String
            },
            title: {
                type: String
            }
        },
        ru: {
            text: {
                type: String
            },
            title: {
                type: String
            }
        },
    }]
});

module.exports = ArtistSchema;