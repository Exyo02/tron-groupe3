const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser');
console.log('MongoDB connected');

const gameSchema = new mongoose.Schema({
    players: { type: Array, required: true },
    winner: { type: String, required: true },
    endTime: { type: Date, required: true }
});

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

function saveGameResult(pseudos, winner) {
    try {
        const gameResult = new Game({
            players: pseudos,
            winner: winner,  //si égalité alors plusieurs joueurs premier
            endTime: new Date() // Enregistrer l'heure de fin de la partie
        });
        gameResult.save();
    } catch (err) {
        console.error('Error saving game result:', err.message);
    }

}

module.exports = saveGameResult;

