// import main from "./htmlAndLoopHandler.js";
import { loadLoginSection } from "./loadLogin.js";
import { connectWebSocket } from "./gestionWebsocket.js";

document.addEventListener('deviceready', () => {
    console.log('Running Cordova app');
    document.getElementById('deviceready')?.classList.add('ready');
});

connectWebSocket();
loadLoginSection();
// main();    

// lancement du jeu
