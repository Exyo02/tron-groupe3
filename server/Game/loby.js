const { lancerPartie } = require("./game");

//tableau de joueur en attente , dès qu'il atteint deux crée la partie et vide
var loby = [];

function ajouterClientAuLobby(connection) {
    loby.push(connection);
    // Pour L'instant partie de deux joueurs pour faciliter le débeuguage
    console.log(loby.length);
    if (loby.length == 2)
        loby = lancerPartie(loby);
    else {
        let message = {
            type: "waitForPlayers"
        };
        connection.sendUTF(JSON.stringify(message));
    }
}

function supprimerClientLoby(connection){
    let indexInLoby = loby.indexOf(connection);
    console.log(indexInLoby);
    if (indexInLoby != -1) {
        // on retire le client du loby s'il y était
        loby.splice(indexInLoby, 1);
    }
}

module.exports = { ajouterClientAuLobby, supprimerClientLoby };