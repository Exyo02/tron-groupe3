const { Player } = require('./player.js');
const saveGameResult = require('../mongoose/gameResult.js');
const { ajouterVictoire, ajouterDefaite, ajouterEgalite } = require('../mongoose/user.js');


//La fonction qu'on appelle depuis le loby pour lancer une partie quand un loby est complet
function lancerPartie(loby, fourPlayers) {
    let myNewGame = new Game(loby[0], loby[1]);
    games.set(loby[0], myNewGame);
    games.set(loby[1], myNewGame);

    //fourPlayers est un booléen dépend de si appelé par loby2p ou 4p
    if (fourPlayers) {
        myNewGame.addOtherPlayers(loby[2], loby[3]);
        games.set(loby[2], myNewGame);
        games.set(loby[3], myNewGame);
    }
    //Le numéro du joueur dans la game J1, J2, J3 ou j4 dépendra donc de quand il est arrivé dans le loby

    //Voir la fonction notifyPlayers de la classe game
    myNewGame.notifyPlayers();

    loby = [];
    return loby;
    // on clear le loby 

}

//Map des parties en cours pour être retrouvé lorsqu'on reçoit un message de changement direction
// (prend une connection et nous renvoit la partie correspondante)
var games = new Map();

//Taile de la matrice
var tailleMatrice = 50;


// Classe Game
class Game {
    #players = [];
    //un tableau d'objet Player
    #vivants = [];
    //les players vivant

    #decountInterval
    //La variable pour gérer l'interval du décompte de début de partie.

    #timer = 3;
    //Le décompte de début de partie commence à 3. ( 3, 2 , 1...)

    #gameInterval;
    //La variable pour gérer l'interval de la game

    #matrice
    //la matrice du jeu en cours ( sert pour savoir si des joueurs sont morts)

    //Le constructeur d'une game
    constructor(connection1, connection2) {
        this.#players.push(new Player(connection1, 1, 'droite', 5, 25));
        //j1 
        this.#players.push(new Player(connection2, 2, 'gauche', 46, 26));
        //j2 
        this.#matrice = []
        //On initie la matrice
        for (let i = 0; i < tailleMatrice; i++) {
            this.#matrice[i] = []
            for (let j = 0; j < tailleMatrice; j++) {
                this.#matrice[i][j] = 0;
            }
        }

    };

    //une méthode qui vient compléter le constructeur si 4 joueurs
    addOtherPlayers(connection3, connection4) {
        this.#players.push(new Player(connection3, 3, 'bas', 25, 5));
        //j3
        this.#players.push(new Player(connection4, 4, 'haut', 26, 46));
        //j4
    }

    notifyPlayers() {
        //on notifie les joueurs que la partie va commencer
        this.players.forEach((player) => {
            let joinGameMessage = {
                type: "joinGame",
                nbPlayer: player.numeroDuJoueur,
                adversaires: this.pseudos
                //On leur envoit leur numéro de joueur ( 1,2,3 ou 4) et le tableau des pseudos des joueurs
            }
            player.connection.sendUTF(JSON.stringify(joinGameMessage));

            this.#vivants.push(player);
            //on met chaque joueur dans le tableau des vivants pour le début de partie
        })

        // on lance le décomptes
        this.decount();
    }

    decount() {
        //On créer un l'interval de décompte
        this.#decountInterval = setInterval(sendDecount, 1000, this);
    }

    //Le décompte est finit la partie commence
    startGame() {
        //On clear l'intervalle de  décompte
        clearInterval(this.#decountInterval);

        //On marque la position de départ dans la matrice de chaque joueur
        this.#players.forEach(p => {
            this.#matrice[p.y][p.x] = p.nbPlayer;
        })

