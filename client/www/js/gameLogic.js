//Ces classes permettent d'aider loadGame.js à gérer le rendu du CSS/HTML en fonction des infos de la partie reçu par le serveur
// Elles ne gèrent donc pas la logique algorithmique du jeu à proprement parler mais permettent de suivre les infos de la partie et des joueurs, position, direction, pseudos etc.

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
    
    //Les 5 getters suivants sont pour permettre l'update des classes CSS
    get x() {
        return this.#x;
    }
    get y() {
        return this.#y
    }

    get actualCaseId(){
        return `${ this.x }:${ this.y }`;
    }

    get headClassName(){
        return  `j${this.nbPlayer}`;
    }

    get wallClassName(){
        return `murj${this.nbPlayer}`;
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

    //directions est un tabeleau reçu du serveur, dans l'odre des joueurs de j1 à j2/j4
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

    //Cela sert pour avoir notre propre direction afin d'éviter de s'autosuicider 
    getPlayerDirection(numeroDuJoueur) {
        return this.#players[numeroDuJoueur - 1].direction;
    }

    get players(){
        return this.#players;
    }

}

