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


//　fonction pour acceder a lhistorique 
async function getUserGameHistory(username){
    console.log("in getUserGameHistory ");
    try{

        // récupérer les parties où le username correspond à player1 ou player2 et sort
        const games = await Game.find({
            $or: [{ "player1" : username }, { "player2" : username }]
        }).sort( { "endTime" : -1 });

        // console.log("in getUserGameHistory method looking for ",username);

        // const historyLines = [];
        // let wins = 0;
        // let losses = 0;

        // // compter les victoires et les défaites
        // games.forEach(game => {
        //     if ((game.winner === 1 && game.player1 === username) || (game.winner === 2 && game.player2 === username)) {
        //         wins += 1;
        //     } else {
        //         losses += 1;
        //     }
        //     const gameDate = new Date(game.endTime); 
        //     const formattedDate = gameDate.toISOString().split('T')[0]; //onvertir un objet Date en format "YYYY-MM-DD"
        //     // enregistrer la date, le contenu de jeu dans le tableau
        //     historyLines.push(`${formattedDate}   winner: "${game.winner === 1 ? game.player1 : game.player2}"`);
        // });

        // console.log("historyLines after processing games:", historyLines);
        // console.log("Wins:", wins, "Losses:", losses);

        // // enregistrer le total des victoires/défaites dans le tableau
        // historyLines.push(`${wins} wins ${losses} losses`);
        return games;

    }catch{
        console.error('Error retrieving game history:')

    }
    console.log("getUserGameHistory done");
}


module.exports = getUserGameHistory;


