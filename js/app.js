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
let stopInterval;
// game state
let gameOn = false;
let scoreStorage = localStorage;
let pointAlien = 100;
let score = 0;
function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
}
// Initialisation du jeu
function initGame() {
    document.querySelector('.score').style.display = 'block';
    for (let i = 0; i < 400; i++) {
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
    if (dead) {
        htmlGrille[vaisseau].classList.remove('tireur');
        htmlGrille[vaisseau].classList.add('boom');
        return;
    }
    for (let alien of aliens) {
        htmlGrille[alien].classList.add('alien');
    }
    for (let i = 0; i < htmlGrille.length; i++) {
        if (!aliens.includes(i)) {
            htmlGrille[i].classList.remove('alien');
        }
        if (i === vaisseau) {
            htmlGrille[vaisseau].classList.add('tireur');
        } else {
            htmlGrille[i].classList.remove('tireur');
        }
    }
}

// Vérifie si la partie est terminée
function checkGameOver() {
    if (gameOn) {
        const lastLine = Array.from({ length: 20 }, (_, k) => k + 380);
        let result = document.querySelector('.result');
        let result_message = document.querySelector('.result_message');
        if (aliens.length === 0) {
            result_message.innerHTML = 'You Win';
            result.style.display = 'block';
            return true;
        } else if (
            aliens.includes(vaisseau) ||
            lastLine.some((num) => aliens.includes(num)) ||
            dead
        ) {
            result_message.innerHTML = 'You Lose';
            result.style.display = 'block';
            return true;
        }
    }
    return false;
}

// Déplacement des aliens et boucle de jeu
async function gameLoop() {
    let alienDir = true;
    let border = false;
    let skipBorder = false;

    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    while (!checkGameOver()) {
        updateScore();
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
        if (enemyFire) {
            enemyShoot();
        }
        console.log(document.querySelector('.timer').textContent);

        await timer(timeRate);
        updateGrid();
    }
    clearInterval(stopInterval);

    if (aliens.length === 0) {
        console.log(score);
        score =
            (100000 / parseInt(document.querySelector('.timer').textContent)) *
            score;
        console.log(score);
    }
    checkScores(score);
}
function timerGame() {
    document.querySelector('.timer').style.display = 'block';
    let startTime = Date.now();
    const interval = setInterval(() => {
        let time = Date.now() - startTime;
        document.querySelector('.timer').innerHTML = (time / 1000).toFixed(2);
    }, 100);
    return { interval };
}
// Lance le jeu
function gameStart(difficulty) {
    document.querySelector('.diff_choice').style.display = 'none';
    document.querySelector('.game').style.display = 'block';

    switch (difficulty) {
        case 1:
            diff = 1;
            enemyFire = false;
            timeRate = 1000;
            bombs = 3;
            pointAlien = 100;
            break;
        case 2:
            diff = 2;
            enemyFire = false;
            timeRate = 600;
            bombs = 2;
            pointAlien = 150;
            break;
        case 3:
            diff = 3;
            enemyFire = true;
            timeRate = 600;
            bombs = 1;
            pointAlien = 200;
            break;
        case 4:
            diff = 4;
            enemyFire = true;
            timeRate = 300;
            bombs = 0;
            pointAlien = 300;
            break;
        default:
            return;
    }
    let i = 3;
    document.querySelector('#countdown').innerHTML = '';
    document.querySelector('#countdown').style.display = 'block';
    let startInterval = setInterval(() => {
        if (i === 0) {
            const { interval } = timerGame();
            stopInterval = interval;
            initGame();
            gameLoop();
            gameOn = true;
            clearInterval(startInterval);
            document.querySelector('#countdown').style.display = 'none';
        }
        document.querySelector('#countdown').innerHTML = i;
        i--;
    }, 1000);
}
