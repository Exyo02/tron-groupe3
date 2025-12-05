
//Le home c'est l'accueil une fois connecté ce fichier  load cette section 
import { loadGameSection } from "./loadGame.js";
import { loadGameHistorySection } from "./loadGameHistory.js";
import { askForBestPlayers } from "./gestionWebsocket.js";
const homeSection = document.getElementById("home");
const bestPlayers = document.getElementById("bestPlayers");
var startButton;
var loadHistoryButton;

var pseudo;

export function loadHomeSection(username) {
    if (username) {
        console.log(username);
        pseudo = username;
        setPseudoInTitle()
    }
    homeSection.style.display = "flex";

    //On evite ainsi l'empilement des listener si les boutons existes déjà
    if (!startButton)
        addEventForStartButton();

    if (!loadHistoryButton)
        addEventForLoadHistoryButton();

    askForBestPlayers();
}

function closeHomeSection() {
    homeSection.style.display = "none";
}

function setPseudoInTitle() {
    const title = document.getElementById("title");
    title.innerText += pseudo;
}

// GESTION DES BOUTTONS 
function addEventForStartButton() {
    startButton = document.getElementById("start");
    startButton.addEventListener("click", () => {
        closeHomeSection();
        loadGameSection(pseudo);
    });

}

function addEventForLoadHistoryButton() {
    loadHistoryButton = document.getElementById("loadHistory");
    loadHistoryButton.addEventListener("click", () => {
        closeHomeSection();
        loadGameHistorySection(pseudo);
    });

}

export function displayBestPlayers(players) {
    bestPlayers.innerHTML = `<p>
        Les Meilleurs Joueurs : </p>`
    players.forEach(p => {
        const divPlayer = document.createElement('div');
        divPlayer.innerText = `
        ${p.username} , Vic  ${p.victoires} | Def ${p.defaites}`;
        bestPlayers.appendChild(divPlayer);
    });
}



