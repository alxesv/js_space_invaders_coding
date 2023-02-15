function save_score(score, round) {
    scoreStorage.setItem(`${round}`, `${score}`);
}
