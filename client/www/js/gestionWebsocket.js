import { handleServerTick, loadGameInfo, endGameForMe, endGame, decount, markCase } from "./loadGame.js";
import { showError, closeLoginSection } from "./loadLogin.js";
import { loadHomeSection, displayBestPlayers } from "./loadHome.js";
import { displayGameHistory, displayVictoiresAndDefaites } from "./loadGameHistory.js";
let socket;

// connexion au serveur 
export function connectWebSocket() {
    socket = new WebSocket("ws://10.42.0.1:9898");

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

// entrée dans le lobby à deux joueurs
export function sendEnterLoby2pToServer() {

    //quand le serveur reçoit ce message il appelle la fonction ajouterClientAuLobby() (voir Server.js)
    const message = { type: "enterLoby2p" };
    socket.send(JSON.stringify(message));
}

// entrée dans le lobby à quatre joueurs
export function sendEnterLoby4pToServer() {
    
    //quand le serveur reçoit ce message il appelle la fonction ajouterClientAuLobby() (voir Server.js)
    const message = { type: "enterLoby4p" };
    socket.send(JSON.stringify(message));
}

//message de déconnexion
export function sendLogOutToServer(){
    const message = { type: "logOut" };
    socket.send(JSON.stringify(message));
}

//  envoyer un changement de direction 
export function sendDirection(direction, playerNumber) {
    //quand le serveur reçoit ce message il appelle la fonction findAndUpdateGame() (voir Server.js)
    const message = {
        type: "changeDirection",
        nbPlayer: playerNumber,
        direction: direction,
    };
    socket.send(JSON.stringify(message));
}


//fonction pour envoyer le login au serveur
export function sendLoginToServer(message) {
    socket.send(JSON.stringify(message));
}


//fonction pour avoir la liste des meilleurs joueurs
export function askForBestPlayers() {
    const message = {
        type: "getBestPlayers",
    };
    socket.send(JSON.stringify(message));
}



//fonction pour envoyer demande de game History
export function askForGameHistory() {
    const message = {
        type: "getGameHistory",
    };
    socket.send(JSON.stringify(message));
}

//fonction pour demander nos victoires/defaites/egalites
export function askForMyStats() {
    const message = {
        type: "getStats"
    }
    socket.send(JSON.stringify(message));
}

//fonction pour informer le serveur qu'on en a marre d'attendre dans le loby
export function sendLeaveLobyToServer() {
    const message = {
        type: "leaveLoby"
    };
    socket.send(JSON.stringify(message));
}




