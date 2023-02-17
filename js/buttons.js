const highScoresDiv = document.querySelector('#highscores');
const paramsDiv = document.querySelector('#params');
const allParamsDiv = document.querySelectorAll('#params div ');
// button parameter
document.querySelector('#paramsBtn').addEventListener('click', () => {
    let i = 0;
    if (paramsDiv.style.display === 'none') {
        paramsDiv.style.display = 'flex';
        highScoresDiv.style.display = 'none';
        skillTreeDiv.style.display = 'none';
    } else {
        paramsDiv.style.display = 'none';
    }
    document.querySelector('.diff_choice div').style.display =
        paramsDiv.style.display === 'none' ? 'inline-block' : 'none';
});
// button on et off dans l'onglet parameters
allParamsDiv.forEach((paramsbtnDiv) => {
    const paramsbtn = paramsbtnDiv.lastChild.previousSibling;
    paramsbtn.addEventListener('click', () => {
        if (paramsbtn.textContent === 'On') {
            paramsbtn.innerHTML = 'Off';
            paramsbtn.style.backgroundColor = '#cb3c2f';
            if (paramsbtn.id === 'music') {
                audioTheme.pause();
                songOn = false;
            }
            if (paramsbtn.id === 'sound-effect') {
                audioEffect = false;
            }
        } else if (paramsbtn.textContent === 'Off') {
            paramsbtn.innerHTML = 'On';
            paramsbtn.style.backgroundColor = '#4caf50';
            if (paramsbtn.id === 'music') {
                audioTheme.play();
                songOn = true;
            }
            if (paramsbtn.id === 'sound-effect') {
                audioEffect = true;
            }
        }
    });
});
// Boutons de difficulté
document.querySelectorAll('.diff_choice div button').forEach((button) => {
    button.addEventListener('click', () => {
        switch (button.id) {
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
    });
});
document.querySelector('#btnScores').addEventListener('click', () => {
    paramsDiv.style.display = 'none';
    skillTreeDiv.style.display = 'none';
    const highScores = JSON.parse(scoreStorage.getItem('scores')) ?? [];
    highScoresDiv.style.display =
        highScoresDiv.style.display === 'none' ? 'block' : 'none';
    document.querySelector('.diff_choice div').style.display =
        highScoresDiv.style.display === 'none' ? 'inline-block' : 'none';
    showAllScores();
    document.querySelector('#highscores #tab-score').style.display =
        highScores.length === 0 ? 'none' : 'table';
});
document.querySelector('#play').addEventListener('click', () => {
    if (songOn) {
        audioTheme.play();
    }
    document.querySelector('#title').style.display = 'none';
    document.querySelector('.diff_choice').style.display = 'flex';
    document.querySelector('#resetSkills').style.display = 'inline-block';
    document.querySelector('#showSkillTree').style.display = 'inline-block';
    document.querySelector('#btnScores').style.display = 'inline-block';
    document.querySelector('#paramsBtn').style.display = 'inline-block';

    document.querySelector('#hardreset').style.display = 'inline-block';
});

function replayBtn() {
    score = 0;
    gameOn = false;
    vaisseau = 390;
    aliens = [];
    dead = false;
    if (songOn) {
        audioBomb.pause();
        audioLaser.pause();
        audioLaserAlien.pause();
        audioVictory.pause();
        audioTheme.play();
    }

    song = false;
    while (document.querySelector('.grille').firstChild) {
        document
            .querySelector('.grille')
            .removeChild(document.querySelector('.grille').lastChild);
    }
    let result = document.querySelector('.result');
    let result_message = document.querySelector('.result_message');
    result_message.innerHTML = '';
    result.style.display = 'none';
    document.querySelector('#replay').style.display = 'none';
    document.querySelector('#continue').style.display = 'none';
    document.querySelector('.diff_choice').style.display = 'flex';
    document.querySelector('.game').style.display = 'none';
    document.querySelector('.score').style.display = 'none';
    highScoresDiv.style.display = 'none';
    document.querySelector('.timer').style.display = 'none';
    document.querySelector('#showSkillTree').style.display = 'block';
    document.querySelector('#hardreset').style.display = 'block';
    document.querySelector('#resetSkills').style.display = 'block';
    document.querySelector('#btnScores').style.display = 'inline-block';
    document.querySelector('#paramsBtn').style.display = 'inline-block';
    updateSkillPointsCounter();
}
// Bouton replay
document.querySelector('#replay').addEventListener('click', () => {
    replayBtn();
    showAllScores();
});
document.querySelector('#giveUp').addEventListener('click', () => {
    location.reload();
});
// Controles
document.addEventListener('keydown', (e) => {
    if (checkGameOver() || !gameOn) {
        return;
    }
    switch (e.key) {
        case 'f':
            //freeze time
            e.preventDefault();
            activateFreezeTime();
            break;
        case 'b':
            //bouclier
            e.preventDefault();
            activateShield();
            break;
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

document.querySelector('#hardreset').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

document.querySelector('#showSkillTree').addEventListener('click', () => {
    if (skillTreeDiv.style.display === 'none') {
        paramsDiv.style.display = 'none';
        highScoresDiv.style.display = 'none';
        skillTreeDiv.style.display = 'flex';
    } else {
        skillTreeDiv.style.display = 'none';
    }
    document.querySelector('.diff_choice div').style.display =
        skillTreeDiv.style.display === 'none' ? 'inline-block' : 'none';
});

document.querySelector('#resetSkills').addEventListener('click', () => {
    resetSkills();
    skillPoints = parseInt(localStorage.getItem('skillPoints'));
    updateSkillTree();
});

// Bouton continuer
document.querySelector('#continue').addEventListener('click', () => {
    replayBtn();
    switch (currentLevel) {
        case 1:
            gameStart(diff, 2);
            break;
        case 2:
            gameStart(diff, 3);
            break;
    }
});
