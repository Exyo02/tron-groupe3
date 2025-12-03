import { connectWebSocket, enterLobby, enterLogin, onMessage,  afficherParties } from "./gestionWebsocket.js";
const accueilButton = document.getElementById("accueil")
const messageFin = document.getElementById("messageFin");

let game = null;
let playerNumber = null;
let waitingMessage = null;

export default function main() {
    connectWebSocket();
    addEvent();
    setupServerMessageHandling();
    afficherParties();
}

// bouton Start/Restart -> Du coup à mettre à l'arrivée de la section home ?


// affichage login


// message attente



// supprime message attente
function removeWaitingMessage() {
    if (waitingMessage) {
        waitingMessage.remove();
        waitingMessage = null;
    }
}

// messages du serveur
function setupServerMessageHandling() {
    onMessage((data) => {
        switch (data.type) {
            
             
        }
    });
}

// initialisation partie


// Tick serveur : directions reçues, on calcule nouvelle position côté client


// mise à jour du DOM selon positions


// clavier



// génération de la grille 


// fin de partie





// réinitialisation du jeu
const loadRestart = () =>{
    startButton.style.display = "block";
    startButton.innerText = "Restart";
}
