let htmlGrille;
let aliens = [];
// speed of the aliens (in ms), the lower the faster
let timeRate;
// cooldown between each shot (in ms), the lower the faster
const cooldownRate = 1000;
// initial position of the player
let vaisseau = 390;
let cooldown = false;
let enemyFire = false;
let dead = false;
let bombs;
// difficulty
let diff;
// game state
let gameOn = false;
let bombDisplay = document.querySelector('#bombs_left');
let shieldDisplay = document.querySelector('#shields_left');
// is the shield active
let shieldOn = false;
let shields;


function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
}

// Initialisation du jeu
function initGame(){
    for(let i = 0; i < 400; i ++){
        let div = document.createElement('div');
        if (i % 20 === 0) {
            div.setAttribute('data', 'left');
        } else if (i % 20 === 19) {
            div.setAttribute('data', 'right');
        }
        document.querySelector('.grille').append(div);
    }
    htmlGrille = document.querySelectorAll('.grille div');
    for (i = 0; i < 60; i++) {
        if (inRange(i, 4, 15) || inRange(i, 24, 35) || inRange(i, 44, 55)) {
            aliens.push(i);
        }
    }
    htmlGrille[vaisseau].classList.add('tireur');
    updateGrid();
}

// Mise à jour de la grille
function updateGrid() {
    if(dead){
        htmlGrille[vaisseau].classList.remove('tireur');
        htmlGrille[vaisseau].classList.add('boom');
        return;
    }
    for (let alien of aliens) {
        htmlGrille[alien].classList.remove('boom');
        htmlGrille[alien].classList.add('alien');
    }
    for (let i = 0; i < htmlGrille.length; i++) {
        if (!aliens.includes(i)) {
            htmlGrille[i].classList.remove('alien');
        }
        if (i === vaisseau) {
            if(!shieldOn){
            htmlGrille[vaisseau].classList.add('tireur');
        }else{
            htmlGrille[vaisseau].classList.add('shield');
        }
        } else {
            htmlGrille[i].classList.remove('shield');
            htmlGrille[i].classList.remove('tireur');
        }
    }
}

// Vérifie si la partie est terminée
function checkGameOver(){
    if(gameOn){
        const lastLine = Array.from({length: 20}, (_, k) => k + 380);
        let result = document.querySelector('.result');
        let result_message = document.querySelector('.result_message');
        if (aliens.length === 0) {
            result_message.innerHTML = 'You Win';
            result.style.display = 'block';
            return true;
        }else if (aliens.includes(vaisseau) || lastLine.some(num => aliens.includes(num)) || dead){
            result_message.innerHTML = 'You Lose';
            result.style.display = 'block';
            return true;
        }
    }
        return false;
}

// Déplacement des aliens et boucle de jeu
function gameLoop() {
    let alienDir = true;
    let border = false;
    let skipBorder = false;
    let gameInterval = setInterval(() => {
        for (let alien of aliens) {
            if (htmlGrille[alien].getAttribute('data') == 'right') {
                alienDir = false;
                border = true;
            } else if (htmlGrille[alien].getAttribute('data') == 'left') {
                alienDir = true;
                border = true;
            }
        }
        if (border && !skipBorder) {
            moveAliens(true, 20);
            skipBorder = true;
        } else {
            moveAliens(alienDir, 1);
            skipBorder = false;
            border = false;
        }
        if(enemyFire){
            enemyShoot();
        }
        if(checkGameOver()){
            clearInterval(gameInterval);
        }
        updateGrid();
    }, timeRate);
}

// Lance le jeu
function gameStart(difficulty){
    document.querySelector('.diff_choice').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    switch(difficulty){
        case 1:
            diff = 1;
            enemyFire = false;
            timeRate = 1000;
            bombs = 3;
            shields = 0;
            break;
        case 2:
            diff = 2;
            enemyFire = false;
            timeRate = 600;
            bombs = 2;
            shields = 0;
            break;
        case 3:
            diff = 3;
            enemyFire = true;
            timeRate = 600;
            bombs = 1;
            shields = 2;
            break;
        case 4:
            diff = 4;
            enemyFire = true;
            timeRate = 300;
            bombs = 0;
            shields = 1;
            break;
        default:
            return;
    }
    if(bombs > 0){
    bombDisplay.innerHTML = `(${bombs})`;
    }else{
        document.querySelector('#bomb_list').style.display = 'none';
    }
    if (shields > 0){
        shieldDisplay.innerHTML = `(${shields})`;
    }else{
        document.querySelector('#shield_list').style.display = 'none';
    }
    let i = 3;
    document.querySelector('#countdown').innerHTML = '';
    document.querySelector('#countdown').style.display = 'block';
    let startInterval = setInterval(() => {
        if(i === 0){
            initGame();
            gameLoop();
            gameOn = true;
            clearInterval(startInterval);
            document.querySelector('#countdown').style.display = 'none';
        }
        document.querySelector('#countdown').innerHTML = i;
        i--
    }, 1000);
}