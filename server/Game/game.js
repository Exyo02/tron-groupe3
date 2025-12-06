const { Player } = require('./player.js');
const saveGameResult = require('../mongoose/gameResult.js');
const { ajouterVictoire, ajouterDefaite, ajouterEgalite } = require('../mongoose/user.js');



//Tableau des parties en cours pour être retrouvé lorsqu'on reçoit un message de changement direction
var games = new Map();

//Taile de la matrice
var tailleMatrice = 50;

//un tableau clé valeur qui prend une connection et nous renvoit la partie correspondante

// Classe Game
class Game {
    #players = [];
    //un tableau d'objet Player
    #vivants = [];

    #decountInterval
    //decount;
    #timer = 3;

    #gameInterval;
    //la variable de la gameLoop
    #matrice
    //la matrice du jeu en cours pour savoir quand quelqu'un est mort

    constructor(connection1, connection2) {
        this.#players.push(new Player(connection1, 1, 'droite', 9, 25));
        //j1 commencera vers le haut et il est important d'avoir les mêmes positions de départ que chez le client
        this.#players.push(new Player(connection2, 2, 'gauche', 40, 26));
        //j2 commencera vers le bas et il est important d'avoir les mêmes positions de départ que chez le client
        this.#matrice = []
        for (let i = 0; i < tailleMatrice; i++) {
            this.#matrice[i] = []
            for (let j = 0; j < tailleMatrice; j++) {
                this.#matrice[i][j] = 0;
            }
        }

    };

    //une méthode qui vient compléter constructeur quand 4 joueurs
    addOtherPlayers(connection3, connection4) {
        this.#players.push(new Player(connection3, 3, 'bas', 25, 9));
        this.#players.push(new Player(connection4, 4, 'haut', 26, 40));
    }
    notifyPlayers() {
        //on notifie les joueurs que ça commence
        this.players.forEach((player) => {
            let joinGameMessage = {
                type: "joinGame",
                nbPlayer: player.numeroDuJoueur,
                adversaires: this.pseudos
            }
            player.connection.sendUTF(JSON.stringify(joinGameMessage));
            this.#vivants.push(player);
        })

        // on lance le déconte
        this.decount();
    }

    decount() {
        //On créer un interval de décompte
        this.#decountInterval = setInterval(sendDecount, 1000, this);
    }

    startGame() {
        clearInterval(this.#decountInterval);
        //On marque la position de départ dans la matrice
        this.#players.forEach(p => {
            this.#matrice[p.y][p.x] = p.nbPlayer;
        })
        // c'est ici que le jeu est lancé on utilise la fonction sendAllDirections toutes les 100ms avec this comme paramètre ( cette game )
        this.#gameInterval = setInterval(sendAllDirections, 100, this);
    };

    //cette fonction sera appelé indépendament de la gameLoop chaque fois que le serveur recevra un message d'un client en jeu
    modifySomeoneDirection(nbPlayer, direction) {
        this.#players[nbPlayer - 1].direction = direction;
    }

    closeGame(gagnant) {
        clearInterval(this.#gameInterval);
        //gagnant sera un array si egalite
        if (gagnant.length > 1)
            saveGameResult(this.pseudos, gagnant);
        else {
            saveGameResult(this.pseudos, gagnant);
        }
        this.removeConnectionsFromGames();
        let gagnants = gagnant.length > 1 ? "Egalites : ": "Gagnant : "
        gagnant.forEach(g => {
            gagnants += g.connection.login + " ";
        });
        this.players.forEach(p => {
            p.connection.sendUTF(JSON.stringify({
                type: "endGame",
                gagnants: gagnants
            }))
        });
    }

    get players() {
        return this.#players
    }

    get timer() {
        return this.#timer;
    }

    set timer(x) {
        this.#timer = x;
    }

    //permet de retirer la game et les connexions du tableaux games
    removeConnectionsFromGames() {
        this.players.forEach(p => {
            games.delete(p.connection);
        })
    }



    // appeller à la fin de chaque game Loop
    UpdateAndcheckIfSomeoneDead() {   // renvoit 1 si j1 mort 2 si j2 mort, 3 si égalité 0 sinon;
        let mortsCeTour = [];
        this.#vivants.forEach((p) => {
            p.updatePosition();
            if (p.x >= tailleMatrice || p.x < 0 || p.y >= tailleMatrice || p.y < 0
                || this.#matrice[p.y][p.x] != 0) {
                p.direction = "mort";
                mortsCeTour.push(p);
            }
            this.#matrice[p.y][p.x] = p.numeroDuJoueur;
        }); //on update les x & y des joueurs , et on marque la matrice

        //on enlève les morts des vivants
        this.#vivants = this.#vivants.filter( p => !mortsCeTour.includes(p));
        return mortsCeTour;
    }


    get pseudos() {
        let pseudos = []
        this.players.forEach(p => {
            pseudos.push(p.connection.login);
        })
        return pseudos;
    }

    get directions() {
        let directions = []
        this.players.forEach(p => {
            directions.push(p.direction);
        })
        return directions;
    }


}

//La fonction Principale qu'on appelle depuis le loby
function lancerPartie(loby, fourPlayers) {
    let myNewGame = new Game(loby[0], loby[1]);
    games.set(loby[0], myNewGame);
    games.set(loby[1], myNewGame);

    if (fourPlayers) {
        myNewGame.addOtherPlayers(loby[2], loby[3]);
        games.set(loby[2], myNewGame);
        games.set(loby[3], myNewGame);
    }
    myNewGame.notifyPlayers();
    loby = [];
    return loby;
    // on clear le loby certains pour être toujours apt à lancer d'autres parties

}

//La fonction appellé à chaque changement de direction
function findAndUpdateGame(connection, nbPlayer, direction) {
    games.get(connection).modifySomeoneDirection(nbPlayer, direction);
}

//le décompte 3,2,1 ... de début de partie
function sendDecount(game) {
    decountMessage = {
        type: "decountGame",
        time: game.timer
    }
    game.players.forEach((player) => {
        player.connection.sendUTF(JSON.stringify(decountMessage));
    });
    game.timer = game.timer - 1;
    if (game.timer < 0)
        game.startGame();
}

//Server Tick
function sendAllDirections(game) {

    let mortsCeTour = game.UpdateAndcheckIfSomeoneDead();
    let nbMorts = game.directions.filter(d => d == "mort").length;
    //Cas ou tous le monde vivant est mort ce tour => EGALITE
    if (nbMorts == game.players.length) {
        mortsCeTour.forEach(player => {
            ajouterEgalite(player.connection.login);
            player.sendEndGameForMeMessage("Egalité !")
        });
        game.closeGame(mortsCeTour);
        return;
    }

    //Cas ou on a UN GAGNANT
    else if (nbMorts == game.players.length - 1) {
        mortsCeTour.forEach(player => {
            ajouterDefaite(player.connection.login);
            player.sendEndGameForMeMessage("Tu as perdu !")
        });
        winner = game.players.filter(p => p.direction != "mort");
        winner[0].sendEndGameForMeMessage("Tu as gagné !")
        ajouterVictoire(winner[0].connection.login);
        game.closeGame(winner);
        return;
    }

    //La partie continue on marque les joueurs perdants
    if (mortsCeTour > 0) {
        mortsCeTour.forEach(player => {
            ajouterDefaite(player.connection.login);
            player.sendEndOfGameMessage("perdu")
        });
    }
    let message = {
        type: "direction",
        directions: game.directions
    }
    game.players.forEach((player) => {
        player.connection.sendUTF(JSON.stringify(message));
    });
}

module.exports = { lancerPartie, findAndUpdateGame };