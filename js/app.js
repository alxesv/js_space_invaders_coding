function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
}

let htmlGrille;
let aliens = [];
const timeRate = 1000;

function initGame(){
    for(let i = 0; i < 400; i ++){
        let div = document.createElement('div');
        if (i % 20 === 0){
            div.setAttribute('data', 'left');
        }else if(i % 20 === 19){
            div.setAttribute('data', 'right');
        }
        document.querySelector('.grille').append(div);
    }
    htmlGrille = document.querySelectorAll('.grille div');
    for (i = 0; i < 60; i++){
        if(inRange(i, 4, 15) || inRange(i, 24, 35) || inRange(i, 44, 55)){
            aliens.push(i);
        }
    }
    htmlGrille[390].classList.add('tireur');
    updateGrid();
}


function updateGrid(){
    for (let alien of aliens){
        htmlGrille[alien].classList.add('alien');
    }
    for (let i = 0; i < htmlGrille.length; i++){
        if(!aliens.includes(i)){
            htmlGrille[i].classList.remove('alien');
        }
    }
}

function moveAliens(right, step){
    for (let i = 0; i < aliens.length; i++){
        if(right){
            aliens[i]+=step;
        }
        else{
            aliens[i]-=step;
        }
    }
}

function checkWin(){
    let result = document.querySelector('.result');
    let result_message = document.querySelector('.result_message');
    if(aliens.length === 0){
        result_message.innerHTML = 'You Win';
        result.style.display = 'block';
    }
}

async function gameLoop(){
    let alienDir = true;
    let border = false;
    let skipBorder = false;
    let gameOver = false;
    const timer = ms => new Promise(res => setTimeout(res, ms));
    while(!gameOver){
        for (let alien of aliens){
            if(htmlGrille[alien].getAttribute('data') == 'right'){
                alienDir = false;
                border = true;
            }else if (htmlGrille[alien].getAttribute('data') == 'left'){
                alienDir = true;
                border = true;
            }
        }
        if(border && !skipBorder){
            moveAliens(true, 20);
            skipBorder = true;
        }else{
            moveAliens(alienDir, 1);
            skipBorder = false;
            border = false;
        }        
        await timer(timeRate);
        updateGrid();
        checkWin();
    }
}

initGame();
gameLoop();