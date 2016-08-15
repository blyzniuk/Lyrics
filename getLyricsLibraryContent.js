const alphabet = "123456789abcdefghijklmnopqrstuvwxyz".split("");

function getLyricsLibraryContent(db) {
    const content = {};
    alphabet.forEach((currentCollection) => {
        db.collection(currentCollection, putCollectionArtists.bind(null, content));
    });
    console.log(content);
    return content;
}

function putCollectionArtists(content, err, collection) {
    content[currentCollection] = collection.find().toArray.map(filterArtistInfo);
}

function filterArtistInfo(artistObj) {
    const artist = Object.keys(artistObj).find((key) => key !== "_id");
    return {
        artist,
        songs: getSongsTitles(artistObj[artist])
    };
}

function getSongsTitles(songs) {
    return songs.map((song) => song.original.name);
}

module.exports = getLyricsLibraryContent;