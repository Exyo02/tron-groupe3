
//Le home c'est l'accueil une fois connecté ce fichier  load cette section 
import { loadGameSection } from "./loadGame.js";
import { loadLoginSection } from "./loadLogin.js";
import { loadGameHistorySection } from "./loadGameHistory.js";
import { askForBestPlayers, sendLogOutToServer } from "./gestionWebsocket.js";
const homeSection = document.getElementById("home");
const bestPlayers = document.getElementById("bestPlayers");
var start2pButton;
var start4pButton;
var loadHistoryButton;
var logOutButton

//Si le login a été accepté le serveur renvoit loginSucess avec le pseudo ce qui nous permet de conserver notre pseudo
var pseudo;

export function loadHomeSection(username) {
    if (username) {
        console.log(username);
        pseudo = username;
        setPseudoInTitle()
    }
    homeSection.style.display = "flex";

    //On evite ainsi l'empilement des listener si les boutons existent déjà
    if (!start2pButton)
        addEventForStart2pButton();
    if (!start4pButton)
        addEventForStart4pButton();
    if (!loadHistoryButton)
        addEventForLoadHistoryButton();
    if (!logOutButton)
        addEventForLogOutButton();

    //Demande au serveur les infos pour les meilleurs joueurs
    askForBestPlayers();
}

function closeHomeSection() {
    homeSection.style.display = "none";
}

//Afficher un message " Bienvenue à toi xxx"
function setPseudoInTitle() {
    const title = document.getElementById("title");
    title.innerText = `Bienvenue à toi ${pseudo}`;
}

//Boutton pour rentrer dans le loby à 2 joueurs
function addEventForStart2pButton() {
    start2pButton = document.getElementById("start2p");
    start2pButton.addEventListener("click", () => {
        closeHomeSection();
        loadGameSection(pseudo, false);
    });

}

//Boutton pour rentrer dans le loby à 4 joueurs
function addEventForStart4pButton() {
    start4pButton = document.getElementById("start4p");
    start4pButton.addEventListener("click", () => {
        closeHomeSection();
        loadGameSection(pseudo, true);
    });

}

//Boutton pour accéder à notre historique de partie
function addEventForLoadHistoryButton() {
    loadHistoryButton = document.getElementById("loadHistory");
    loadHistoryButton.addEventListener("click", () => {
        closeHomeSection();
        loadGameHistorySection(pseudo);
    });

}

//Boutton de déconnexion
function addEventForLogOutButton(){
    logOutButton = document.getElementById("logOut");
    logOutButton.addEventListener("click", ()=>{
        sendLogOutToServer();
        closeHomeSection();
        loadLoginSection();
    })
}

//La fonction appelée par gestionWebsocket lorsque la réponse du serveur pour les best players est reçu
export function displayBestPlayers(players) {
    if(!players)
        return;
    //personne n'a encore joué sur le serveur
    
    bestPlayers.innerHTML = `<p>
        Les Meilleurs Joueurs : </p>`
    players.forEach(p => {
        const divPlayer = document.createElement('div');
        divPlayer.innerText = `
        ${p.username} , Vic  ${p.victoires} | Def ${p.defaites}`;
        bestPlayers.appendChild(divPlayer);
    });
}



