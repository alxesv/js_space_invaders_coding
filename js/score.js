function saveScore(score, round) {
    scoreStorage.setItem(`${round}`, `${score}`);
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
