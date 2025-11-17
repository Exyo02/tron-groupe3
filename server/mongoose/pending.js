// For displaying history later


//Server.js

if (messageObject.type === "getGameHistory") {
    const username = messageObject.username;
    try {
         // ユーザーのゲーム履歴を取得
            const gameHistory = await getUserGameHistory(username);
            connection.sendUTF(JSON.stringify({
                    type: "gameHistory",
                    history: gameHistory
            }));
        } catch (err) {
            connection.sendUTF(JSON.stringify({
                type: "gameHistoryError",
                message: "Error retrieving game history."
            }));
        }
}






//when client demand getGameHistory

let message = {
    type: "getGameHistory",  // 要求の種類を示す
    username: user.username  // ユーザー名をプロパティとして設定
};
connection.sendUTF(JSON.stringify(message)); 






//when client receive "gameHistory"

if (messageObject.type === 'gameHistory') {
        const gameHistory = messageObject.history;  // 履歴データを取り出す
        displayGameHistory(gameHistory);
    }

    // gameHistoryError の場合
if (messageObject.type === 'gameHistoryError') {
        const errorMessage = messageObject.message;  
        console.error('Error:', errorMessage); 
        alert('Error: ' + errorMessage);     // ユーザーにエラーポップアップを表示
    };



//*displayGameHistoryは別に定義する（例えば、画面に表示するなど）