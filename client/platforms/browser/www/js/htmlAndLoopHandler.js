import { connectWebSocket, enterLobby, onMessage, sendDirection } from "./gestionWebsocket.js";
import { Game } from "./gameLogic.js";

const cadreDeJeu = document.getElementById("cadreDeJeu");
const startButton = document.getElementById("start");
const totalLength = Math.min(window.innerWidth, window.innerHeight) - 100;
const oneTileLength = totalLength / 30;

let game = null;
let playerNumber = null;
let waitingMessage = null;

// entrée principale du jeu 
export default function main() {
    connectWebSocket();
    addEventForStartButton();
    setupServerMessageHandling();
}

// gestion bouton Start/Restart 
function addEventForStartButton() {
    startButton.addEventListener("click", () => {
        startButton.style.display = "none";
        showWaitingMessage();
        enterLobby();
    });
}

//  message attente 
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

//  gestion des messages serveur 
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
                endGame(data.gagnant, data.perdant);
                break;
        }
    });
}

//  initialisation partie 
function startGame(numeroDuJoueur) {
    playerNumber = numeroDuJoueur;
    removeWaitingMessage();

    // génère la grille SVG et rend visible
    addAndPaintBackGround();
    cadreDeJeu.style.display = "block";

    setupInputControls();

    console.log(`Partie lancée ! Vous êtes le joueur ${playerNumber}`);
}

// tick serveur : met à jour matrice et affiche 
// appelée à chaque "tick" serveur pour mettre à jour l'état du jeu côté client
// le paramètre data est un objet contenant les informations envoyées par le serveur pour chaque joueur
function handleServerTick(data) {
    if (!game) {
        const localData = data["joueur" + playerNumber];
        if (!localData) return; // sécurité
        game = new Game(playerNumber, localData.x, localData.y, localData.direction);
    }

    //  mettre à jour la matrice pour le joueur local ---
    const localData = data["joueur" + playerNumber];
    if (localData) {
        game.player.x = localData.x;
        game.player.y = localData.y;
        game.player.direction = localData.direction;
        game.gameboard.rendreCaseCommeJoue(game.player);
    }

    //  mettre à jour la matrice pour l'autre joueur ---
    const otherNumber = playerNumber === 1 ? 2 : 1;
    const otherData = data["joueur" + otherNumber];
    if (otherData) {
        const pseudoPlayer = {
            x: otherData.x,
            y: otherData.y,
            nbPlayer: otherNumber
        };
        game.gameboard.rendreCaseCommeJoue(pseudoPlayer);
    }

    PaintCase(game.gameboard);
}

//  colorie toutes les cases déjà parcourues 
function PaintCase(gameboard) {
    if (!gameboard || !Array.isArray(gameboard.matrice)) {
        console.warn("PaintCase ignorée : matrice invalide", gameboard);
        return;
    }

    for (let y = 0; y < gameboard.matrice.length; y++) {
        for (let x = 0; x < gameboard.matrice[y].length; x++) {
            const playerNumber = gameboard.matrice[y][x];
            if (playerNumber !== 0) {
                paintTile(x, y, playerNumber);
            }
        }
    }
}

//  colorie une case spécifique 
function paintTile(x, y, playerNumber) {
    const rect = cadreDeJeu.querySelector(`rect[data-x="${x}"][data-y="${y}"]`);
    if (!rect) return;
    rect.setAttribute("fill", playerNumber === 1 ? "green" : "blue");
}

//  réinitialisation grille 
function clearGridColors() {
    const rects = cadreDeJeu.querySelectorAll('rect');
    rects.forEach(r => r.setAttribute('fill', 'black'));
}

//  contrôles clavier 
function setupInputControls() {
    document.addEventListener("keydown", (e) => {
        let newDirection = null;
        switch (e.key) {
            case "z":
            case "ArrowUp": newDirection = "haut"; break;
            case "s":
            case "ArrowDown": newDirection = "bas"; break;
            case "q":
            case "ArrowLeft": newDirection = "gauche"; break;
            case "d":
            case "ArrowRight": newDirection = "droite"; break;
        }

        if (newDirection && game) {
            game.player.direction = newDirection;
            sendDirection(newDirection);
        }
    });
}

//  génération de la grille SVG 
function addAndPaintBackGround() {
    cadreDeJeu.innerHTML = ""; // vide le SVG
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
            rect.setAttribute("data-x", x);
            rect.setAttribute("data-y", y);
            cadreDeJeu.appendChild(rect);
        }
    }
}

//  fin de partie 
function endGame(gagnant, perdant) {
    let message;
    if (playerNumber === perdant) {
        message = "Vous avez perdu";
    } else if (playerNumber === gagnant) {
        message = "Vous avez gagné";
    } else {
        message = `Joueur ${gagnant} a gagné.`;
    }

    alert(message);
    loadRestart();
}


// prépare le Restart 
function loadRestart() {
    startButton.style.display = "block";
    startButton.innerText = "Restart";

    // réinitialise le jeu 
    game = null;
    clearGridColors();
    cadreDeJeu.style.display = "none";
}