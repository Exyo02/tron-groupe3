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
    gameResults.forEach((game) => {
        const div = document.createElement("div");
        let pseudoWinner = game.winner == 1 ? game.player1 : game.player2;
        let pseudoAdversaire = monPseudo == game.player1 ? game.player2 : game.player1;
        let date = new Date(game.endTime);
        if (pseudoWinner == monPseudo) {
            div.classList.add("win");
            win += 1;
        }
        else {
            loose += 1;
            div.classList.add("loose");
        }
        div.innerText = ` Partie contre ${pseudoAdversaire} le ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()} `;
        historyContainer.appendChild(div);
        console.log("une ligne ajoute");
    });

    const winAndLoose = document.createElement("div");
    winAndLoose.id = "winAndLoose";
    const winDiv = document.createElement("div");
    winDiv.innerHTML = `Nombre de victoire ${win}`;
    winDiv.classList.add("win");
    const looseDiv = document.createElement("div");
    looseDiv.innerHTML = `Nombre de défaite ${loose}`;
    looseDiv.classList.add("loose");
    winAndLoose.appendChild(winDiv);
    winAndLoose.appendChild(looseDiv);
    historyContainer.insertBefore(winAndLoose, historyContainer.firstChild);
}
