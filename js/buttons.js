// Boutons de difficulté
document.querySelectorAll('.diff_choice button').forEach((button) => {
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
    const highScores = JSON.parse(scoreStorage.getItem('scores')) ?? [];

    showAllScores();
    document.querySelector('#highscores #tab-score').style.display =
        highScores === 0 ? 'none' : 'table';
    document.querySelector('#highscores').style.display =
        document.querySelector('#highscores').style.display === 'none'
            ? 'block'
            : 'none';
});
// Bouton replay
document.querySelector('#replay').addEventListener('click', () => {
    score = 0;
    gameOn = false;
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
    document.querySelector('.diff_choice').style.display = 'flex';
    document.querySelector('.game').style.display = 'none';
    document.querySelector('.score').style.display = 'none';
    document.querySelector('#highscores').style.display = 'none';
    document.querySelector('.timer').style.display = 'none';
    document.querySelector('#showSkillTree').style.display = 'block';
    document.querySelector('#hardreset').style.display = 'block';
    document.querySelector('#resetSkills').style.display = 'block';
    showAllScores();
    updateSkillPointsCounter();
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
    if(skillTreeDiv.style.display === 'none'){
        skillTreeDiv.style.display = 'flex';
    }else{
        skillTreeDiv.style.display = 'none';
    }
});

document.querySelector('#resetSkills').addEventListener('click', () => {
    resetSkills();
    location.reload();
});
