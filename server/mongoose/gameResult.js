const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser');
console.log('MongoDB connected');

const gameSchema = new mongoose.Schema({ 
    player1: { type: String, required: true },
    player2: { type: String, required: true },
    winner: { type: Number, required: true },
    endTime: { type: Date, required: true }
});

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

function saveGameResult(player1, player2, winner) {
    try {
        console.log('in saveGameResult method Player1:', player1);    
        console.log('in saveGameResult method Player2:', player2);
        const gameResult = new Game({
            player1: player1,
            player2: player2,
            winner: winner,  // 0 : égalité, 1 : victoire du joueur 1, 2 : victoire du joueur 2
            endTime: new Date() // Enregistrer l'heure de fin de la partie
        });
        console.log('gameResult:', gameResult);
        gameResult.save();
    }catch (err) {
        console.error('Error saving game result:', err.message);
        console.error(err); 
    }

}

module.exports = saveGameResult;

