// Déplacement des aliens
function moveAliens(right, step) {
    for (let i = 0; i < aliens.length; i++) {
        if (right) {
            aliens[i] += step;
        } else {
            aliens[i] -= step;
        }
    }
}

// Tir des aliens et mort du vaisseau
async function enemyShoot() {
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
            clearInterval(laserInterval);
            htmlGrille[laser].classList.remove('enemy_laser');
            return;
        } else if (laser > 400) {
            clearInterval(laserInterval);
            return;
        }
        htmlGrille[laser].classList.remove('enemy_laser');
        laser += 20;
        htmlGrille[laser].classList.add('enemy_laser');
        updateGrid();
    }, 100);
}

// Tir du vaisseau et mort des aliens
async function shoot(type = 1) {
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
        } else if (type === 1) {
            let laser = vaisseau - 20;
            let laserInterval = setInterval(() => {
                if (laser < 20) {
                    clearInterval(laserInterval);
                    htmlGrille[laser].classList.remove('laser');
                    return;
                }
                if (aliens.includes(laser)) {
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
