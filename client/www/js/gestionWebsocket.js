import { handleServerTick, loadGameInfo, endGameForMe, endGame, decount , markCase} from "./loadGame.js";
import { showError, closeLoginSection } from "./loadLogin.js";
import { loadHomeSection, displayBestPlayers } from "./loadHome.js";
import { displayGameHistory, displayVictoiresAndDefaites } from "./loadGameHistory.js";
let socket;

// connexion au serveur 
export function connectWebSocket() {
    socket = new WebSocket("ws://192.168.0.27:9898");

    socket.onopen = () => {
        console.log("Connecté au serveur WebSocket");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case "joinGame":
                loadGameInfo(data);
                break;
            case "decountGame":
                decount(data);
                break;
            case "direction":
                handleServerTick(data);
                break;
            case "markCase":
                markCase(data.x, data.y);
                break;
            case "endGameForMe":
                endGameForMe(data.message);
                break;
            case "endGame":
                endGame(data.gagnants);
                break;
            case "loginSuccess":
                closeLoginSection();
                loadHomeSection(data.username);
                break;
            case "loginError":
                const errorMessage = data.message;
                showError(errorMessage);
                break;
            case "gameHistory":
                let gameResults = data.history;
                displayGameHistory(gameResults);
                break;
            case "gameHistoryError":
                console.error("Erreur dans le serveur pour l'historique");
                break;
            case "getStats":
                displayVictoiresAndDefaites(data.victoires, data.defaites, data.egalites);
                break;
            case "getBestPlayers":
                displayBestPlayers(data.players);
                break;
        }
    };

    socket.onclose = () => {
        console.log("Déconnecté du serveur");
    };
}

// entrée dans le lobby 
export function sendEnterLoby2pToServer() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket non connectée");
        return;
    }
    //quand le serveur reçoit ce message il appelle la fonction ajouterClientAuLobby() (voir Server.js)
    const message = { type: "enterLoby2p" };
    socket.send(JSON.stringify(message));
}

export function sendEnterLoby4pToServer() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket non connectée");
        return;
    }
    //quand le serveur reçoit ce message il appelle la fonction ajouterClientAuLobby() (voir Server.js)
    const message = { type: "enterLoby4p" };
    socket.send(JSON.stringify(message));
}

//  envoyer un changement de direction 
export function sendDirection(direction, playerNumber) {
    if (!socket || socket.readyState !== WebSocket.OPEN || playerNumber === null) return;

    //quand le serveur reçoit ce message il appelle la fonction findAndUpdateGame() (voir Server.js)
    const message = {
        type: "changeDirection",
        nbPlayer: playerNumber,
        direction: direction,
    };
    socket.send(JSON.stringify(message));
}

// récupérer le numéro du joueur 


// fonction pour envoyer le login au serveur
export function sendLoginToServer(message) {
    socket.send(JSON.stringify(message));
}

export function askForBestPlayers() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket non connectée");
        return;
    }
    const message = {
        type: "getBestPlayers",
    };
    socket.send(JSON.stringify(message));
}



//fonciton pour envoyer demande de game History
export function askForGameHistory() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket non connectée");
        return;
    }
    const message = {
        type: "getGameHistory",
    };
    socket.send(JSON.stringify(message));
    console.log("Demande d'historique des matchs envoyée au serveur pour le joueur");
}

export function askForMyStats() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket non connectée");
        return;
    }
    const message = {
        type: "getStats"
    }
    socket.send(JSON.stringify(message));
}




