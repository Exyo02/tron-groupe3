export class GameBoard {
    #matrice;

    constructor() {
        this.#matrice = [];
        for (let i = 0; i < 30; i++) {
            this.#matrice[i] = [];
            for (let j = 0; j < 30; j++) {
                this.#matrice[i][j] = 0;
            }
        }
    }

    rendreCaseCommeJoue(player) {
        this.#matrice[player.y][player.x] = player.nbPlayer;
    }

    hasPlayerLost(player) {
        if (player.x >= 30 || player.x < 0 || player.y >= 30 || player.y < 0) return true;
        if (this.#matrice[player.y][player.x] !== 0) return true;
        return false;
    }

    get matrice() {
        return this.#matrice;
    }

    printMatrice() {
        for (let i = 0; i < 30; i++) console.log(this.#matrice[i]);
    }
}


export class Player {
    #nbPlayer;
    #x;
    #y;
    #direction;

    constructor(nbPlayer, x, y, direction) {
        this.#nbPlayer = nbPlayer;
        this.#x = x;
        this.#y = y;
        this.#direction = direction;
    }

    get direction() {
        return this.#direction;
    }

    set direction(val) {
        this.#direction = val;
    }

    set x(val) {
        this.#x = val;
    }

    set y(val) {
        this.#y = val;
    }

    setNextPosition() {
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

    get nbPlayer() {
        return this.#nbPlayer;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }
}

export class Game {
    #player;
    #gameboard;

    constructor(playerNumber, startX, startY, startDirection) {
        this.#gameboard = new GameBoard(); // obligatoire !
        this.#player = new Player(playerNumber, startX, startY, startDirection);
    }

    get player() { return this.#player; }
    get gameboard() { return this.#gameboard; }
}

