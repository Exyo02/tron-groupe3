// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
const { verifierLogin, retirerLogin, handleGetStatsRequest, handleGetBestPlayersRequest}  = require('./mongoose/user.js')
const getUserGameHistory= require('./mongoose/gameHistory.js')

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
        
        console.log("RAW MESSAGE:", message);

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

    console.log("Parsed:", messageObject);

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
                console.log("case getGameHistory passe");
                handleGameHistoryRequest(connection);
                break;
            case "getStats":
                handleGetStatsRequest(connection);
            case "getBestPlayers":
                handleGetBestPlayersRequest(connection);
            default:
                console.log("message inconnu");
        }
        console.log('Received Message:', message.utf8Data);
    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
        supprimerClientLoby(connection);
        retirerLogin(connection);
    });
});




async function handleGameHistoryRequest(connection) {
    console.log("handleGameHistoryRequest called");
    const username = connection.login;
    try {
        // récupérer l’historique de partie d'user
        const gameHistory = await getUserGameHistory(username); 
        console.log("getUserGameHistory called");
        // envoyer l'historique au client avrc valeur retourné (un tableau historyLines) par getUserGameHistory(username)
        connection.sendUTF(JSON.stringify({
            type: "gameHistory", 
            history: gameHistory,
        }));
        console.log("package type gameHistory sent");
    } catch (err) {
        // en cas d'erreur
        connection.sendUTF(JSON.stringify({
            type: "gameHistoryError",
            message: "Erreur lors de la récupération de l'historique"
        }));
    }
}



