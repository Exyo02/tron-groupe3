//Load & gère le display de la game et les events listener pendant le jeu

import { Game } from "./gameLogic.js";
import { sendDirection, sendEnterLoby2pToServer, sendEnterLoby4pToServer } from "./gestionWebsocket.js";
import { loadHomeSection } from "./loadHome.js";

const gameSection = document.getElementById("game");
const cadreDeJeu = document.getElementById("cadreDeJeu");
const legendInGame = document.getElementById("legendInGame");
const boiteDialogue = document.getElementById("boiteDialogue");
var goHomeButton;

// Attention doit être la même que dans le serveur.
const tailleMatrice = 50;



//Le numéro de joueur (le notre)  
var playerNumber;

// l'objet game de la partie en cours
var game;

//notre pseudo (on le reçoit via la page d'home qui le passe à cette section)
var monPseudo;



//La fonction appelée depuis la page d'home pour Load la section game de l'Html
export function loadGameSection(pseudo, FourPlayers) {
    gameSection.style.display = "flex";
    if (pseudo)
        monPseudo = pseudo;
    addAndPaintBackGround();
    // rmq : positions initiales (il faut les mêmes côté serveur et côté client)
    game = new Game(FourPlayers);
    updateClasses()
    showWaitingMessage()

    if (!goHomeButton) //on regarde si on a déjà géré le goHomeButton pour éviter empilement des listeners sur le button (  si on avait déjà chargé la game section auparavant )
        addEventForGoHomeButton();


    //FourPlayers est un booléen reçu depuis la section Home
    if (FourPlayers) {
        sendEnterLoby4pToServer();
    }
    else {
        sendEnterLoby2pToServer();
    }
    document.body.style.overflow = "hidden";  // ← スクロール禁止
}

//La fonction pour fermer la section game lorsqu'on retourne à la section Home
function closeGameSection() {
    gameSection.style.display = "none";
    document.body.style.overflow = "scroll";  // ← スクロール禁止
}

//Montrer qu'on est dans le loby
function showWaitingMessage() {
    boiteDialogue.innerText = "En attente de joueur !";
}



//Générer le cadre svg de base 
function addAndPaintBackGround() {
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

            //on set les id de chaque case sur ce canvas "x:y" pour gérér les changements de classe in games
            rect.setAttribute("id", `${x}:${y}`);
            cadreDeJeu.appendChild(rect);
        }
    }
}

//La fonction appelée à chaque server tick
function updateClasses() {
    game.players.forEach((p) => {
        if (p.direction != "mort") {

            //on remplace la tête en mur si elle existe
            const PreviousHead = document.querySelector("." + p.headClassName);
            if (PreviousHead) {
                PreviousHead.classList.replace(p.headClassName, p.wallClassName);
            }

            //puis on place la nouvelle tête
            const head = document.getElementById(p.actualCaseId);
            if (head) {
                head.classList.add(p.headClassName);
            }
        }
    })
}


//Chargé les listener pour la partie clavier & swipe
function setupInputControls() {
    //event desktop
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
}

// permet d'éviter de se suicider dans les listener
function getMyOwnDirection() {
    return game.getPlayerDirection(playerNumber);
}

//listener clavier
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

//Pour le téléphone

// Variables de contrôle du swipe
let xDown = null;
let yDown = null;

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



// Gestion du boutton retour home post game
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





//Gestion de la légénde in game savoir qui est qui
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


//Toutes les fonctions suivantes sont importés dans gestionWebSocket car elles dependent de messages du Serveur

//Recevoir les infos du serveurs
export function loadGameInfo(data) {
    playerNumber = data.nbPlayer;
    game.pseudos = data.adversaires;
    showLegend();
}

//Décompte de débute de parties
export function decount(data) {
    if (data.time == 0) {
        boiteDialogue.innerText = "C'est parti !";
        setupInputControls();
    }
    else {
        boiteDialogue.innerText = `Début dans ${data.time} !`;
    }

}

//Server tick on update direction et classes
export function handleServerTick(data) {
    if (!game) return;
    game.update(data.directions);
    updateClasses();
}

//Cas spéciale ou 2 joueurs arrivent exactement sur la même case
export function markCase(x, y) {
    const caseToMark = document.getElementById(`${x}:${y}`);
    caseToMark.classList.add("headConflict");
}

//On a perdu/gagné... on informe dans boite dialogue et on supprime les event listener pour pas envoyer de message de changement de direction inutiles  et surcharger le serveur
export function endGameForMe(message) {
    boiteDialogue.innerText = message;
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
}

//La partie est totalement terminé 
export function endGame(gagnants) {
    boiteDialogue.innerText = gagnants;
    showButtons();
    document.body.style.overflow = "auto"; // scroll ok
}








