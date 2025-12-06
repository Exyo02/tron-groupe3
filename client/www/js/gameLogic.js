// Aide loadGame.js à gérer la logique d'une partie en cours

export class Player {
    #nbPlayer;
    #x;
    #y;
    #direction;
    constructor(nbPlayer, x, y, direction) {
        //initier la position de départ et la couleur et la direction de départ
        this.#nbPlayer = nbPlayer;
        this.#x = x;
        this.#y = y;
        this.#direction = direction;
    }

    set direction(direction) {
        this.#direction = direction;
    }

    setNextPosition() {
        //débug pour voir la position avant le déplacement
        // console.log ( this.#x + ':' + this.#y);
        if (this.#direction == "mort")
            return;
        switch (this.#direction) {
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

    get direction() {
        return this.#direction;
    }
    get nbPlayer() {
        return this.#nbPlayer;
    }

    get x() {
        return this.#x;
    }
    get y() {
        return this.#y
    }

}

export class Game {
    #players;
    #pseudos;
    
    constructor(fourPlayers) {
        this.#players = [];
        this.#players.push(new Player(1, 9, 25, 'droite'));
        this.#players.push(new Player(2, 40, 26, 'gauche'));
        if ( fourPlayers){
            this.#players.push(new Player(3, 25, 9, 'bas'));
            this.#players.push(new Player(4, 26, 40, 'haut'));
        }
    }

    //directions en tableau
    update(directions) {
        for (let i = 0 ; i < this.#players.length  ; i++){
            this.#players[i].direction = directions[i];
            this.#players[i].setNextPosition();
        }
    }

    set pseudos(adversaires) {
        this.#pseudos = adversaires;
    }

    get pseudos(){
        return this.#pseudos;
    }

    getPlayerDirection(numeroDuJoueur) {
        return this.#players[numeroDuJoueur - 1].direction;
    }

    get players(){
        return this.#players;
    }

    get j1() {
        return this.#players[0];
    }
    get j2() {
        return this.#players[1];
    }

    get j3(){
        return this.#players[2];
    }
    get j4() {
        return this.#players[3];
    }

}

