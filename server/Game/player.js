
class Player {
    #connection
    #numeroDuJoueur
    #direction
    #x
    #y
    // à l'avenir on mettra ici le pseudo du joueur en plus de la direction

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

    //la méthode est appelé sur chaque joueur d'une game pendant la gameLoop
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

    sendEndGameForMeMessage(resultat) {
        let message = {
            type: "endGameForMe",
            message: resultat
        }
        this.connection.sendUTF(JSON.stringify(message));
    }

}

module.exports = { Player };
