// Déplacement des aliens
function moveAliens(right, step) {
    if (!timeFreezeOn) {
        for (let i = 0; i < aliens.length; i++) {
            if (right) {
                aliens[i] += step;
            } else {
                aliens[i] -= step;
            }
        }
    } else {
        return;
    }
}

// Fonction freeze time
function activateFreezeTime() {
    if (!timeFreezeOn && timeFreeze > 0) {
        if (audioEffect && songOn) {
            audioTheme.pause();
            audioFreeze.play();
        }
        if (audioEffect) {
            audioFreeze.play();
        }

        timeFreezeOn = true;
        timeFreeze--;
        freezeDisplay.innerHTML = `(${timeFreeze})`;
        setTimeout(() => {
            timeFreezeOn = false;
            song = true;
        }, timeFreezeDuration);
    }
}

// Fonction bouclier
function activateShield() {
    if (!shieldOn && shields > 0) {
        htmlGrille[vaisseau].classList.add('shield');
        shieldOn = true;
        shields--;
        shieldDisplay.innerHTML = `(${shields})`;
        setTimeout(() => {
            htmlGrille[vaisseau].classList.remove('shield');
            shieldOn = false;
        }, 5000);
    } else {
        return;
    }
}
// Tir des aliens et mort du vaisseau
function enemyShoot() {
    if (!timeFreezeOn) {
        let randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
        let laser = randomAlien + 20;
        if (audioEffect) {
            audioLaserAlien.play();
        }
        let laserInterval = setInterval(() => {
            if (laser === vaisseau && shieldOn) {
                htmlGrille[vaisseau].classList.remove('shield');
                htmlGrille[vaisseau].classList.remove('enemy_laser');
                shieldOn = false;
                clearInterval(laserInterval);
                return;
            }
            if (laser === vaisseau && !shieldOn) {
                htmlGrille[vaisseau].classList.remove('tireur');
                htmlGrille[vaisseau].classList.remove('enemy_laser');
                htmlGrille[vaisseau].classList.add('boom');
                if (audioEffect) {
                    audioBomb.play();
                }
                clearInterval(laserInterval);
                dead = true;
                return;
            }
            if (laser >= 380 && laser < 400) {
                clearInterval(laserInterval);
                htmlGrille[laser].classList.remove('enemy_laser');
                return;
            } else if (laser > 400) {
                clearInterval(laserInterval);
                return;
            }
            if (htmlGrille[laser]) {
                htmlGrille[laser].classList.remove('enemy_laser');
                laser += 20;
                htmlGrille[laser].classList.add('enemy_laser');
            }
            updateGrid();
        }, 100);
    } else {
        return;
    }
}

// Tir du vaisseau et mort des aliens