        // c'est ici que le jeu est lancé on utilise la fonction sendAllDirections toutes les 50ms avec this comme paramètre ( cette game )
        this.#gameInterval = setInterval(sendAllDirections, 50, this);
    };

    //cette fonction sera appelé indépendamment du game interval chaque fois que le serveur recevra un message d'un client en jeu
    modifySomeoneDirection(nbPlayer, direction) {
        this.#players[nbPlayer - 1].direction = direction;
    }


    //Cette fonction est appelléd à la fin de la partie
    closeGame(gagnant) {

        //On clear l'interval
        clearInterval(this.#gameInterval);

        //On stock dans mongo
        saveGameResult(this.pseudos, gagnant);

        //On construit et envoit le message final à display aux clients
        let gagnants = gagnant.length > 1 ? "Egalites : " : "Gagnant : "
        gagnant.forEach(g => {
            gagnants += g.connection.login + " ";
        });

        this.players.forEach(p => {
            p.connection.sendUTF(JSON.stringify({
                type: "endGame",
                gagnants: gagnants
            }))
        });

        // On retire les connections de la map games
        this.removeConnectionsFromGames();
    }

    get players() {
        return this.#players
    }

    set timer(t) {
        this.#timer = t;
    }

    get timer() {
        return this.#timer;
    }


    //permet de retirer la game et les connexions de la map games
    removeConnectionsFromGames() {
        this.players.forEach(p => {
            games.delete(p.connection);
        })
    }



    // appeller à chaque game interval
    UpdateAndcheckIfSomeoneDead() {
        let mortsCeTour = [];
        let coordonnees = [];


        //On regarde s'ils se sont pris un mur après avoir update la position
        this.#vivants.forEach((p) => {
            p.updatePosition();
            if (p.x >= tailleMatrice || p.x < 0 || p.y >= tailleMatrice || p.y < 0
                || this.#matrice[p.y][p.x] != 0) {
                p.direction = "mort";
                mortsCeTour.push(p);
            }
            else {
                this.#matrice[p.y][p.x] = p.numeroDuJoueur;
            }
            if (coordonnees.length == 0) {
                // c'est le j1
                coordonnees.push({ x: p.x, y: p.y, players: [p] });
            }
            else {
                let coordonneeDejaPasse = coordonnees.filter((c) => { return c.x == p.x && c.y == p.y });
                if (coordonneeDejaPasse.length > 0) {
                    //il y a déjà un joueur sur cette cordonnee alors on ajoute le joueur sur celle ci
                    coordonneeDejaPasse[0].players.push(p);
                }
                else {
                    //nouvelle cordonnée non visite ce tour
                    coordonnees.push({ x: p.x, y: p.y, players: [p] });
                }
            }

    });


        //Cas très particulier si la tête est au même endroit (c'est uniquement à ça que sert la variable coordonnees)
        coordonnees.forEach(c => {
            if (c.players.length >= 2) {
                c.players.forEach(p => {
                    if (!mortsCeTour.includes(p)) {
                        p.direction = "mort";
                        mortsCeTour.push(p);
                    }
                })
                this.markCase(c);
            }
        });

        //on enlève les morts des vivants
        this.#vivants = this.#vivants.filter(p => !mortsCeTour.includes(p));
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

    //async car pas urgent pendant un interval en soit
    async markCase(c) {
        //cas spécial ou les joueurs meurt au même endroit pour bien dire aux clients de colorier la case d'une couleur spécial;
        let message = {
            type: "markCase",
            x: c.x,
            y: c.y
        };
        this.#players.forEach((p) => {
            p.connection.sendUTF(JSON.stringify(message));
        })
    }

} /// ------------ ----------------- Fin de la classe Game




//La fonction appelée à chaque changement de direction
function findAndUpdateGame(connection, nbPlayer, direction) {
    //on retrouve la game dans la map
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

    //On récupére le tableau des mortsCeTour
    let mortsCeTour = game.UpdateAndcheckIfSomeoneDead();

    //On regarde le nombre total de morts
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

    //Sinon
    //La partie continue on marque les joueurs perdants s'il y a des morts
    if (mortsCeTour > 0) {
        mortsCeTour.forEach(player => {
            ajouterDefaite(player.connection.login);
            player.sendEndOfGameMessage("perdu")
        });
    }

    //On envoit les directions des joueurs à tous le monde
    let message = {
        type: "direction",
        directions: game.directions
    }
    game.players.forEach((player) => {
        player.connection.sendUTF(JSON.stringify(message));
    });
}

module.exports = { lancerPartie, findAndUpdateGame };