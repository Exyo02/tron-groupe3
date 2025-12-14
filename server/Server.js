// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();

//Fonctions pour interragir avec le modèle User
const { verifierLogin, retirerLogin, handleGetStatsRequest, handleGetBestPlayersRequest } = require('./mongoose/user.js')

//Fonction pour récupérer l'historique des parties
const handleGameHistoryRequest = require('./mongoose/gameHistory.js')

//Fonction pour modifier une partie en cours
const { findAndUpdateGame } = require('./Game/game.js');

//Fonctions pour interragir avec les files d'attentes
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
            case "logOut":
                retirerLogin(connection);
                connection.login="";
                break;
            case "leaveLoby":
                supprimerClientLoby(connection);
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
                console.log("message inconnu" + messageObject.type);
        }
    });
    connection.on('close', function (reasonCode, description) {
        //Bien penser à supprimer le client d'une file d'attente lorsqu'il se déconnecte et de retirer son pseudos des utilisateurs connectés :
        supprimerClientLoby(connection);
        retirerLogin(connection);
    });
});








