let htmlGrille;
let aliens = [];
// speed of the aliens (in ms), the lower the faster
let timeRate;
// cooldown between each shot (in ms), the lower the faster
const cooldownRate = 500;
// initial position of the player
let vaisseau = 390;
let cooldown = false;
let enemyFire = false;
let dead = false;

function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
}

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

function updateGrid() {
    if(dead){
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

function moveAliens(right, step) {
    for (let i = 0; i < aliens.length; i++) {
        if (right) {
            aliens[i] += step;
        } else {
            aliens[i] -= step;
        }
    }
}

function checkGameOver(){
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
    return false;
}
async function enemyShoot(){
    let randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
    let laser = randomAlien + 20;
    let laserInterval = setInterval(() => {
        if (laser === vaisseau) {
            htmlGrille[vaisseau].classList.remove('tireur');
            htmlGrille[vaisseau].classList.remove('enemy_laser');
            htmlGrille[vaisseau].classList.add('boom');
            clearInterval(laserInterval);
            dead = true;
            return;
        }
        if (laser >= 380 && laser < 400) {
            clearInterval(laserInterval)
            htmlGrille[laser].classList.remove('enemy_laser');
            return;
        }else if (laser > 400) {
            clearInterval(laserInterval)
            return;
        }
        htmlGrille[laser].classList.remove('enemy_laser');
        laser += 20;
        htmlGrille[laser].classList.add('enemy_laser');
        updateGrid();
    }, 100)
        
}
async function shoot(){
    if (!cooldown) {
        let laser = vaisseau-20;
        let laserInterval = setInterval(() => {
            if (laser < 20) {
                clearInterval(laserInterval)
                htmlGrille[laser].classList.remove('laser');
                return;
            }
            if (aliens.includes(laser)) {
                htmlGrille[laser].classList.remove('alien');
                htmlGrille[laser].classList.remove('laser');
                htmlGrille[laser].classList.add('boom');
                setInterval(() => {
                    htmlGrille[laser].classList.remove('boom');
                }, 200);
                aliens.splice(aliens.indexOf(laser), 1);
                clearInterval(laserInterval);
                return;
            }
            htmlGrille[laser].classList.remove('laser');
            laser -= 20;
            htmlGrille[laser].classList.add('laser');
            updateGrid();
        }, 100)
        cooldown = true;
    }else{
        return;
    }
    setTimeout(() => {
        cooldown = false;
    }, cooldownRate);
}
async function gameLoop() {
    let alienDir = true;
    let border = false;
    let skipBorder = false;
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    while (!checkGameOver()) {
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
        await timer(timeRate);
        updateGrid();
    }
}

function gameStart(difficulty){
    document.querySelector('.diff_choice').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    switch(difficulty){
        case 1:
            timeRate = 1000;
            break;
        case 2:
            timeRate = 600;
            break;
        case 3:
            enemyFire = true;
            timeRate = 600;
            break;
        case 4:
            enemyFire = true;
            timeRate = 300;
            break;
        default:
            return;
    }
    initGame();
    gameLoop();
}

document.querySelectorAll('.diff_choice button').forEach((button) => {
    button.addEventListener('click', () => {
        switch(button.id){
            case 'easy':
                gameStart(1);
                break;
            case 'normal':
                gameStart(2);
                break;
            case 'hard':
                gameStart(3);
                break;
            case 'veryhard':
                gameStart(4);
                break;
            default:
                return;
        }
    })
});

document.querySelector('#replay').addEventListener('click', () => {
    vaisseau = 390;
    aliens = [];
    dead = false;
    while (document.querySelector('.grille').firstChild) {
        document
            .querySelector('.grille')
            .removeChild(document.querySelector('.grille').lastChild);
    }
    let result = document.querySelector('.result');
    let result_message = document.querySelector('.result_message');
    result_message.innerHTML = '';
    result.style.display = 'none';
    initGame();
    gameLoop();
});

document.addEventListener('keydown', (e) => {
    if(checkGameOver()){
        return;
    }
    switch (e.key) {
        case ' ':
            //shoot
            e.preventDefault();
            shoot();
            break;
        case 'd':
        case 'ArrowRight':
            //rigth
            e.preventDefault();

            if (htmlGrille[vaisseau].getAttribute('data') !== 'right') {
                vaisseau += 1;
            }
            break;
        case 'q':
        case 'ArrowLeft':
            //left
            e.preventDefault();

            if (htmlGrille[vaisseau].getAttribute('data') !== 'left')
                vaisseau -= 1;
            break;
        case 'z':
        case 'ArrowUp':
            e.preventDefault();

            if (vaisseau > htmlGrille.length - 60) {
                vaisseau -= 20;
            }
            break;
        case 's':
        case 'ArrowDown':
            //up
            e.preventDefault();
            if (!inRange(vaisseau, 380, 399)) {
                vaisseau += 20;
            }
            break;
        default:
            break;
    }
    updateGrid();
});