const startButton = document.getElementById("start");
const matchHistory = document.getElementById("matchHistory");
const loginSection = document.getElementById("loginSection");
let socket;
let playerNumber = null;
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

        // si le serveur envoie startGame, on garde le numéro du joueur
        if (data.type === "startGame") {
            playerNumber = data.numeroDuJoueur;
        }

        if (data.type === "loginError") {
            // Afficher un message d'erreur
            startButton.style.display = "none";
            matchHistory.style.display = "none";
            const errorMessage = "Le mot de passe est incorrect. Veuillez réessayer.";
            showError(errorMessage);
        }

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
export function enterLobby(login,password) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("WebSocket non connectée");
        return;
    }

    //quand le serveur reçoit ce message il appelle la fonction verifierLogin() (voir Server.js)
    const message = { type: "login", username:login, password:password };
    socket.send(JSON.stringify(message));
    console.log("Envoi au serveur : vérification du login");

    //quand le serveur reçoit ce message il appelle la fonction ajouterClientAuLobby() (voir Server.js)
    message = { type: "enterLoby" };
    socket.send(JSON.stringify(message));
    console.log("Envoi au serveur : entrée dans le lobby");
    matchHistory.style.display = "none";
}

//  envoyer un changement de direction 
export function sendDirection(direction) {
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
export function getPlayerNumber() {
    return playerNumber;
}

// fonction pour entrer le login
export function enterLogin() {

    // Supprimer un ancien message d'erreur
    const oldMsg = document.getElementById("invalidLoginMessage");
    if (oldMsg) oldMsg.remove();

    // Vérification si champs vides
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) {
        showError("Veuillez remplir les deux champs.");
        return;
    }

    // Validation du format pour le nom d'utilisateur et le mot de passe
    const usernameRegex = /^[a-z][A-Za-z0-9]{2,19}$/;
    if (!usernameRegex.test(username)) {
        showError("Le nom d'utilisateur doit commencer par une minuscule et contenir 3 à 20 caractères alphanumériques.");
        return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        showError("Le mot de passe doit faire au moins 6 caractères et contenir au minimum une lettre et un chiffre.");
        return;
    }

    // Envoi du login au serveur
    const message = {
        type: "login",
        username: username,
        password: password,
    };

    startButton.style.display = "block";
    matchHistory.style.display = "block";
    socket.send(JSON.stringify(message));

}

function showError(msg) {
        let invalidLoginMessage = document.createElement("p");
        invalidLoginMessage.id = "invalidLoginMessage";
        invalidLoginMessage.innerText = msg;
        document.body.appendChild(invalidLoginMessage);
        loginSection.style.display = "block";
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


