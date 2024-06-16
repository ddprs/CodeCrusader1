const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    race: 'human',
    class: 'warrior',
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    color: 'blue',
    health: 100,
    speed: 5,
    attack: 10,
    defense: 5,
    talents: [],
};

const enemies = [
    { x: 100, y: 100, width: 50, height: 50, color: 'red', health: 50, speed: 2 },
    { x: 700, y: 100, width: 50, height: 50, color: 'red', health: 50, speed: 2 },
];

const talentTrees = {
    warrior: [
        { name: 'Sword Mastery', description: 'Increase sword damage by 10%', selected: false },
        { name: 'Shield Block', description: 'Increase block chance by 5%', selected: false },
    ],
    mage: [
        { name: 'Fireball', description: 'Increase fireball damage by 15%', selected: false },
        { name: 'Ice Shield', description: 'Reduce damage taken by 10%', selected: false },
    ],
    rogue: [
        { name: 'Backstab', description: 'Increase backstab damage by 20%', selected: false },
        { name: 'Evasion', description: 'Increase dodge chance by 10%', selected: false },
    ]
};

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('characterCreationScreen').classList.remove('hidden');
    } else {
        alert('Please enter both username and password.');
    }
}

function createCharacter() {
    player.race = document.getElementById('race').value;
    player.class = document.getElementById('class').value;
    document.getElementById('characterCreationScreen').classList.add('hidden');
    document.getElementById('talentTreeScreen').classList.remove('hidden');
    generateTalentTree(player.class);
}

function generateTalentTree(className) {
    const talentTree = document.getElementById('talentTree');
    talentTree.innerHTML = '';
    talentTrees[className].forEach((talent, index) => {
        const talentElement = document.createElement('div');
        talentElement.className = 'talent';
        talentElement.innerHTML = `<h4>${talent.name}</h4><p>${talent.description}</p>`;
        talentElement.onclick = () => selectTalent(className, index);
        talentTree.appendChild(talentElement);
    });
}

function selectTalent(className, index) {
    const talent = talentTrees[className][index];
    talent.selected = !talent.selected;
    generateTalentTree(className);
    if (talent.selected) {
        player.talents.push(talent.name);
    } else {
        player.talents = player.talents.filter(t => t !== talent.name);
    }
}

function startGame() {
    document.getElementById('talentTreeScreen').classList.add('hidden');
    gameLoop();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    requestAnimationFrame(gameLoop);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            player.y -= player.speed;
            break;
        case 'ArrowDown':
            player.y += player.speed;
            break;
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
        case ' ':
            attack();
            break;
    }
});

function attack() {
    enemies.forEach((enemy, index) => {
        if (isColliding(player, enemy)) {
            enemy.health -= player.attack;
            if (enemy.health <= 0) {
                enemies.splice(index, 1);
            }
        }
    });
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}
