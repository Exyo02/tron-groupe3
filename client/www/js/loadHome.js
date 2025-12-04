
//Le home c'est l'accueil une fois connecté ce fichier  load cette section 
import { loadGameSection } from "./loadGame.js";
import { loadGameHistorySection } from "./loadGameHistory.js";
const homeSection = document.getElementById("home");
var startButton;
var loadHistoryButton;

var pseudo;

export function loadHomeSection(username) {
    if (username) {
        console.log(username);
        pseudo = username;
        setPseudoInTitle()
    }
    homeSection.style.display = "block";

    //On evite ainsi l'empilement des listener si les boutons existes déjà
    if (!startButton)
        addEventForStartButton();

    if (!loadHistoryButton)
        addEventForLoadHistoryButton();
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
        loadGameSection(username);
    });

}

function addEventForLoadHistoryButton() {
    loadHistoryButton = document.getElementById("loadHistory");
    loadHistoryButton.addEventListener("click", ()=>{
        closeHomeSection();
        loadGameHistorySection();
    });

}



