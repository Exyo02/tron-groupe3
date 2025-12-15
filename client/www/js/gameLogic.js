//Ces classes permettent d'aider loadGame.js à gérer le rendu du CSS/HTML en fonction des infos de la partie reçue par le serveur
// Elles ne gèrent donc pas la logique algorithmique du jeu à proprement parler mais permettent de suivre les infos de la partie et des joueurs : position, direction, pseudos etc.

export class Player {
    #nbPlayer;
    #x;
    #y;
    #direction;
    constructor(nbPlayer, x, y, direction) {
        //initier la position de départ, la couleur et la direction de départ
        this.#nbPlayer = nbPlayer;
        this.#x = x;
        this.#y = y;
        this.#direction = direction;
    }

    set direction(direction) {
        this.#direction = direction;
    }

    setNextPosition() {
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
    
    //Les 5 getters suivants permettent l'update des classes CSS
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
    
    //les positions de départ doivent être les mêmes que celles du serveur
    constructor(fourPlayers) {
        this.#players = [];
        this.#players.push(new Player(1, 5, 25, 'droite'));
        this.#players.push(new Player(2, 46, 26, 'gauche'));
        if ( fourPlayers){
            this.#players.push(new Player(3, 25, 5, 'bas'));
            this.#players.push(new Player(4, 26, 46, 'haut'));
        }
    }

    //directions est un tableau reçu du serveur, dans l'odre des joueurs
    update(directions) {
        for (let i = 0 ; i < this.#players.length  ; i++){
            this.#players[i].direction = directions[i];
            this.#players[i].setNextPosition();
        }
    }

    //Le serveur nous passe le pseudo des adversaires au début de la game
    set pseudos(adversaires) {
        this.#pseudos = adversaires;
    }

    get pseudos(){
        return this.#pseudos;
    }

    //Cela sert pour avoir notre propre direction afin d'éviter de se suicider 
    getPlayerDirection(numeroDuJoueur) {
        return this.#players[numeroDuJoueur - 1].direction;
    }

    get players(){
        return this.#players;
    }

}

