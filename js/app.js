let htmlGrille;
let aliens = [];
// speed of the aliens (in ms), the lower the faster
const timeRate = 1000;
// cooldown between each shot (in ms), the lower the faster
const cooldownRate = 1000;
// initial position of the player
let vaisseau = 390;
let cooldown = false;
let bombs = 0;

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
    }else if (aliens.includes(vaisseau) || lastLine.some(num => aliens.includes(num))){
        result_message.innerHTML = 'You Lose';
        result.style.display = 'block';
        return true;
    }
    return false;
}
async function shoot(type=1){
    if (!cooldown) {
        if(type === 2 && bombs > 0){
            let bomb = vaisseau-20;
            let bombInterval = setInterval(() => {
                if (bomb < 20) {
                    clearInterval(bombInterval)
                    htmlGrille[bomb].classList.remove('bomb');
                    return;
                }
                if (aliens.includes(bomb)) {
                    // fix last alien being killed
                    htmlGrille[bomb].classList.remove('bomb');
                    htmlGrille[bomb].classList.add('boom');
                    htmlGrille[bomb+1].classList.add('boom');
                    htmlGrille[bomb-1].classList.add('boom');
                    htmlGrille[bomb+20].classList.add('boom');
                    htmlGrille[bomb-20].classList.add('boom');
                    setInterval(() => {
                        htmlGrille[bomb].classList.remove('boom');
                        htmlGrille[bomb+1].classList.remove('boom');
                        htmlGrille[bomb-1].classList.remove('boom');
                        htmlGrille[bomb+20].classList.remove('boom');
                        htmlGrille[bomb-20].classList.remove('boom');
                    }, 200);
                    aliens.splice(aliens.indexOf(bomb), 1);
                    if(aliens.includes(bomb+1)){
                    aliens.splice(aliens.indexOf(bomb+1), 1);
                    }
                    if(aliens.includes(bomb-1)){
                    aliens.splice(aliens.indexOf(bomb-1), 1);
                    }
                    if(aliens.includes(bomb+20)){
                    aliens.splice(aliens.indexOf(bomb+20), 1);
                    }
                    if(aliens.includes(bomb-20)){
                    aliens.splice(aliens.indexOf(bomb-20), 1);
                    }
                    clearInterval(bombInterval);
                    updateGrid();
                    return;
                }
                htmlGrille[bomb].classList.remove('bomb');
                bomb -= 20;
                htmlGrille[bomb].classList.add('bomb');
                updateGrid();
            }, 300);
            bombs--;
        }else if(type === 1){
            let laser = vaisseau-20;
            let laserInterval = setInterval(() => {
                if (laser < 20) {
                    clearInterval(laserInterval)
                    htmlGrille[laser].classList.remove('laser');
                    return;
                }
                if (aliens.includes(laser)) {
                    htmlGrille[laser].classList.remove('laser');
                    htmlGrille[laser].classList.add('boom');
                    setInterval(() => {
                        htmlGrille[laser].classList.remove('boom');
                    }, 200);
                    aliens.splice(aliens.indexOf(laser), 1);
                    clearInterval(laserInterval);
                    updateGrid();
                    return;
                }
                htmlGrille[laser].classList.remove('laser');
                laser -= 20;
                htmlGrille[laser].classList.add('laser');
                updateGrid();
            }, 100)
    }else{
        return;
    }
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
        await timer(timeRate);
        updateGrid();
    }
}

document.querySelector('.btn').addEventListener('click', () => {
    vaisseau = 390;
    aliens = [];
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
        case 'Control':
            //bomb
            e.preventDefault();
            shoot(2);
            break;
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


initGame();
gameLoop();