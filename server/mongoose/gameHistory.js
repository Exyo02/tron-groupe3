const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser');
console.log('MongoDB connected');

const gameSchema = new mongoose.Schema({
    players: { type: Array, required: true },
    //winner peut être soit une string soit un tableau si plusieurs joueurs d'où le mixed
    winner: { type: mongoose.Schema.Types.Mixed, required: true },
    endTime: { type: Date, required: true },
});


const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);


//　fonction pour acceder a lhistorique 
async function getUserGameHistory(username) {
    console.log("in getUserGameHistory ");
    try {

        // récupérer les parties où le username correspond à player1 ou player2 et sort
        const games = await Game.find({
            players: { $in: [username] }
        }).sort({ endTime: -1 });

        return games;

    } catch {
        console.error('Error retrieving game history:')

    }
    console.log("getUserGameHistory done");
}


module.exports = getUserGameHistory;


