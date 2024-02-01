/*
    Nome: TETRIS
    Autor: Pedro Miranda (pLogicador)
    Data de Criação: 12/09/2023
    Descrição: 
        Desenvolvi uma Reinterpretação simples do Tetris. Esta reimaginação do clássico Tetris captura a essência da diversão intemporal, 
        desafio estratégico e gratificação instantânea que o Tetris sempre proporcionou, enquanto adiciona elementos únicos e 
        inovações modernas.

        OBS: Em fase de testes!!

*/


// Inicialização do jogo
let timeMoveDown = 500;
let timerId = null;
const $startStopButton = document.getElementById("start-button") ;

// Evento de clique no botão Play/Pause
$startStopButton.addEventListener("click", ()=>{
    pauseGame()
})

const $restartButton = document.getElementById("restart-button");

$restartButton.addEventListener("click", ()=>{
    window.location.reload();
})

// Função para pausar o jogo
function pauseGame() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        $startStopButton.textContent = "PLAY";
        currentMusic.pause();
        musicStarted = false;

        // Pausa a música de fundo, se estiver tocando
        if (musicStarted) {
            currentMusic.pause();
            musicStarted = false;
        }

        playPauseSound();
    } else {
        timerId = setInterval(moveDown, timeMoveDown);
        $startStopButton.textContent = "PAUSE";
        
        // Inicia a música de fundo, se ainda não tiver começado
        if (!musicStarted) {
            playBackgroundMusic();
        }
    }
}

/*Texto dos Créditos*/
function displayCredits() {  
    document.getElementById('content-credit').classList.remove('hide')    
    document.getElementById('credit-div').classList.add("credit");
}

// Verificar a vitória
function checkWinCondition() {
    if (score >= levels[levels.length-1].maxScore) {
        gameWin();
    }
}

// Função para lidar com a vitória do jogador
function gameWin() {
    if (!hasWon) {
        clearInterval(timerId);
        timerId = null;
        $startStopButton.disabled = true;

        // Limpa o grid imediatamente
        $gridSquares.forEach(square => {
            square.classList.remove("filled", "shapePainted");
        });

        // Define hasWon como true para evitar a reprodução repetida da música de vitória
        hasWon = true;

        playVictoryMusic();
        
        $score.innerHTML += "<br />" + "<br />" + "VICTORY!";
        hasWon = true; // Defina hasWon como true para evitar a reprodução repetida da música de vitória
    }

    // Chama a função de exibição de créditos
    displayCredits();
}

// Cria uma função para reproduzir a música de vitória
function playVictoryMusic() {
    // Pausa a música atual
    currentMusic.pause();

    const victoryAudio = new Audio("./src/assets/sounds/credits.mp3");
    victoryAudio.play();
}

// Função para lidar com o fim do jogo
function gameOver(){
    if (currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition].classList.contains("filled")
    )) {
        updateScore(-0); //13
        clearInterval(timerId);
        timerId = null;
        $startStopButton.disabled = true;

        // Pausa a música de fundo, se estiver tocando
        if (musicStarted) {
            currentMusic.pause();
            musicStarted = false;
        }

        gameOverAudio.play();
        $score.innerHTML += "<br />" + "GAMER OVER";
    };
}


// Variável global para rastrear o número de linhas consecutivas que o jogador limpou
let consecutiveLinesCleared = 0;

// Função para verificar se uma linha foi preenchida completamente
let $grid = document.querySelector(".grid");

function checkIfRowsFilled(){
    // verificando de 10 a 10 linhas
    for (row = 0; row < $gridSquares.length; row += gridWidth){
        let currentRow = [];

        for (var square = row; square < row + gridWidth; square++){
            currentRow.push(square);
        }

        const isRowPainted = currentRow.every( square=> 
            $gridSquares[square].classList.contains("shapePainted") 
        )

        if (isRowPainted) {
            const squareRemoved = $gridSquares.splice(row, gridWidth);
            squareRemoved.forEach(square => {
                square.classList.remove("shapePainted", "filled");
                square.removeAttribute("class");
            });
        
            $gridSquares = squareRemoved.concat($gridSquares);
            $gridSquares.forEach(square => $grid.appendChild(square));
        
            updateScore(20);

            // Verifica se o jogador limpou 3 linhas consecutivas
            consecutiveLinesCleared++;
            if (consecutiveLinesCleared === 4) {
                updateScore(50); // Concede 30 pontos extras por limpar 3 linhas consecutivas
                consecutiveLinesCleared = 0; // Reinicia o contador de linhas consecutivas
            }

            playCompleteLineAudio();
        }
    }
}

// variável para rastrear o número de linhas completadas
let linesCleared = 0;

