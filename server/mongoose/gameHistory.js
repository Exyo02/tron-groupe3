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


//fonction pour accéder a l'historique 
async function getUserGameHistory(username) {
    try {

        // récupérer les parties où le username correspond à l'un des players & sort 
        const games = await Game.find({
            players: { $in: [username] }
        }).sort({ endTime: -1 }).limit(5);

        return games;

    } catch {
        console.error('Error retrieving game history:')

    }
    console.log("getUserGameHistory done");
}

//Fonction utilisée depuis "Server.js" dans le switch
async function handleGameHistoryRequest(connection) {
    const username = connection.login;
    try {
        // récupérer l’historique de partie d'user
        const gameHistory = await getUserGameHistory(username);
        // envoyer l'historique au client avrc valeur retourné par getUserGameHistory(username)
        connection.sendUTF(JSON.stringify({
            type: "gameHistory",
            history: gameHistory,
        }));
    } catch (err) {
        // en cas d'erreur
        connection.sendUTF(JSON.stringify({
            type: "gameHistoryError",
            message: "Erreur lors de la récupération de l'historique"
        }));
    }
}

module.exports =  handleGameHistoryRequest;


