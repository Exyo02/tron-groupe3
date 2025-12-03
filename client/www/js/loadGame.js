import { Game } from "./gameLogic.js";
import { sendDirection, sendEnterLobbyToServer } from "./gestionWebsocket.js";

const gameSection = document.getElementById("game");
const cadreDeJeu = document.getElementById("cadreDeJeu");
const totalLength = Math.min(window.innerWidth, window.innerHeight) - 100;
// Attention doit être la même que dans le serveur.
const tailleMatrice = 50;
const oneTileLength = totalLength / tailleMatrice;
const boiteDialogue = document.getElementById("boiteDialogue");
const restartButton = document.getElementById("restart");
const goHomeButton = document.getElementById("goHome");


//Le numéro de joueur et l'objet game de la partie en cours
var playerNumber;
var game;
var username;
var pseudoAdversaire;

export function loadGameSection(pseudo) {
    gameSection.style.display = "block";
    if (pseudo)
        username = pseudo;
    addAndPaintBackGround();
    // rmq : positions initiales (il faut les mêmes côté serveur et côté client)
    game = new Game();
    updateClasses()
    showWaitingMessage()
    sendEnterLobbyToServer();

    // setupInputControls();
}


function showWaitingMessage() {
    boiteDialogue.innerText = "En attente de joueur !";
}

export function decount(data) {
    if (data.time == 0) {
        boiteDialogue.innerText = "C'est parti !";
        setupInputControls();
    }
    else {
        boiteDialogue.innerText = `Début dans ${data.time} !`;
    }

}

export function loadGameInfo(data) {
    playerNumber = data.nbPlayer;
    console.log(playerNumber);
    pseudoAdversaire = data.pseudoAdversaire;
    showLegend();
}


function addAndPaintBackGround() {
    cadreDeJeu.innerHTML = "";
    cadreDeJeu.setAttribute("width", totalLength);
    cadreDeJeu.setAttribute("height", totalLength);

    for (let y = 0; y < tailleMatrice; y++) {
        for (let x = 0; x < tailleMatrice; x++) {
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
    cadreDeJeu.style.display = "block";
}

function updateClasses() {
    const ancienneJ1 = document.querySelector('.j1');
    const ancienneJ2 = document.querySelector('.j2');
    if (ancienneJ1) {
        ancienneJ1.classList.replace('j1', 'murj1');
        ancienneJ1.setAttribute("fill", "darkblue");
    }
    if (ancienneJ2) {
        ancienneJ2.classList.replace('j2', 'murj2');
        ancienneJ2.setAttribute("fill", "darkred");
    }

    // nouvelle position
    const caseJ1 = document.getElementById(`${game.j1.x}:${game.j1.y}`);
    const caseJ2 = document.getElementById(`${game.j2.x}:${game.j2.y}`);
    if (caseJ1) {
        caseJ1.classList.remove('caseNonJouee');
        caseJ1.classList.add('j1');
        caseJ1.setAttribute("fill", "blue");
    }
    if (caseJ2) {
        caseJ2.classList.remove('caseNonJouee');
        caseJ2.classList.add('j2');
        caseJ2.setAttribute("fill", "red");
    }
}




function setupInputControls() {
    document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
    let direction;

    switch (e.key) {
        case "z":
        case "ArrowUp":
            if (getMyOwnDirection() == 'bas') return;
            direction = "haut";
            break;

        case "s":
        case "ArrowDown":
            if (getMyOwnDirection() == 'haut') return;
            direction = "bas";
            break;

        case "q":
        case "ArrowLeft":
            if (getMyOwnDirection() == 'droite') return;
            direction = "gauche";
            break;

        case "d":
        case "ArrowRight":
            if (getMyOwnDirection() == 'gauche') return;
            direction = "droite";
            break;

        default:
            return;
    }

    console.log("jenvois");
    sendDirection(direction, playerNumber);
}



export function endGame(egalite, perdant, gagnant) {
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
    boiteDialogue.innerText = message;
    document.removeEventListener("keydown", handleKeyDown);
    showButtons();
}

function showButtons(){
    restartButton.style.display = "block";
    goHomeButton.style.display = "block";
    addEventForHomeAndRestart();
}

function addEventForHomeAndRestart(){
    restartButton.addEventListener("click",()=>{
        restartButton.style.display = "none";
        goHomeButton.style.display = "none";
        loadGameSection();

    })
    goHomeButton.addEventListener("click", () => {
        restartButton.style.display = "none";
        goHomeButton.style.display = "none";
    })
}

export function handleServerTick(data) {
    if (!game) return;

    game.update(data.joueur1, data.joueur2);
    updateClasses();
}

function getMyOwnDirection() {
    return game.getPlayerDirection(playerNumber);
}

function showLegend() {
    
}

//A Voir
const endGameMessage = (message) => {
    game = null;
}
