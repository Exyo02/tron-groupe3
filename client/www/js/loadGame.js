//Load & gère le display de la game et les events listener pendant le jeu

import { Game } from "./gameLogic.js";
import { sendDirection, sendEnterLobbyToServer } from "./gestionWebsocket.js";
import { loadHomeSection } from "./loadHome.js";

const gameSection = document.getElementById("game");
const cadreDeJeu = document.getElementById("cadreDeJeu");
const legendInGame = document.getElementById("legendInGame");

// Attention doit être la même que dans le serveur.
const tailleMatrice = 50;
const boiteDialogue = document.getElementById("boiteDialogue");
var restartButton;
var goHomeButton;


//Le numéro de joueur et l'objet game de la partie en cours
var playerNumber;
var game;
var monPseudo;
var pseudoAdversaire;

// Variables de contrôle du swipe
let xDown = null;                                                        
let yDown = null;

export function loadGameSection(pseudo) {
    document.body.style.overflow = "hidden";  // ← スクロール禁止
    gameSection.style.display = "flex";
    if (pseudo)
        monPseudo = pseudo;
    addAndPaintBackGround();
    // rmq : positions initiales (il faut les mêmes côté serveur et côté client)
    game = new Game();
    updateClasses()
    showWaitingMessage()
    sendEnterLobbyToServer();

    if (!restartButton)
        addEventForRestartButton();
    if (!goHomeButton)
        addEventForGoHomeButton();

    // setupInputControls();
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
    pseudoAdversaire = data.pseudoAdversaire;
    showLegend();
}


function addAndPaintBackGround() {
    //let totalLength = Math.min(window.innerWidth, window.innerHeight) * 0.7;
    let ratio = window.innerWidth < 800 ? 0.95 : 0.7;
    let totalLength = Math.min(window.innerWidth, window.innerHeight) * ratio;
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
            rect.classList.add("caseNonJouee");
            cadreDeJeu.appendChild(rect);
        }
    }
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
    //event desktop
    document.addEventListener('keydown', handleKeyDown);
    //event mobile
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);
    
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

    sendDirection(direction, playerNumber);
}





//Variables pour gérer le swipe
function getTouches(evt) {
    return evt.touches || evt.originalEvent.touches;
}

//Détection du toucher initial
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;   
}

//Détection du swipe
function handleTouchMove(evt) {
    if (!xDown || !yDown || !game) return;

    let xUp = evt.touches[0].clientX;                                    
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    let direction = null;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // mouvement horisontal
        if (xDiff > 0) {
            //joueur va vers gauche
            if (getMyOwnDirection() !== 'droite')
                direction = "gauche";
        } else {
            //joueur va vers droit
            if (getMyOwnDirection() !== 'gauche')
                direction = "droite";
        }
    } else {
        // mouvement vertical
        if (yDiff > 0) {
            //joueur va vers haut
            if (getMyOwnDirection() !== 'bas')
                direction = "haut";
        } else {
            //joueur va vers bas
            if (getMyOwnDirection() !== 'haut')
                direction = "bas";
        }
    }

    // envoie direction
    if (direction)
        sendDirection(direction, playerNumber);

    xDown = null;
    yDown = null;
}


export function endGame(egalite, perdant, gagnant) {
    console.log("MOn X quand je suis mort " + game.j1.x)
    console.log("X du j2 quand je suis mort " + game.j2.x)
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
    game = null;
    document.removeEventListener("keydown", handleKeyDown);
    showButtons();
    document.body.style.overflow = "auto"; // scroll ok
}


// GESTION DES BOUTTONS RESTART & GO HOME
function showButtons() {
    restartButton.style.display = "block";
    goHomeButton.style.display = "block";

}


function addEventForRestartButton() {
    restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", () => {
        restartButton.style.display = "none";
        goHomeButton.style.display = "none";
        legendInGame.style.display = "none";

        loadGameSection();

    })

}

function addEventForGoHomeButton() {
    goHomeButton = document.getElementById("goHome");
    goHomeButton.addEventListener("click", () => {
        restartButton.style.display = "none";
        legendInGame.style.display = "none";

        goHomeButton.style.display = "none";
        closeGameSection();
        loadHomeSection();
    })
}

// --------------------------------------------





export function handleServerTick(data) {
    if (!game) return;
    game.update(data.joueur1, data.joueur2);
    updateClasses();
}

function getMyOwnDirection() {
    return game.getPlayerDirection(playerNumber);
}

function showLegend() {
    const p1Legend = document.getElementById("p1Legend");
    const p2Legend = document.getElementById("p2Legend");

    if (playerNumber === 1) {
        p1Legend.innerText = `(vous) ${monPseudo}`;
        p2Legend.innerText = `(adversaire) ${pseudoAdversaire}`;
    }
    else {
        p1Legend.innerText = `(adversaire) ${pseudoAdversaire}`;
        p2Legend.innerText = `(vous) ${monPseudo}`;
    }

    legendInGame.style.display = "flex";
}

