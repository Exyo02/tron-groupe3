//Ce qu'on appelle "loby" c'est une file d'attente qui lance une partie une fois pleine

const { lancerPartie } = require("./game");

//tableaux des joueurs en attente , dès qu'ils  atteignent deux ou quatre crée la partie et vide
var loby2p = [];
var loby4p = [];



function ajouterClientAuLoby2p(connection) {
    loby2p.push(connection);
    if (loby2p.length == 2)
        loby2p = lancerPartie(loby2p, false);
}

function ajouterClientAuLoby4p(connection) {
    loby4p.push(connection);
    if (loby4p.length == 4)
        loby4p = lancerPartie(loby4p, true);

}

//Sert à supprimer le client du loby s'il se déconnecte ou s'il quitte le loby
function supprimerClientLoby(connection) {

    let indexInloby2p = loby2p.indexOf(connection);
    let indexInloby4p = loby4p.indexOf(connection);
    if (indexInloby2p != -1) {
        loby2p.splice(indexInloby2p, 1);
    }
    if (indexInloby4p != -1) {
        loby4p.splice(indexInloby4p, 1);
    }
}

module.exports = { ajouterClientAuLoby2p, ajouterClientAuLoby4p, supprimerClientLoby };