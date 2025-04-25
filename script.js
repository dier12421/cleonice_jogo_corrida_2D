const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

// Variáveis principais
let car = { x: canvas.width / 2 - 20, y: canvas.height - 100, width: 40, height: 70 };
let obstacles = [];
let speed = 3; // Velocidade inicial dos blocos
let score = 0;
let gameRunning = true;
let invulnerable = true; // Escudo de invulnerabilidade nos primeiros 5 segundos

// Cria obstáculos
function spawnObstacles() {
    for (let i = 0; i < 5; i++) {
        obstacles.push({
            x: Math.random() * (canvas.width - 50),
            y: Math.random() * -canvas.height,
            width: 40,
            height: 70,
            color: "blue",
            speed: speed, // Define velocidade inicial
        });
    }
}

// Desenha o carro
function drawCar() {
    ctx.fillStyle = "red";
    ctx.fillRect(car.x, car.y, car.width, car.height);
}

// Desenha os obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Atualiza os obstáculos
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacle.speed; // Move os blocos com base na velocidade
        if (obstacle.y > canvas.height) {
            obstacle.y = Math.random() * -canvas.height;
            obstacle.x = Math.random() * (canvas.width - 50);
        }
    });
}

// Atualiza a pontuação
function updateScore() {
    score++;
    scoreDisplay.textContent = `Pontuação: ${score}`;
}

// Verifica colisão
function checkCollision() {
    if (invulnerable) return; // Ignora colisões enquanto invulnerável

    obstacles.forEach(obstacle => {
        if (
            car.x < obstacle.x + obstacle.width &&
            car.x + car.width > obstacle.x &&
            car.y < obstacle.y + obstacle.height &&
            car.y + car.height > obstacle.y
        ) {
            handleGameOver();
        }
    });
}

// Trata o fim do jogo
function handleGameOver() {
    gameRunning = false;
    alert(`Você perdeu! Sua pontuação foi: ${score}`);
    resetGame();
}

// Reinicia o jogo
function resetGame() {
    car = { x: canvas.width / 2 - 20, y: canvas.height - 100, width: 40, height: 70 };
    obstacles = [];
    speed = 3; // Reinicia velocidade inicial dos blocos
    score = 0;
    gameRunning = true;
    invulnerable = true; // Ativa o escudo novamente
    scoreDisplay.textContent = "Pontuação: 0";
    spawnObstacles();
    setTimeout(() => invulnerable = false, 5000); // Escudo dura 5 segundos
    gameLoop();
}

// Incrementa dificuldade a cada 10 segundos
function increaseDifficulty() {
    speed++; // Aumenta a velocidade dos blocos
    obstacles.push({
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * -canvas.height,
        width: 40,
        height: 70,
        color: "blue",
        speed: speed, // Define velocidade inicial dos novos blocos
    });
}

// Loop principal do jogo
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCar();
    drawObstacles();
    updateObstacles();
    checkCollision();

    requestAnimationFrame(gameLoop);
}

// Controle do carro
window.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && car.x > 0) car.x -= 10;
    if (e.key === "ArrowRight" && car.x < canvas.width - car.width) car.x += 10;
});

setInterval(() => {
    if (gameRunning) {
        score += 10000; // Simulando uma alta taxa de pontos
        scoreDisplay.textContent = `Pontuação: ${score}`;
    }
}, 1); // Intervalo de 1 milissegundo


// Incrementa dificuldade a cada 10 segundos
setInterval(() => {
    if (gameRunning) increaseDifficulty();
}, 10000); // A cada 10 segundos

// Inicializa o jogo
spawnObstacles();
setTimeout(() => invulnerable = false, 5000); // Escudo de invulnerabilidade por 5 segundos
gameLoop();
