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
        Tes 5 dernières parties </p>`;
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
        if (game.winner instanceof Array && game.winner.includes(monPseudo)) {
            div.classList.add("egalite");
        }
        else if (game.winner == monPseudo) {
            div.classList.add("victoire");
        }
        else {
            div.classList.add("defaite");

        }
        let date = new Date(game.endTime);
        div.innerText = "Partie contre : ";
        game.players.filter(p => p != monPseudo).forEach(p => {
            div.innerText += ` ${p}`
        })
        div.innerText += ` le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()} `;
        historyContainer.appendChild(div);
    });

}


//Ajout du nombre d'égalite , win , loose en haut de page
export function displayVictoiresAndDefaites(victoires, defaites, egalites) {
    const victoiresDiv = document.getElementById("victoires");
    const defaitesDiv = document.getElementById("defaites");
    const egalitesDiv = document.getElementById("egalites");
    victoiresDiv.innerText = `Mes victoires : ${victoires}`
    defaitesDiv.innerText = `Mes defaites : ${defaites}`;
    egalitesDiv.innerText = `Mes égalités : ${egalites}`;
}