// Função para atualizar o contador de linhas
function updateLinesCounter() {
    const $linesCount = document.getElementById('lines-count');
    $linesCount.textContent = linesCleared;
}

// Função para atualizar a pontuação e a dificuldade
const $score = document.querySelector(".score");
let score = 0;

function updateScore(updateValue){
    score += updateValue;
    $score.textContent = score;
    checkWinCondition();
    
    // Dificuldades conforme pontuação
    clearInterval(timerId)
    changeMusicAndDifficulty();

    timerId = setInterval(moveDown, timeMoveDown);
}

// Reduz o Número de Consultas ao DOM
const $linesCount = document.getElementById('lines-count');
const $level = document.getElementById('level');

// Nível atual
let currentLevel = 1; 


const levels = [
    {
        minScore: 350,
        maxScore: 1150,
        music: musicB,
        timeMoveDown: 390
    },
    {
        minScore: 1150,
        maxScore: 2000,
        music: musicC,
        timeMoveDown: 350
    },
    {
        minScore: 2000,
        maxScore: 3200,
        music: musicD,
        timeMoveDown: 290
    },
    {
        minScore: 3200,
        maxScore: 4300,
        music: musicE,
        timeMoveDown: 230
    },
    {
        minScore: 4300,
        maxScore: 5800,
        music: musicF,
        timeMoveDown: 200
    },
    {
        minScore: 5800,
        maxScore: 7000,
        music: musicG,
        timeMoveDown: 190
    },
    {
        minScore: 7000,
        maxScore: 8000,
        music: musicH,
        timeMoveDown: 180
    },
    {
        minScore: 8000,
        maxScore: 90000,
        music: musicI,
        timeMoveDown: 170
    },
    {
        minScore: 90000,
        maxScore: 11000,
        music: musicJ,
        timeMoveDown: 155
    }
]

// Função para alterar a música de fundo e a dificuldade do jogo
function changeMusicAndDifficulty() {
    let newLevel = currentLevel; // Mantém o nível atual
    let nextLevel = levels[newLevel-1]

    if (!nextLevel || !timerId) return
    
    if (score >= nextLevel.minScore) {
        timeMoveDown = nextLevel.timeMoveDown;
        changeMusic(nextLevel.music);
        applyTheme(newLevel)
        newLevel++;
    }

    if (newLevel > currentLevel) {
        // Atualiza o nível apenas se for maior que o nível atual
        currentLevel = newLevel;
        
        // Atualiza o elemento do nível
        const $level = document.getElementById('level');
        $level.textContent = currentLevel;
    }

    currentMusic.loop = true; // Define a música atual para tocar infinitamente
}


function applyTheme(themeNumber) {
    if (themeNumber == levels.length - 1) {
        applySnowTheme();
        return;
    }

    // Remove todas as classes de tema do elemento .grid, .mini-grid e .content-right
    const grid = document.querySelector('.grid');
    const miniGrid = document.querySelector('.mini-grid');
    const contentRight = document.querySelector('.content-right');
    
    grid.classList.remove(
        'theme-1-grid', 'theme-2-grid', 'theme-3-grid', 'theme-4-grid', 'theme-5-grid'
    );
    
    miniGrid.classList.remove(
        'theme-1-mini-grid', 'theme-2-mini-grid', 'theme-3-mini-grid', 'theme-4-mini-grid', 'theme-5-mini-grid'
    );

    contentRight.classList.remove(
        'theme-1-content-right', 'theme-2-content-right', 'theme-3-content-right', 'theme-4-content-right', 'theme-5-content-right'
    );

    // Aplica a classe de tema com base no número do tema
    grid.classList.add(`theme-${themeNumber}-grid`);
    miniGrid.classList.add(`theme-${themeNumber}-mini-grid`);
    contentRight.classList.add(`theme-${themeNumber}-content-right`);
}

function applyRainTheme() {
    const grid = document.querySelector('.grid');
    grid.classList.add('theme-rain');

    // Ajusta a cor do score para o tema de chuva
    const scoreElement = document.querySelector('.score');
    scoreElement.style.color = 'red';

    const miniGrid = document.querySelector('.mini-grid');
    miniGrid.classList.add('theme-rain-mini-grid');

    const contentRight = document.querySelector('.content-right');
    contentRight.classList.add('theme-rain-content-right');
}

function applySnowTheme() {
    const grid = document.querySelector('.grid');
    grid.classList.add('theme-snow');

    // Ajusta a cor do score para o tema da neve
    const scoreElement = document.querySelector('.score');
    scoreElement.style.color = 'blue';

    const miniGrid = document.querySelector('.mini-grid');
    miniGrid.classList.add('theme-snow-mini-grid');

    const contentRight = document.querySelector('.content-right');
    contentRight.classList.add('theme-snow-content-right');
}