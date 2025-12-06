//Load & gère le display de la game et les events listener pendant le jeu

import { Game } from "./gameLogic.js";
import { sendDirection, sendEnterLoby2pToServer, sendEnterLoby4pToServer } from "./gestionWebsocket.js";
import { loadHomeSection } from "./loadHome.js";

const gameSection = document.getElementById("game");
const cadreDeJeu = document.getElementById("cadreDeJeu");
const legendInGame = document.getElementById("legendInGame");

// Attention doit être la même que dans le serveur.
const tailleMatrice = 50;
const boiteDialogue = document.getElementById("boiteDialogue");
var goHomeButton;


//Le numéro de joueur et l'objet game de la partie en cours
var playerNumber;
var game;
var monPseudo;

export function loadGameSection(pseudo, FourPlayers) {
    gameSection.style.display = "flex";
    if (pseudo)
        monPseudo = pseudo;
    addAndPaintBackGround();
    // rmq : positions initiales (il faut les mêmes côté serveur et côté client)
    game = new Game(FourPlayers);
    updateClasses()
    showWaitingMessage()
    if (!goHomeButton)
        addEventForGoHomeButton();

    if (FourPlayers) {
        sendEnterLoby4pToServer();

    }
    else {
        sendEnterLoby2pToServer();
    }
}

function closeGameSection() {
    gameSection.style.display = "none";
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
    game.pseudos = data.adversaires;
    showLegend();
}


function addAndPaintBackGround() {
    let totalLength = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    let oneTileLength = totalLength / tailleMatrice;

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
            cadreDeJeu.appendChild(rect);
        }
    }
}

function updateClasses() {
    const ancienneJ1 = document.querySelector('.j1');
    const ancienneJ2 = document.querySelector('.j2');
    if (ancienneJ1) {
        ancienneJ1.classList.replace('j1', 'murj1');
    }
    if (ancienneJ2) {
        ancienneJ2.classList.replace('j2', 'murj2');
    }

    // nouvelle position
    const caseJ1 = document.getElementById(`${game.j1.x}:${game.j1.y}`);
    const caseJ2 = document.getElementById(`${game.j2.x}:${game.j2.y}`);
    if (caseJ1) {
        caseJ1.classList.add('j1');
    }
    if (caseJ2) {
        caseJ2.classList.add('j2');
    }

    //Si 4 joueurs on update aussi j3 et j4
    if (game.players.length == 4) {

        const ancienneJ3 = document.querySelector('.j3');
        const ancienneJ4 = document.querySelector('.j4');
        if (ancienneJ3) {
            ancienneJ3.classList.replace('j3', 'murj3');
        }
        if (ancienneJ4) {
            ancienneJ4.classList.replace('j4', 'murj4');
        }

        const caseJ3 = document.getElementById(`${game.j3.x}:${game.j3.y}`);
        const caseJ4 = document.getElementById(`${game.j4.x}:${game.j4.y}`);
        if (caseJ3) {
            caseJ3.classList.add('j3');
        }
        if (caseJ4) {
            caseJ4.classList.add('j4');
        }

    }

}




function setupInputControls() {
    document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
    let direction;
    if (getMyOwnDirection() == 'mort')
        return;
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

    sendDirection(direction, playerNumber);
}




export function endGameForMe(message) {
    boiteDialogue.innerText = message;
    document.removeEventListener("keydown", handleKeyDown);
}

export function endGame(gagnants) {
    boiteDialogue.innerText = gagnants;
    showButtons();
}


// GESTION DU BOUTTON GO HOME
function showButtons() {
    goHomeButton.style.display = "block";
}




function addEventForGoHomeButton() {
    goHomeButton = document.getElementById("goHome");
    goHomeButton.addEventListener("click", () => {
        legendInGame.style.display = "none";
        goHomeButton.style.display = "none";
        closeGameSection();
        loadHomeSection();
    })
}

// --------------------------------------------





export function handleServerTick(data) {
    if (!game) return;
    game.update(data.directions);
    updateClasses();
}

function getMyOwnDirection() {
    return game.getPlayerDirection(playerNumber);
}


const couleurs = ["blue", "red", "green", "purple"];
function showLegend() {
    legendInGame.innerHTML = "";
    let i = 0;
    game.pseudos.forEach(p => {
        const playerInfo = document.createElement('div');
        playerInfo.style.backgroundColor = couleurs[i];
        if (p == monPseudo) {
            playerInfo.innerHTML = `<strong> (vous) ${p}</strong>`;

        }
        else {
            playerInfo.innerHTML = `${p}`;

        }
        legendInGame.appendChild(playerInfo);
        i++
    });

    legendInGame.style.display = "flex";
}

