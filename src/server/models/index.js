const highscoresModels = require('./highscores');
const playersModels = require('./players');
const roomsModels = require('./rooms');
const spectrumsModels = require('./spectrums');

async function createCollectionsIndexes() {
    await Promise.all([
        highscoresModels.createIndexes(),
        playersModels.createIndexes(),
        roomsModels.createIndexes(),
        spectrumsModels.createIndexes(),
    ]);
}

module.exports = {
    createCollectionsIndexes,
    highscoresModels,
    playersModels,
    roomsModels,
    spectrumsModels,
};
