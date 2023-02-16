const skillTreeDiv = document.querySelector('.skill_tree');

const skillTree = {
    "bomb": {
        "name": "Bomb",
        "description": "Unlocks the bomb skill",
        "cost": 1,
        "preReq": [],
    },
    "addBomb": {
        "name": "Additonal bomb",
        "description": "Allows you to carry an additional bomb",
        "cost": 2,
        "preReq": ["bomb"],
    },
    "shield": {
        "name": "Shield",
        "description": "Unlocks the shield skill",
        "cost": 1,
        "preReq": [],
    },
    "addShield": {
        "name": "Additonal shield",
        "description": "Allows you to use the shield an additional time",
        "cost": 2,
        "preReq": ["shield"],
    },
    "timeFreeze": {
        "name": "Time freeze",
        "description": "Freezes time for a short period",
        "cost": 3,
        "preReq": [],
    },
    "improveTimeFreeze": {
        "name": "Improved Time freeze",
        "description": "Freezes time for a longer period",
        "cost": 5,
        "preReq": ["timeFreeze"],
    },
    "enhancedShot": {
        "name": "Enhanced shot",
        "description": "Reduces the cooldown of your shot",
        "cost": 3,
        "preReq": [],
    },
    "superShot": {
        "name": "Super shot",
        "description": "Your shot is now supercharged",
        "cost": 5,
        "preReq": ["enhancedShot"],
    },
}

function initiateSkillTree(points=0) {
    localStorage.setItem("unlockedSkills", JSON.stringify([]));
    localStorage.setItem("skillPoints", points);
}

function unlockSkill(skill){
    let skillCost = skillTree[skill].cost;
    if(skillPoints >= skillCost){
        unlockedSkills.push(skill);
        skillPoints -= skillCost;
        localStorage.setItem("unlockedSkills", JSON.stringify(unlockedSkills));
        localStorage.setItem("skillPoints", skillPoints);
        updateSkillPointsCounter();
        updateSkillTree();
    }
}

function skillTreeUI(){
    const skillPointsDiv = document.createElement('div');
    skillPointsDiv.classList.add('skill_points');
    skillPointsDiv.innerHTML = `
        <h3>Skill points: <span id="skill-points-counter">${skillPoints}<span></h3>
    `;
    skillTreeDiv.appendChild(skillPointsDiv);
    for(const skillId in skillTree){
        const skill = skillTree[skillId];
        const skillDiv = document.createElement('div');
        skillDiv.classList.add('skill');
        skillDiv.setAttribute('id', skillId);
        const preReqNames = [];
        for (const preReqId of skill.preReq) {
        const preReqSkill = skillTree[preReqId];
        if (preReqSkill) {
            preReqNames.push(preReqSkill.name);
        }
        }
        skillDiv.innerHTML = `
            <h3>${skill.name}</h3>
            <p>${skill.description}</p>
            <p>Cost: <strong>${skill.cost}</strong></p>
            ${preReqNames.length > 0 ? `<p><strong>Require: ${preReqNames.join(', ')}</p>` : '</strong>'}
        `;
        if(unlockedSkills.includes(skillId)){
            skillDiv.classList.add('unlocked');
            const unlockButton = document.createElement('button');
                unlockButton.innerHTML = 'Unlocked';
                skillDiv.appendChild(unlockButton);
        }else{
            const preReqMet = skill.preReq.every(skill => unlockedSkills.includes(skill));
            if(preReqMet){
                const unlockButton = document.createElement('button');
                unlockButton.innerHTML = 'Unlock';
                unlockButton.addEventListener('click', () => unlockSkill(skillId));
                skillDiv.appendChild(unlockButton);
            }else{
                skillDiv.classList.add('locked');
            }
        }
        if(skill.preReq.length !== 0){
            const line = document.createElement('div');
            line.classList.add('line');
            skillTreeDiv.appendChild(line);
        }
        skillTreeDiv.appendChild(skillDiv);
    }
}

function updateSkillPointsCounter() {
    skillPointsCounter.textContent = skillPoints;
}

function updateSkillTree(){
    while(skillTreeDiv.firstChild){
        skillTreeDiv.removeChild(skillTreeDiv.firstChild);
    }
    skillTreeUI();
}

function checkSkills(){
    if(unlockedSkills.includes('bomb')){
        bombs = 1;
        if(unlockedSkills.includes('addBomb')){
            bombs = 2;
        }
    }else{
        bombs = 0;
    }

    if(unlockedSkills.includes('shield')){
        shields = 1;
        if(unlockedSkills.includes('addShield')){
            shields = 2;
        }
    }else{
        shields = 0;
    }

    if(unlockedSkills.includes('timeFreeze')){
        timeFreeze = 1;
        timeFreezeDuration = 3000;
        if(unlockedSkills.includes('improveTimeFreeze')){
            timeFreezeDuration = 6000;
        }
    }else{
        timeFreeze = 0;
    }

    if(unlockedSkills.includes('enhancedShot')){
        cooldownRate = 500;
        if(unlockedSkills.includes('superShot')){
            superShot = true;
        }else{
            superShot = false;
        }
    }else{
        cooldownRate = 1000;
    }

}

function resetSkills(){
    let totalSkillPoints = 0;
    totalSkillPoints += skillPoints;
    console.log()
    for(const skillId in skillTree){
        const skill = skillTree[skillId];
        if(unlockedSkills.includes(skillId)){
            totalSkillPoints += skill.cost;
        }
    }
    unlockedSkills = [];
    initiateSkillTree(totalSkillPoints);
}
if(!localStorage.getItem("unlockedSkills")){
    initiateSkillTree();
}
let unlockedSkills = JSON.parse(localStorage.getItem("unlockedSkills"));
let skillPoints = parseInt(localStorage.getItem("skillPoints"));
skillTreeUI();
const skillPointsCounter = document.getElementById("skill-points-counter");