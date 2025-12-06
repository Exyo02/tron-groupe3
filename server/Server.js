// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
const { verifierLogin, retirerLogin, handleGetStatsRequest, handleGetBestPlayersRequest } = require('./mongoose/user.js')
const getUserGameHistory = require('./mongoose/gameHistory.js')

//du module Game/game.js
const { findAndUpdateGame } = require('./Game/game.js');

//du module 
const { ajouterClientAuLoby4p, supprimerClientLoby, ajouterClientAuLoby2p } = require('./Game/loby.js');
server.listen(9898);
const wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function (message) {

        if (message.type !== "utf8") {
            console.log("Unsupported message type:", message.type);
            return;
        }

        let messageObject;
        try {
            messageObject = JSON.parse(message.utf8Data);
        } catch (err) {
            console.log("JSON parse error:", err);
            return;
        }

        switch (messageObject.type) {
            case "login":
                verifierLogin(connection, messageObject);
                break;
            case "enterLoby2p":
                ajouterClientAuLoby2p(connection);
                break;
            case "enterLoby4p":
                ajouterClientAuLoby4p(connection);
                break;
            case "changeDirection":
                findAndUpdateGame(connection, messageObject.nbPlayer, messageObject.direction);
                break;
            case "getGameHistory":
                handleGameHistoryRequest(connection);
                break;
            case "getStats":
                handleGetStatsRequest(connection);
                break;
            case "getBestPlayers":
                handleGetBestPlayersRequest(connection);
                break;
            default:
                console.log("message inconnu"+ messageObject.type);
        }
    });
    connection.on('close', function (reasonCode, description) {
        supprimerClientLoby(connection);
        retirerLogin(connection);
    });
});




async function handleGameHistoryRequest(connection) {
    const username = connection.login;
    try {
        // récupérer l’historique de partie d'user
        const gameHistory = await getUserGameHistory(username);
        // envoyer l'historique au client avrc valeur retourné (un tableau historyLines) par getUserGameHistory(username)
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



