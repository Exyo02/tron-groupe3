const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser');
console.log('MongoDB connected');

const gameSchema = new mongoose.Schema({
    players: { type: Array, required: true },
    //winner peut être soit une string soit un tableau si plusieurs joueurs ( en cas d'égalité ) d'où le mixed
    winner: { type: mongoose.Schema.Types.Mixed, required: true },
    endTime: { type: Date, required: true },
});

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

async function saveGameResult(pseudos, winner) {
    let gagnant;
    if (winner.length == 1)
        gagnant = winner[0].connection.login;
    else
        gagnant = winner.map(w => w.connection.login);

    try {
        const gameResult = new Game({
            players: pseudos,
            winner: gagnant,  //si égalité alors plusieurs joueurs premier
            endTime: new Date(), // Enregistrer l'heure de fin de la partie
        });
        gameResult.save();
    } catch (err) {
        console.error('Error saving game result:', err.message);
    }

}

module.exports = saveGameResult;

