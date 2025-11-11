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

    set direction(direction){
        this.#direction = direction;
    }

    setNextPosition(){
        console.log ( this.#x + ':' + this.#y);
        switch(this.#direction){
            case "haut":
                this.#y -=1;
                break;
            case "bas":
                this.#y +=1;
                break;
            case "gauche":
                this.#x -=1;
                break;
            case "droite" :
                this.#x +=1;
                break;
        }
    
    }

    get direction(){
        return this.#direction;
    }
    get nbPlayer(){
        return this.#nbPlayer;
    }

    get x(){
        return this.#x;
    }
    get y(){
        return this.#y
    }

}

export class Game {
    #player;

    constructor() {
        this.#player = [];
        this.#player.push(new Player(1, 20, 20, 'haut'));
        this.#player.push(new Player(2, 5, 5, 'bas'));
    }

    update(directionPlayer1, directionPlayer2){
        this.#player[0].direction = directionPlayer1;
        this.#player[1].direction = directionPlayer2;
        this.#player[0].setNextPosition();
        this.#player[1].setNextPosition();
    }

    getPlayerDirection(numeroDuJoueur){
        return this.#player[numeroDuJoueur-1].direction;
    }

    get j1(){
        return this.#player[0];
    }
    get j2() {
        return this.#player[1];
    }
  
}
