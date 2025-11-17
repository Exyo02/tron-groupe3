import { connectWebSocket, enterLobby, onMessage, sendDirection } from "./gestionWebsocket.js";
import { Game } from "./gameLogic.js";

const cadreDeJeu = document.getElementById("cadreDeJeu");
const startButton = document.getElementById("start");
const totalLength = Math.min(window.innerWidth, window.innerHeight) - 100;
const oneTileLength = totalLength / 50;

let game = null;
let playerNumber = null;
let waitingMessage = null;

export default function main() {
    connectWebSocket();
    addEventForStartButton();
    setupServerMessageHandling();
}

// bouton Start/Restart
function addEventForStartButton() {
    startButton.addEventListener("click", () => {
        startButton.style.display = "none";
        showWaitingMessage();
        enterLobby();
    });
}

// message attente
function showWaitingMessage() {
    waitingMessage = document.createElement("p");
    waitingMessage.id = "waitingMessage";
    waitingMessage.innerText = "Attente d’un autre joueur...";
    document.body.appendChild(waitingMessage);
}

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
            case "waitForPlayers":
                break;
            case "startGame":
                removeWaitingMessage();
                startGame(data.numeroDuJoueur);
                break;
            case "direction":
                handleServerTick(data);
                break;
            case "endGame":
                endGame( data.egalite,data.gagnant, data.perdant);
                break;
        }
    });
}

// initialisation partie
function startGame(numeroDuJoueur) {
    playerNumber = numeroDuJoueur;
    removeWaitingMessage();

    addAndPaintBackGround();
    cadreDeJeu.style.display = "block";

    // rmq : positions initiales (il faut les mêmes côté serveur et côté client)
    game = new Game(); 

    setupInputControls();

    console.log(`Partie lancée ! Vous êtes le joueur ${playerNumber}`);
}

// Tick serveur : directions reçues, on calcule nouvelle position côté client
function handleServerTick(data) {
    if (!game) return;

    game.update(data.joueur1, data.joueur2);
    updateClasses();
}

// mise à jour du DOM selon positions
function updateClasses() {
    const ancienneJ1 = document.querySelector('.j1');
    const ancienneJ2 = document.querySelector('.j2');
    if (ancienneJ1) {
        ancienneJ1.classList.replace('j1', 'murj1');
        ancienneJ1.setAttribute("fill", "darkgreen");
    }
    if (ancienneJ2) {
        ancienneJ2.classList.replace('j2', 'murj2');
        ancienneJ2.setAttribute("fill", "darkblue");
    }

    // nouvelle position
    const caseJ1 = document.getElementById(`${game.j1.x}:${game.j1.y}`);
    const caseJ2 = document.getElementById(`${game.j2.x}:${game.j2.y}`);
    if (caseJ1) {
        caseJ1.classList.remove('caseNonJouee');
        caseJ1.classList.add('j1');
        caseJ1.setAttribute("fill", "green");
    }
    if (caseJ2) {
        caseJ2.classList.remove('caseNonJouee');
        caseJ2.classList.add('j2');
        caseJ2.setAttribute("fill", "blue");
    }
}

// clavier
function setupInputControls() {
    document.addEventListener('keydown', (e) => {
        //on peut jouer avec les flèches ou zqsd
        let direction;

        switch (e.key) {
            case "z":
            case "ArrowUp":
                if (getMyOwnDirection() == 'bas')
                    return;
                direction = "haut";
                break;
            case "s":
            case "ArrowDown":
                if (getMyOwnDirection() == 'haut')
                    return;
                direction = "bas";
                break;
            case "q":
            case "ArrowLeft":
                if (getMyOwnDirection() == 'droite')
                    return;
                direction = "gauche";
                break
            case "d":
            case "ArrowRight":
                if (getMyOwnDirection() == 'gauche')
                    return;
                direction = "droite";
                break;
            default:
                return;
        }

        sendDirection(direction);
    });

}

function getMyOwnDirection(){
    return game.getPlayerDirection(playerNumber);
}

// génération de la grille 
function addAndPaintBackGround() {
    cadreDeJeu.innerHTML = "";
    cadreDeJeu.setAttribute("width", totalLength);
    cadreDeJeu.setAttribute("height", totalLength);

    for (let y = 0; y < 30; y++) {
        for (let x = 0; x < 30; x++) {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", oneTileLength);
            rect.setAttribute("height", oneTileLength);
            rect.setAttribute("x", x * oneTileLength);
            rect.setAttribute("y", y * oneTileLength);
            rect.setAttribute("fill", "black");
            rect.setAttribute("id", `${x}:${y}`);
            rect.classList.add("caseNonJouee");
            cadreDeJeu.appendChild(rect);
        }
    }
}

// fin de partie
function endGame(egalite, perdant, gagnant) {
    let message;

    if (egalite) {
        message = "Partie nulle";
    }
    else if (playerNumber === perdant) {
        message = "Vous avez perdu";
    }
    else if (playerNumber === gagnant) {
        message = "Vous avez gagné";
    }
    else {
        message = "non défini...";
    }

    alert(message);
    loadRestart();
}


// réinitialisation du jeu
function loadRestart() {
    startButton.style.display = "block";
    startButton.innerText = "Restart";

    game = null;
    cadreDeJeu.style.display = "none";

    const rects = cadreDeJeu.querySelectorAll("rect");
    rects.forEach(r => {
        r.setAttribute("fill", "black");
        r.className.baseVal = "caseNonJouee";
    });
}