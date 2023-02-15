function saveScore(score, highScores) {
    const newScore = { score };
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(10);
    scoreStorage.setItem('scores', JSON.stringify(highScores));
}
function checkScores(score) {
    const highScores = JSON.parse(scoreStorage.getItem('scores')) ?? [];
    const lowestScore = highScores[highScores.length - 1]?.score ?? 0;
    if (highScores.length === 10) {
        if (score > lowestScore) {
            saveScore(score, highScores);
        }
    } else {
        saveScore(score, highScores);
    }
}
function updateScore() {
    let title = document.createElement('h3');
    let text = document.createTextNode(`Score : ${score}`);
    title.appendChild(text);
    document.querySelector('.score').appendChild(title);
    document
        .querySelector('.score')
        .replaceChild(title, document.querySelector('.score').firstChild);
}

function showAllScores() {
    let round = 1;
    const highScores = JSON.parse(scoreStorage.getItem('scores')) ?? [];
    const tr = document.querySelectorAll('#highscores table tbody tr');
    for (let i = 0; i < tr.length; i++) {
        console.log(tr[i]);
        console.log(document.querySelector('#highscores table tbody'));
        document.querySelector('#highscores table tbody').removeChild(tr[i]);
    }
    console.log(tr);

    highScores.forEach((score) => {
        console.log(score);
        let ligne = document.createElement('tr');
        let cell1 = document.createElement('td');
        let cell2 = document.createElement('td');
        let text1 = document.createTextNode(`${round}`);
        let text2 = document.createTextNode(`${score.score}`);
        cell1.append(text1);
        cell2.append(text2);
        ligne.append(cell1, cell2);
        console.log(tr);

        document.querySelector('#highscores table tbody').append(ligne);
        round += 1;
    });
    // }
}
