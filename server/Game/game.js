const { Player } = require('./player.js');
const saveGameResult = require('../mongoose/gameResult.js');
const { ajouterVictoire, ajouterDefaite } = require('../mongoose/user.js');



//Tableau des parties en cours pour être retrouvé lorsqu'on reçoit un message de changement direction
var games = new Map();

//Taile de la matrice
var tailleMatrice = 50;

//un tableau clé valeur qui prend une connection et nous renvoit la partie correspondante

// Classe Game
class Game {
    #players = [];
    //un tableau d'objet Player
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

    notifyPlayers() {
        //on notifie les joueurs que ça commence
        this.players.forEach((player) => {
            console.log(player.numeroDuJoeur);
            let joinGameMessage = {
                type: "joinGame",
                nbPlayer: player.numeroDuJoueur,
                adversaires: this.pseudos
            }
            player.connection.sendUTF(JSON.stringify(joinGameMessage));

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
        this.#matrice[this.#players[0].y][this.#players[0].x] = this.#players[0].nbPlayer;
        this.#matrice[this.#players[1].y][this.#players[1].x] = this.#players[1].nbPlayer;
        // c'est ici que le jeu est lancé on utilise la fonction sendAllDirections toutes les 100ms avec this comme paramètre ( cette game )
        this.#gameInterval = setInterval(sendAllDirections, 500, this);
    };

    //cette fonction sera appelé indépendament de la gameLoop chaque fois que le serveur recevra un message d'un client en jeu
    modifySomeoneDirection(nbPlayer, direction) {
        this.#players[nbPlayer - 1].direction = direction;
    }

    sendEndOfGameMessage(numeroDuJoueurPerdant) {
        let message;
        if (numeroDuJoueurPerdant == 3) // 3 correspond à égalité
        {
            message = {
                type: "endGame",
                egalite: true
            }
        }
        else {
            message = {
                type: "endGame",
                egalite: false,
                gagnant: numeroDuJoueurPerdant == 1 ? 2 : 1,
                perdant: numeroDuJoueurPerdant
            }
        }
        this.players.forEach((player) => {
            player.connection.sendUTF(JSON.stringify(message));
        })

        clearInterval(this.#gameInterval);
        //enlever les connexions du tableau games
        this.removeConnectionsFromGames()

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

        this.players.forEach((p) => p.updatePosition()); //on update les x & y des joueurs
        let oneIsDead = false;
        let twoIsDead = false;
        if (this.xJ1 >= tailleMatrice || this.xJ1 < 0 || this.yJ1 >= tailleMatrice || this.yJ1 < 0
            || this.#matrice[this.yJ1][this.xJ1] != 0)
            oneIsDead = true;
        if (this.xJ2 >= tailleMatrice || this.xJ2 < 0 || this.yJ2 >= tailleMatrice || this.yJ2 < 0
            || this.#matrice[this.yJ2][this.xJ2] != 0)
            twoIsDead = true;

        if ((oneIsDead && twoIsDead) || (this.xJ1 == this.xJ2 && this.yJ1 == this.yJ2)) //égalité
            return 3;
        else if (oneIsDead)//J1 mort
            return 1;
        else if (twoIsDead)//J2 mort
            return 2;
        //personne n'est mort marquons la matrice
        this.#matrice[this.yJ1][this.xJ1] = 1;
        this.#matrice[this.yJ2][this.xJ2] = 2;
        return 0;

    }

    //getter et setter des x y pour j1 et j2 pour clarté du code
    get xJ1() {
        return this.#players[0].x;
    }

    get yJ1() {
        return this.#players[0].y;
    }

    get xJ2() {
        return this.#players[1].x;
    }

    get yJ2() {
        return this.#players[1].y;
    }


    get pseudos() {
        let pseudos = []
        this.players.forEach(p => {
            pseudos.push(p.connection.login);
        })
        return pseudos;
    }

    get directions(){
        let directions = []
        this.players.forEach(p => {
            directions.push(p.direction);
        })
        return directions;
    }


}

//La fonction Principale qu'on appelle depuis le loby
function lancerPartie(loby) {
    let myNewGame = new Game(loby[0], loby[1]);
    games.set(loby[0], myNewGame);
    games.set(loby[1], myNewGame);
    //on associe la première et la deuxième connexion au à cette partie dans le tableau games;
    myNewGame.notifyPlayers();
    loby = [];
    return loby;
    // on clear le loby certains pour être toujours apt à lancer d'autres parties

}

//La fonction appellé à chaque changement de direction
function findAndUpdateGame(connection, nbPlayer, direction) {

    games.get(connection).modifySomeoneDirection(nbPlayer, direction);
}

function sendDecount(game) {
    console.log(game.timer);
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

function sendAllDirections(game) {
    // c'est la fonction de callBack de la gameLoop
    let mort = game.UpdateAndcheckIfSomeoneDead();

    // mort = 0 si personne mort , sinon c'est le numéro du joueur perdant;
    if (mort != 0) {
        // récupérer les pseudos des joueurs 
        const player1 = game.players[0].connection.login;
        const player2 = game.players[1].connection.login;

        // Déterminer le pseudo du gagnant
        const winner = mort === 3 ? "egalite" : mort === 1 ? player2 : player1;
        //enregistrer dans la base de données
        try {
            saveGameResult(game.pseudos, winner);
            if (winner != "egalite") {
                ajouterVictoire(winner);
                ajouterDefaite(winner == player1 ? player2 : player1);
            }
        } catch (err) {
        }

        game.sendEndOfGameMessage(mort);
        return;
    }
    //personne n'est mort alors on envoit la direction à tous le monde et le jeu continue
    let message = {
        type: "direction",
        directions: game.directions
    }
    game.players.forEach((player) => {
        player.connection.sendUTF(JSON.stringify(message));
    })

}

module.exports = { lancerPartie, findAndUpdateGame };