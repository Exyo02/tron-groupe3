import { loadHomeSection } from "./loadHome.js";
import { askForGameHistory, askForMyStats } from "./gestionWebsocket.js";

const gameHistorySection = document.getElementById("gameHistory")
const historyContainer = document.getElementById("matchHistoryContainer");
var monPseudo;
var backHome;





export function loadGameHistorySection(username) {
    if (username)
        monPseudo = username;
    gameHistorySection.style.display = "flex"
    historyContainer.innerHTML = `<p>
        Tes 5 dernières parties </p>`;

    if (!backHome){ //éviter empilement des listener sur le boutton
        addEventForBackHomeButton();
    }
    
    askForGameHistory(); //fonctions déclarées dans gestionWebSocket pour demander les infos au serveur
    askForMyStats();
}

function closeGameHistorySection() {
    gameHistorySection.style.display = "none"

}


function addEventForBackHomeButton() {
    backHome = document.getElementById("backHome");
    backHome.addEventListener("click", () => {
        closeGameHistorySection();
        loadHomeSection();
    })
}


//Display de l'historique des parties une fois la réponse du serveur reçu
export function displayGameHistory(gameResults) {
    //on reçoit un tableau de game du serveur

    gameResults.forEach((game) => {
        const div = document.createElement("div"); // pour chaque  game on crée une div

        // --- on cherche ensuite à savoir si on l'affiche en rouge, vert ou gris :
        if (game.winner instanceof Array && game.winner.includes(monPseudo)) {
            div.classList.add("egalite"); // si les gagnants sont plusieurs et que je suis dedans je c'est une égalité
        }
        else if (game.winner == monPseudo) { // si je suis le gagnant c'est une victoire
            div.classList.add("victoire");
        }
        else { // dans tous les autres cas c'est une défaites
            div.classList.add("defaite");

        }
        // --- vient ensuite le contenu : 
        let date = new Date(game.endTime); // on récupére la date de la game
        div.innerText = "Partie contre : "; // on inscrit le pseudo de tous les adversaires
        game.players.filter(p => p != monPseudo).forEach(p => {
            div.innerText += ` ${p}`
        })
        div.innerText += ` le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()} `; //on formate la date pour que ce soit plus agréable
       // --- enfin on append la div à l'historyContainer
        historyContainer.appendChild(div); 
    });

}


//Ajout du nombre d'égalités , victoires, défaites en haut de page une fois la réponse du serveur reçu
export function displayVictoiresAndDefaites(victoires, defaites, egalites) {
    const victoiresDiv = document.getElementById("victoires");
    const defaitesDiv = document.getElementById("defaites");
    const egalitesDiv = document.getElementById("egalites");
    victoiresDiv.innerText = `Mes victoires : ${victoires}`
    defaitesDiv.innerText = `Mes defaites : ${defaites}`;
    egalitesDiv.innerText = `Mes égalités : ${egalites}`;
}