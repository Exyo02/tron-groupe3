
//Le home c'est l'accueil une fois connecté.
import { loadGameSection } from "./loadGame.js";
const homeSection = document.getElementById("home");
const startButton = document.getElementById("start");
var pseudo;

export function loadHomeSection(username){
    if(username){
        console.log(username);
        pseudo = username;
        setPseudoInTitle()
    }
    homeSection.style.display = "block";
    addEventForStartButton();
}

function closeHomeSection(){
    homeSection.style.display = "none";
}

function addEventForStartButton() {
    startButton.addEventListener("click", () => {
        closeHomeSection();
        loadGameSection(username);
        // un load game section ?
    });
  
}
function setPseudoInTitle(){
    const title = document.getElementById("title");
    title.innerText += pseudo;
}

// quand on clique sur lancer partie 
// on fait loadGamePanel du coup 
// accueilButton.addEventListener("click", () => {
//     accueilButton.style.display = "none";
//     messageFin.style.display = "none";
//     loadRestart();
// });