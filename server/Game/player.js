//Cette classe permet de gérer les joueurs lors d'une Game

class Player {
    #connection
    #numeroDuJoueur
    #direction
    #x
    #y

    //Le constructeur appelé par Game quand on crée J1, J2 etc.
    constructor(connection, numeroDuJoueur, direction, x, y) {
        this.#connection = connection;
        this.#numeroDuJoueur = numeroDuJoueur;
        this.#direction = direction;
        this.#x = x;
        this.#y = y;
    }

    set direction(direction) {
        this.#direction = direction
    }
    get direction() {
        return this.#direction;
    }

    get connection() {
        return this.#connection;
    }
    get numeroDuJoueur() {
        return this.#numeroDuJoueur;
    }

    get x() {
        return this.#x
    }

    get y() {
        return this.#y;
    }

    set x(x) {
        this.#x = x;
    }
    set y(y) {
        this.#y = y;
    }

    //la méthode est appelée sur chaque joueur d'une game pendant la gameLoop
    updatePosition() {
        switch (this.#direction) {
            case "mort":
                break;
            case "haut":
                this.#y -= 1;
                break;
            case "bas":
                this.#y += 1;
                break;
            case "gauche":
                this.#x -= 1;
                break;
            case "droite":
                this.#x += 1;
                break;
        }
    }

    //Envoyer au joueur correspondant sont résultat 
    sendEndGameForMeMessage(resultat) {
        let message = {
            type: "endGameForMe",
            message: resultat
        }
        this.connection.sendUTF(JSON.stringify(message));
    }

}

module.exports = { Player };