function shoot(type = 1) {
    if (!cooldown) {
        if (type === 2 && bombs > 0) {
            let bomb = vaisseau - 20;
            let bombInterval = setInterval(() => {
                const cell = htmlGrille[bomb];
                const positionsToRemove = [
                    bomb,
                    bomb + 1,
                    bomb - 1,
                    bomb + 20,
                    bomb - 20,
                ];
                if (bomb < 20) {
                    clearInterval(bombInterval);
                    cell.classList.remove('bomb');
                    return;
                }
                if (aliens.includes(bomb)) {
                    if (audioEffect) {
                        audioBomb.play();
                    }

                    cell.classList.remove('bomb');
                    cell.classList.add('boom');
                    for (let i = 0; i < positionsToRemove.length; i++) {
                        const pos = positionsToRemove[i];
                        htmlGrille[pos].classList.add('boom');
                        const index = aliens.indexOf(pos);
                        if (index !== -1 && aliens.includes(pos)) {
                            aliens.splice(index, 1);
                            score += pointAlien;
                        }
                    }
                    setTimeout(() => {
                        for (let i = 0; i < positionsToRemove.length; i++) {
                            htmlGrille[positionsToRemove[i]].classList.remove(
                                'boom'
                            );
                        }
                    }, 250);
                    clearInterval(bombInterval);
                    updateGrid();
                    return;
                }
                cell.classList.remove('bomb');
                bomb -= 20;
                htmlGrille[bomb].classList.add('bomb');
                updateGrid();
            }, 300);
            bombs--;

            bombDisplay.innerHTML = `(${bombs})`;
        } else if (type === 1) {
            let laser = vaisseau - 20;
            if (audioEffect) {
                audioLaser.play();
            }

            let laserInterval = setInterval(() => {
                if (laser < 20) {
                    clearInterval(laserInterval);
                    htmlGrille[laser].classList.remove('laser');
                    return;
                }
                if (superShot) {
                    if (aliens.includes(laser)) {
                        score += pointAlien;
                        htmlGrille[laser].classList.add('boom');
                        setTimeout(() => {
                            for (let i = 0; i < htmlGrille.length; i++) {
                                if (
                                    htmlGrille[i].classList.contains('boom') &&
                                    !aliens.includes(i)
                                ) {
                                    htmlGrille[i].classList.remove('boom');
                                }
                            }
                        }, 300);
                        aliens.splice(aliens.indexOf(laser), 1);
                        updateGrid();
                        return;
                    }
                } else {
                    if (aliens.includes(laser)) {
                        if (audioEffect) {
                            audioDes.play();
                        }
                        score += pointAlien;
                        htmlGrille[laser].classList.remove('laser');
                        htmlGrille[laser].classList.add('boom');
                        setTimeout(() => {
                            htmlGrille[laser].classList.remove('boom');
                        }, 200);
                        aliens.splice(aliens.indexOf(laser), 1);
                        clearInterval(laserInterval);
                        updateGrid();
                        return;
                    }
                }
                htmlGrille[laser].classList.remove('laser');
                laser -= 20;
                htmlGrille[laser].classList.add('laser');
                updateGrid();
            }, 100);
        } else {
            return;
        }
        cooldown = true;
    } else {
        return;
    }
    setTimeout(() => {
        cooldown = false;
    }, cooldownRate);
}


function infernoBombTarget(){
    let target;
    let random = Math.floor(Math.random() * ((htmlGrille.length-20) - (htmlGrille.length-60)) + (htmlGrille.length-60));
    if(random % 20 === 19){
        target = random - 1;
    }else if(random % 20 === 0){
        target = random + 1;
    }else{
        target = random;
    }
    return target;
}
// Bombe du niveau 3
function infernoBomb(){
    let chance = Math.floor(Math.random() * 100);
    if(inRange(chance, 41, 45)){
        let infernoBomb = infernoBombTarget();
        const areaBomb = [
            infernoBomb,
            infernoBomb + 1,
            infernoBomb - 1,
            infernoBomb + 20,
            infernoBomb - 20,
            infernoBomb + 21,
            infernoBomb - 21,
            infernoBomb + 19,
            infernoBomb - 19,
        ];
        for (let i = 0; i < areaBomb.length; i++) {
            const pos = areaBomb[i];
            if(htmlGrille[pos]){
                htmlGrille[pos].classList.add('preInfernoBomb');
            }
        }
        setTimeout(() => {
            for (let i = 0; i < areaBomb.length; i++) {
                const pos = areaBomb[i];
                if(htmlGrille[pos]){
                    htmlGrille[pos].classList.remove('preInfernoBomb');
                    htmlGrille[pos].classList.add('infernoBomb');
                if(htmlGrille[pos].classList.contains('tireur')){
                    if(shieldOn){
                        shieldOn = false;
                        htmlGrille[pos].classList.remove('.shield');
                        htmlGrille[pos].classList.remove('.infernoBomb');
                        return;
                    }else{
                        dead = true;
                        htmlGrille[pos].classList.remove('tireur');
                        for(let preBomb of areaBomb){
                            if(htmlGrille[preBomb] && htmlGrille[preBomb].classList.contains('preInfernoBomb')){
                            htmlGrille[preBomb].classList.remove('preInfernoBomb');
                            }
                        }
                        return;
                    }
                }
                setTimeout(() => {
                        htmlGrille[pos].classList.remove('infernoBomb'); 
                }, 500);
            }
        }
        }, 1500);
    }
}