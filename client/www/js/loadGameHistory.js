import { loadHomeSection } from "./loadHome.js";
import { askForGameHistory, askForMyStats } from "./gestionWebsocket.js";

const gameHistorySection = document.getElementById("gameHistory")
const backHome = document.getElementById("backHome");
const historyContainer = document.getElementById("matchHistoryContainer");
var monPseudo;






export function loadGameHistorySection(username) {
    if (username)
        monPseudo = username;
    gameHistorySection.style.display = "flex"
    historyContainer.innerHTML = `<p>
        Ton historique de partie : </p>`;
    addEventForBackHomeButton();
    askForGameHistory();
    askForMyStats();
}

function closeGameHistorySection() {
    gameHistorySection.style.display = "none"

}


function addEventForBackHomeButton() {
    backHome.addEventListener("click", () => {
        closeGameHistorySection();
        loadHomeSection();
    })
}

export function displayGameHistory(gameResults) {

    if (!historyContainer) {
        console.error("can not find matchHistoryContainer。");
        return;
    }

    gameResults.forEach((game) => {
        const div = document.createElement("div");
        let pseudoWinner = game.winner;
        let date = new Date(game.endTime);
        if (pseudoWinner == monPseudo) {
            div.classList.add("victoire");
        }
        else if (pseudoWinner == "egalite") {
            div.classList.add("egalite");
        }
        else {
            div.classList.add("defaite");
        }
        div.innerText = "Partie contre : ";
        game.players.filter( p => p != monPseudo).forEach(p =>{
            div.innerText +=` ${p}`
        })
        div.innerText += ` le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()} `;
        historyContainer.appendChild(div);
    });

    //Ajout du nombre d'égalite , win , loose en haut de page
}


export function displayVictoiresAndDefaites(victoires, defaites) {
    const victoiresDiv = document.getElementById("victoires");
    const defaitesDiv = document.getElementById("defaites");
    victoiresDiv.innerText = `Mes Victoires : ${victoires}`
    defaitesDiv.innerText = `Mes defaites : ${defaites}`;
}