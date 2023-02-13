class Alien {
    position;
    direction;
    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
    }
}
class Vaisseau {
    position;
    constructor(position) {
        this.position = position;
    }
}

function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
}
let grille = document.querySelector('.grille');
let gameGrille = [];
for(let i = 0; i < 400; i ++){
    let div = document.createElement('div');
    gameGrille.push(div);
}
grille.append(...gameGrille);

function initGame(){
    for(let [index, div] of gameGrille.entries()){
        if (inRange(index, 4, 15) || inRange(index, 24, 35) || inRange(index, 44, 55)){
            div.classList.add('alien');
            gameGrille[index] = new Alien(index, 'right');
        }
    }
    let shipStart = gameGrille.length-10;
    gameGrille[shipStart].classList.add('tireur');
    gameGrille[shipStart] = new Vaisseau(shipStart);

};
initGame();
console.log(gameGrille);
