import { loadHomeSection } from "./loadHome.js";
import { askForGameHistory } from "./gestionWebsocket.js";

const gameHistorySection = document.getElementById("gameHistory")
const matchHistory = document.getElementById("matchHistory");
const backHome = document.getElementById("backHome");
const historyContainer = document.getElementById("matchHistoryContainer");







export function loadGameHistorySection(){
    gameHistorySection.style.display = "flex"
    historyContainer.innerHTML = "";
    addEventForBackHomeButton();
    askForGameHistory();
}

function closeGameHistorySection(){
    gameHistorySection.style.display = "none"

}


function addEventForBackHomeButton(){
    backHome.addEventListener("click",()=>{
        closeGameHistorySection();
        loadHomeSection();
    })
}

export function displayGameHistory(gameResults) {

    if (!historyContainer) {
        console.error("can not find matchHistoryContainer。");
        return;
    }
    console.log("in displayGameHistory. history:", gameResults);

    gameResults.forEach((line) => {
        const div = document.createElement("div");
        div.textContent = line;
        historyContainer.appendChild(div);
        console.log("une ligne ajoute");
    });
}
