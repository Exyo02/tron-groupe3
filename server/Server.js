// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(9898);
const wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function (message) {

        let messageObject = JSON.parse(message.utf8Data);

        switch (messageObject.type) {
            case "login":
                verifierLogin();
                //a faire plus tard pas urgent
                break;
            case "enterLoby":
                ajouterClientAuLobby(connection);
                break;
            case "changeDirection":
                findAndUpdateGame(messageObject);
                break;
            default:
                console.log("message inconnu");
        }
        console.log('Received Message:', message.utf8Data);
    });
    connection.on('close', function (reasonCode, description) {
        console.log('Client has disconnected.');
        let indexInLoby = loby.indexOf(connection);
        console.log(indexInLoby);
        if ( indexInLoby != -1){
            // on retire le client du loby s'il y était
            loby.splice(indexInLoby, 1);
        }
        console.log ("longueur du loby : "+loby.length);
    });
});

//tableau de joueur en attente , dès qu'il atteint deux crée la partie et vide
var loby = [];

var games = [];
//un tableau clé valeur qui prend une connection et nous renvoit la partie correspondante

function ajouterClientAuLobby(connection) {
    loby.push(connection);
    // Pour L'instant partie de deux joueurs pour faciliter le débeuguage
    if (loby.length == 2)
        lancerPartie();
    else{
        let message = {
            type:"waitForPlayers"
        };
        connection.sendUTF(JSON.stringify(message));
    }
}

function lancerPartie() {

    let myNewGame = new Game(loby[0], loby[1]);
    games[loby[0]] = myNewGame;
    //on associe la première et la deuxième connexion au à cette partie dans le tableau games;
    games[loby [1]] = myNewGame;
    myNewGame.startGame();
    loby = []
    // on clear le loby certains pour être toujours apt à lancer d'autres parties

}










// Classe Game

class Game {
    #players = [];
    //un tableau d'objet Player
    #gameInterval;
    //la variable de la gameLoop

    constructor(connection1, connection2) {
       this.#players.push( new Player(connection1, 1, 'haut'));
       //j1 commencera vers le haut
       this.#players.push( new Player(connection2, 2, 'bas' ));
        //j2 commencera vers le bas
    };

    startGame() {
        //on envoit à chacune des connexions associées à un jour un message pour démarrer la partie il contient aussi le numéro du joueur (1 ou 2)
        this.#players.forEach((player) => {
            let startGameMessage = {
                type: "startGame",
                numeroDuJoueur: player.numeroDuJoueur,
                //pour savoir si on est J1 ou J2 ce qui définira l'emplacement
            }
            player.connection.sendUTF(JSON.stringify(startGameMessage));
        })

        // c'est ici que le jeu est lancé on utilise la fonction sendAllDirections toutes les 100ms avec this comme paramètre ( cette game )
        this.#gameInterval = setInterval(sendAllDirections, 100, this);
    };

    //cette fonction sera appelé indépendament de la gameLoop chaque fois que le serveur recevra un message d'un client en jeu
    modifySomeoneDirection(nbPlayer, direction)
    {   
        if ( direction == "mort"){
            clearInterval(this.#gameInterval);
            sendEndOfGameMessage();
        }

        this.#players[nbPlayer-1].direction = direction;

    }


    sendEndOfGameMessage(numeroDuJoueurPerdant){

        let message  = {
            type:"endGame",
            gagnant: numeroDuJoueurPerdant == 1 ? 2 : 1,
            perdant: numeroDuJoueurPerdant
        }
        this.#players.forEach((player) => {
            player.connection.sendUTF(JSON.stringify(message));
        })

        //enlever les connexions du tableau games
        removeConnectionsFromGames()

    }

    get players () {
        return this.#players
    }
    removeConnectionsFromGames(){
        let index1 = this.#players[0].connection;
        games.splice(index1, 1);
        let index2 = this.#players[1].connection;
        games.splice(index2, 1);

    }

}

//Class Player

class Player {
    #connection
    #numeroDuJoueur
    #direction
    // à l'avenir on mettra ici le pseudo du joueur en plus de la direction

    constructor(connection, numeroDuJoueur, direction){
        this.#connection = connection;
        this.#numeroDuJoueur = numeroDuJoueur;
        this.#direction  = direction;
    }

    set direction(direction){
        this.#direction = direction
    }
    get direction(){
        return this.#direction;
    }

    get connection(){
        return this.#connection;
    }
    get numeroDuJoueur(){
        return this.#numeroDuJoueur;
    }
}


function findAndUpdateGame(connection, nbPlayer, direction){
//on modifie la direction de nbPlayer (J1 ou J2)
  games[connection].modifySomeoneDirection(nbPlayer, direction);
}

//ne peut pas être dans la classe game car appelle à this impossible
function sendAllDirections(game){
    // c'est la fonction de callBack de la gameLoop
    console.log(this);
    let message = {
        type: "direction",
        joueur1: game.players[0].direction,
        joueur2: game.players[1].direction,
    }
    game.players.forEach((player) => {
        player.connection.sendUTF(JSON.stringify(message));
    })
}