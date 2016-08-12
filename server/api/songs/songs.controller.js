'use strict';

class SongsController {
    getSong(db, req, res) {
        console.log('get song');
        return res.status(200).json({ "key": "value" });
    }

    getSongs(db, req, res) {
        console.log('get songs');
        return res.status(200).json({ "key": "value" });
    }
}

module.exports = SongsController;