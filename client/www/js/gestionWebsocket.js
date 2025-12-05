import { handleServerTick, loadGameInfo, endGame, decount } from "./loadGame.js";
import { showError, closeLoginSection } from "./loadLogin.js";
import { loadHomeSection, displayBestPlayers } from "./loadHome.js";
import { displayGameHistory, displayVictoiresAndDefaites } from "./loadGameHistory.js";
const startButton = document.getElementById("start");
let socket;
let onMessageCallback = null;
let invalidLoginMessage = null;

// connexion au serveur 
export function connectWebSocket() {
    socket = new WebSocket("ws://localhost:9898");

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
            case "endGame":
                endGame(data.egalite, data.perdant, data.gagnant);
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
            case "gameHistoryError":
                console.error("Erreur dans le serveur pour l'historique");
            case "getStats":
                displayVictoiresAndDefaites(data.victoires, data.defaites);
            case "getBestPlayers":
                displayBestPlayers(data.players);
        }
    };

    socket.onclose = () => {
        console.log("Déconnecté du serveur");
    };
}

export function onMessage(callback) {
    onMessageCallback = callback;
}

// entrée dans le lobby 
export function sendEnterLobbyToServer() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket non connectée");
        return;
    }
    //quand le serveur reçoit ce message il appelle la fonction ajouterClientAuLobby() (voir Server.js)
    const message = { type: "enterLoby" };
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




