// Boutons de difficulté
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

// Bouton replay
document.querySelector('#replay').addEventListener('click', () => {
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
});

// Controles
document.addEventListener('keydown', (e) => {
    if(checkGameOver() || !gameOn){
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