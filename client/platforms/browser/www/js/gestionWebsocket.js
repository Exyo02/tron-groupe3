let socket;
let playerNumber = null;
let onMessageCallback = null;

// connexion au serveur 
export function connectWebSocket() {
    socket = new WebSocket("ws://localhost:9898");

    socket.onopen = () => {
        console.log("Connecté au serveur WebSocket");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message reçu :", data);

        // si le serveur envoie startGame, on garde le numéro du joueur
        if (data.type === "startGame") {
            playerNumber = data.numeroDuJoueur;
        }

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
export function enterLobby() {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket non connectée");
        return;
    }
    const message = { type: "enterLoby" };
    socket.send(JSON.stringify(message));
    console.log("Envoi : entrée dans le lobby");
}

//  envoyer un changement de direction 
export function sendDirection(direction) {
    if (!socket || socket.readyState !== WebSocket.OPEN || playerNumber === null) return;

    const message = {
        type: "changeDirection",
        nbPlayer: playerNumber,
        direction: direction,
    };
    socket.send(JSON.stringify(message));
    console.log("Direction envoyée :", message);
}

// récupérer le numéro du joueur 
export function getPlayerNumber() {
    return playerNumber;
}
