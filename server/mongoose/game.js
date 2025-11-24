const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({ 
    player1: { type: String, required: true },
    player2: { type: String, required: true },
    winner: { type: Number, required: true }, // 1ならplayer1の勝利, 2ならplayer2の勝利
    endTime: { type: Date, required: true }
});

const Game = mongoose.model('Game', gameSchema);

function saveGameResult(player1, player2, winner) {
    try {
        const gameResult = new Game({
            player1: player1,
            player2: player2,
            winner: winner,  // 1: player1 勝ち, 2: player2 勝ち
            endTime: new Date() // ゲーム終了時の時間を記録
        })
        
        gameResult.save();
        console.log('Game result saved:', gameResult);
    }catch (err) {
        console.error('Error saving game result:', err);
    }

}



//Server.js
//const { endOfTheGame } = require('./mongoose/game');
//function handleGameEnd(player1, player2, winner) {
//ゲーム終了の処理を行い、結果を MongoDB に保存
//    endOfTheGame(player1, player2, winner);
//}




//　fonction pour acceder a lhistorique 
async function getUserGameHistory(username){
    console.log("in getUserGameHistory ");
    try{

        // récupérer les parties où le username correspond à player1 ou player2 et sort
        const games = await Game.find({
            $or: [{ "player1" : username }, { "player2" : username }]
        }).sort( { "endTime" : -1 });

        console.log("in getUserGameHistory method looking for ",username);

        const historyLines = [];
        let wins = 0;
        let losses = 0;

        // compter les victoires et les défaites
        games.forEach(game => {
            if ((game.winner === 1 && game.player1 === username) || (game.winner === 2 && game.player2 === username)) {
                wins += 1;
            } else {
                losses += 1;
            }
            // enregistrer la date, le contenu de jeu dans le tableau
            historyLines.push(`${game.endTime.toISOString()}, winner: "${game.winner === 1 ? game.player1 : game.player2}"`);
        });

        console.log("historyLines after processing games:", historyLines);
        console.log("Wins:", wins, "Losses:", losses);

        // enregistrer le total des victoires/défaites dans le tableau
        historyLines.push(`${wins} wins ${losses} losses`);
        return historyLines;

    }catch{
        console.error('Error retrieving game history:')

    }
    console.log("getUserGameHistory done");
}


module.exports = getUserGameHistory;


