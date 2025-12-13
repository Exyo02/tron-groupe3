// import main from "./htmlAndLoopHandler.js";
import { loadLoginSection } from "./loadLogin.js";
import { connectWebSocket } from "./gestionWebsocket.js";

document.addEventListener('deviceready', () => {
    console.log('Running Cordova app');
    document.getElementById('deviceready')?.classList.add('ready');
});

//Démarrer la connexion webSocket
connectWebSocket();

//Charger la page de login
loadLoginSection();

