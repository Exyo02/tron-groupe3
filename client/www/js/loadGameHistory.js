import { loadHomeSection } from "./loadHome.js";
import { askForGameHistory } from "./gestionWebsocket.js";

const gameHistorySection = document.getElementById("gameHistory")
const matchHistory = document.getElementById("matchHistory");
const backHome = document.getElementById("backHome");
const historyContainer = document.getElementById("matchHistoryContainer");
var monPseudo;






export function loadGameHistorySection(username) {

    if (username)
        monPseudo = username;
    gameHistorySection.style.display = "flex"
    historyContainer.innerHTML = "";
    addEventForBackHomeButton();
    askForGameHistory();
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

    let win = 0;
    let loose = 0;
    let egalite = 0;
    gameResults.forEach((game) => {
        const div = document.createElement("div");
        let pseudoWinner = game.winner;
        let pseudoAdversaire = monPseudo == game.player1 ? game.player2 : game.player1;
        let date = new Date(game.endTime);
        if (pseudoWinner == monPseudo) {
            div.classList.add("win");
            win += 1;
        }
        else if (pseudoWinner == "egalite") {
            egalite += 1
            div.classList.add("egalite");
        }
        else {
            loose += 1;
            div.classList.add("loose");
        }
        div.innerText = ` Partie contre ${pseudoAdversaire} le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()} `;
        historyContainer.appendChild(div);
        console.log("une ligne ajoute");
    });

    //Ajout du nombre d'égalite , win , loose en haut de page
    const winAndLoose = document.createElement("div");
    winAndLoose.id = "winAndLoose";
    const winDiv = document.createElement("div");
    winDiv.innerHTML = `Nombre de victoire ${win}`;
    winDiv.classList.add("win");
    const looseDiv = document.createElement("div");
    looseDiv.innerHTML = `Nombre de défaite ${loose}`;
    looseDiv.classList.add("loose");
    const egaliteDiv = document.createElement("div");
    egaliteDiv.innerHTML = `Nombre d'égalité ${egalite}`;
    egaliteDiv.classList.add("egalite");
    winAndLoose.appendChild(winDiv);
    winAndLoose.appendChild(looseDiv);
    winAndLoose.appendChild(egaliteDiv);
    historyContainer.insertBefore(winAndLoose, historyContainer.firstChild);
}
