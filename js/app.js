let htmlGrille;
let aliens = [];
let __DIR__ =
    window.location.pathname.match('(.*/).*')[1] + 'ressources/audio/';
let audioVictory = new Audio(__DIR__ + 'Dance.mp3');
let audioTheme = new Audio(__DIR__ + 'Game_Over.mp3');
let audioBomb = new Audio(__DIR__ + 'boom.mp3');
let audioLaser = new Audio(__DIR__ + 'laser.mp3');
let audioLaserAlien = new Audio(__DIR__ + 'laserAlien.mp3');
let audioDes = new Audio(__DIR__ + 'desintegration.mp3');
let audioFreeze = new Audio(__DIR__ + 'theWorld.mp3');

// speed of the aliens (in ms), the lower the faster
let timeRate;
// cooldown between each shot (in ms), the lower the faster
let cooldownRate;
// initial position of the player
let vaisseau = 390;
let cooldown = false;
let enemyFire = false;
let dead = false;
let bombs;
// difficulty
let diff;
let stopInterval;
let currentLevel;
// game state
let gameOn = false;
let scoreStorage = localStorage;
let pointAlien = 10;
let score = 0;
let bombDisplay = document.querySelector('#bombs_left');
let shieldDisplay = document.querySelector('#shields_left');
let freezeDisplay = document.querySelector('#freeze_left');
// is the shield active
let shieldOn = false;
let shields;
let timeFreeze;
let timeFreezeOn = false;
let timeFreezeDuration;
let superShot;
let songOn = true;
let audioEffect = true;
let song = false;
function inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
}
// Initialisation du jeu
function initGame(level = 1) {
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
    switch (level) {
        case 1:
            for (i = 0; i < 60; i++) {
                if (
                    inRange(i, 4, 15) ||
                    inRange(i, 24, 35) ||
                    inRange(i, 44, 55)
                ) {
                    aliens.push(i);
                }
            }
            break;
        case 2:
            for (i = 0; i < 160; i++) {
                if (
                    inRange(i, 2, 17) ||
                    inRange(i, 23, 36) ||
                    inRange(i, 44, 55) ||
                    inRange(i, 65, 74) ||
                    inRange(i, 86, 93) ||
                    inRange(i, 107, 112) ||
                    inRange(i, 128, 131) ||
                    inRange(i, 149, 150)
                ) {
                    aliens.push(i);
                }
            }
            break;
        case 3:
            for (i = 0; i < 120; i++) {
                if (
                    i % 2 !== 0 &&
                    !(inRange(i, 40, 59) || inRange(i, 100, 119))
                ) {
                    aliens.push(i);
                }
            }
            break;
    }
    htmlGrille[vaisseau].classList.add('tireur');
    updateGrid();
    currentLevel = level;
}

// Mise ?? jour de la grille
function updateGrid() {
    if (dead) {
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
            htmlGrille[vaisseau].classList.remove('infernoBomb');
            if (!shieldOn) {
                htmlGrille[vaisseau].classList.add('tireur');
            } else {
                htmlGrille[vaisseau].classList.add('shield');
            }
        } else {
            htmlGrille[i].classList.remove('shield');
            htmlGrille[i].classList.remove('tireur');
        }
    }
}

// V??rifie si la partie est termin??e
function checkGameOver() {
    if (gameOn) {
        const lastLine = Array.from({ length: 20 }, (_, k) => k + 380);
        let result = document.querySelector('.result');
        let result_message = document.querySelector('.result_message');
        if (aliens.length === 0) {
            result_message.innerHTML = 'You Win';
            result.style.display = 'block';
            if (currentLevel < 3) {
                setTimeout(() => {
                    document.querySelector('#continue').style.display =
                        'inline-block';
                }, 1000);
            }
            setTimeout(() => {
                document.querySelector('#replay').style.display =
                    'inline-block';
            }, 1000);
            skillPoints += diff - 1 + (currentLevel - 1);
            localStorage.setItem('skillPoints', skillPoints);
            updateSkillPointsCounter();
            gameOn = false;
            return true;
        } else if (
            aliens.includes(vaisseau) ||
            lastLine.some((num) => aliens.includes(num)) ||
            dead
        ) {
            result_message.innerHTML = 'You Lose';
            result.style.display = 'block';
            setTimeout(() => {
                document.querySelector('#replay').style.display =
                    'inline-block';
            }, 1000);
            gameOn = false;
            return true;
        }
    }
    return false;
}

// D??placement des aliens et boucle de jeu
function gameLoop() {
    let alienDir = true;
    let border = false;
    let skipBorder = false;
    let gameInterval = setInterval(() => {
        if (songOn && song) {
            audioTheme.play();
        }
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
        if (currentLevel === 3) {
            infernoBomb();
        }
        if (checkGameOver()) {
            document.querySelector('#giveUp').style.display = 'none';

            clearInterval(gameInterval);
            clearInterval(stopInterval);
            if (aliens.length === 0) {
                if (songOn) {
                    audioTheme.pause();
                    audioVictory.play();
                }

                score = Math.round(
                    (1000 /
                        parseFloat(
                            document.querySelector('.timer').textContent
                        )) *
                        score
                );
            }
            checkScores(score);
        }
        updateGrid();
        updateScore();
    }, timeRate);
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
function gameStart(difficulty, level = 1) {
    document.querySelector('.diff_choice').style.display = 'none';
    document.querySelector('#showSkillTree').style.display = 'none';
    document.querySelector('#hardreset').style.display = 'none';
    document.querySelector('#resetSkills').style.display = 'none';
    document.querySelector('#btnScores').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    document.querySelector('#params').style.display = 'none';
    document.querySelector('#paramsBtn').style.display = 'none';
    document.querySelector('#giveUp').style.display = 'inline-block';
    skillTreeDiv.style.display = 'none';
    switch (difficulty) {
        case 1:
            diff = 1;
            enemyFire = false;
            timeRate = 1000;
            pointAlien = 10;
            break;
        case 2:
            diff = 2;
            enemyFire = false;
            timeRate = 600;
            pointAlien = 15;
            break;
        case 3:
            diff = 3;
            enemyFire = true;
            timeRate = 600;
            pointAlien = 20;
            break;
        case 4:
            diff = 4;
            enemyFire = true;
            timeRate = 300;
            pointAlien = 30;
            break;
        default:
            return;
    }
    checkSkills();
    if (timeFreeze > 0) {
        document.querySelector('#freeze_list').style.display = 'block';
        freezeDisplay.innerHTML = `(${timeFreeze})`;
    } else {
        document.querySelector('#freeze_list').style.display = 'none';
    }
    if (bombs > 0) {
        document.querySelector('#bomb_list').style.display = 'block';
        bombDisplay.innerHTML = `(${bombs})`;
    } else {
        document.querySelector('#bomb_list').style.display = 'none';
    }
    if (shields > 0) {
        document.querySelector('#shield_list').style.display = 'block';
        shieldDisplay.innerHTML = `(${shields})`;
    } else {
        document.querySelector('#shield_list').style.display = 'none';
    }
    let i = 3;
    document.querySelector('#countdown').innerHTML = '';
    document.querySelector('#countdown').style.display = 'block';
    let startInterval = setInterval(() => {
        if (i === 0) {
            const { interval } = timerGame();
            stopInterval = interval;
            initGame(level);
            gameLoop();
            gameOn = true;
            clearInterval(startInterval);
            document.querySelector('#countdown').style.display = 'none';
        }
        document.querySelector('#countdown').innerHTML = i;
        i--;
    }, 1000);
    if (currentLevel === 3) {
        currentLevel = 1;
    }
}
