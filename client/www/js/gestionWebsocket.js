import { handleServerTick, loadGameInfo, endGame, decount } from "./loadGame.js";
import { showError, closeLoginSection } from "./loadLogin.js";
import { loadHomeSection } from "./loadHome.js";
const startButton = document.getElementById("start");
const matchHistory = document.getElementById("matchHistory");
const loginSection = document.getElementById("loginSection");
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
        console.log("Serveur reçoit :", data);

        switch(data.type){
            case "joinGame":
                loadGameInfo(data);
                break;
            case "decountGame":
                decount(data);
                break;
            case "direction":
                handleServerTick(data);
                break;
            case"endGame":
                endGame(data.egalite, data.perdant, data.gagnant);
                break;
            case "loginSuccess":
                console.log(data);
                closeLoginSection();
                loadHomeSection(data.username);
                break;
            case "loginError":
                const errorMessage = "Le mot de passe est incorrect. Veuillez réessayer.";
                showError(errorMessage);
                break;
        }

      
        // if (data.type === "loginError") {
        //     // Afficher un message d'erreur
        //     startButton.style.display = "none";
        //     matchHistory.style.display = "none";
            
        // }

        if (data.type === 'gameHistory') {
            // appeler une méthode pour obtenir un objet du DOM et y ajouter du texte
            const gameResults = data.history;  //utiliser l’historique du serveur comme paquet
            matchHistory.style.display = "none";
            startButton.style.display = "none";
            displayGameHistory(gameResults);
        }

        //  cas gameHistoryError 
        if (data.type === 'gameHistoryError') {
            const errorMessage = messageObject.message;  
            console.error('Error:', errorMessage); 
        };

        // passe le message au reste de l’application
        if (onMessageCallback) {
            onMessageCallback(data);
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
    console.log("Envoi au serveur : entrée dans le lobby");
    matchHistory.style.display = "none";
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
    console.log("Direction envoyée au serveur :", message);
}

// récupérer le numéro du joueur 


// fonction pour envoyer le login au serveur
export function sendLoginToServer(message){
    socket.send(JSON.stringify(message));
}

export function afficherParties() {
    matchHistory.addEventListener("click", () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket non connectée");
            return;
        }
        const message = {
            type: "getGameHistory",
        };
        socket.send(JSON.stringify(message));
        console.log("Demande d'historique des matchs envoyée au serveur pour le joueur");
    })
}

function displayGameHistory(gameResults) {
    const historyContainer = document.getElementById("matchHistoryContainer");

    historyContainer.style.display = "block";

    if (!historyContainer) {
        console.error("can not find matchHistoryContainer。");
        return;
    }
    console.log("in displayGameHistory. history:", gameResults);

    gameResults.forEach((line) => {
        const div = document.createElement("div");
        div.textContent = line;  // insérer en tant que texte
        historyContainer.appendChild(div);
        console.log("une ligne ajoute");
    });
}


