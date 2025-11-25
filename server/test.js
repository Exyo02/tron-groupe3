// const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/tronGameUser', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error(err));

// const gameSchema = new mongoose.Schema({
//   player1: { type: String, required: true },
//   player2: { type: String, required: true },
//   winner: { type: Number, required: true }, // 1ならplayer1の勝利, 2ならplayer2の勝利
//   endTime: { type: Date, required: true }
// });

// const Game = mongoose.model('Game', gameSchema);

// // プレイヤー "haruka1" の7つのゲーム履歴を作成する関数
// async function addGameHistory() {
//   const games = [
//     { player1: 'haruka1', player2: 'playerX', winner: 1, endTime: new Date('2023-10-01T12:00:00Z') },
//     { player1: 'haruka1', player2: 'playerY', winner: 2, endTime: new Date('2023-10-02T12:00:00Z') },
//     { player1: 'haruka1', player2: 'playerZ', winner: 1, endTime: new Date('2023-10-03T12:00:00Z') },
//     { player1: 'playerY', player2: 'haruka1', winner: 2, endTime: new Date('2023-10-04T12:00:00Z') },
//     { player1: 'haruka1', player2: 'playerB', winner: 1, endTime: new Date('2023-10-05T12:00:00Z') },
//     { player1: 'playerC', player2: 'haruka1', winner: 2, endTime: new Date('2023-10-06T12:00:00Z') },
//     { player1: 'haruka1', player2: 'playerD', winner: 1, endTime: new Date('2023-10-07T12:00:00Z') }
//   ];

//   for (let game of games) {
//     const newGame = new Game(game);
//     await newGame.save();
//     console.log(`Game between ${game.player1} and ${game.player2} saved!`);
//   }

//   // データベース切断
//   mongoose.disconnect();
// }

// // ゲーム履歴を追加
// addGameHistory();
