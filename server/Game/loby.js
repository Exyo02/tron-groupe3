const { lancerPartie } = require("./game");

//tableau de joueur en attente , dès qu'il atteint deux crée la partie et vide
var loby2p = [];
var loby4p = [];



function ajouterClientAuLoby2p(connection) {
    loby2p.push(connection);
    // Pour L'instant partie de deux joueurs pour faciliter le débeuguage
    console.log(loby2p.length);
    if (loby2p.length == 2)
        loby2p = lancerPartie(loby2p, false);
}

function ajouterClientAuLoby4p(connection) {
    loby4p.push(connection);
    // Pour L'instant partie de deux joueurs pour faciliter le débeuguage
    if (loby4p.length == 4)
        loby4p = lancerPartie(loby4p, true);
  
}

function supprimerClientLoby(connection) {
    let indexInloby2p = loby2p.indexOf(connection);
    let indexInloby4p = loby4p.indexOf(connection);
    if (indexInloby2p != -1) {
        // on retire le client du loby2p s'il y était
        loby2p.splice(indexInloby2p, 1);
    }
    if (indexInloby4p != -1) {
        loby4p.splice(indexInloby4p, 1);
    }
}

module.exports = { ajouterClientAuLoby2p, ajouterClientAuLoby4p, supprimerClientLoby };