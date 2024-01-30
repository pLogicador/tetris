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

// Configurações do jogo
let hasWon = false;
const gridWidth = 10; // Tamanho total de colunas
let currentMusicIndex = 0; // Índice da música atual
const musicA = new Audio("./src/assets/sounds/music/TetrisTheme8BitUniverse.mp3");
const musicB = new Audio("./src/assets/sounds/music/Happy8BitUniverse.mp3");
const musicC = new Audio("./src/assets/sounds/music/BillieJean8BitUniverse.mp3");
const musicD = new Audio("./src/assets/sounds/music/Stayin'Alive8BitUniverse.mp3");
const musicE = new Audio("./src/assets/sounds/music/ShakItOff8BitUniverse.mp3");
const musicF = new Audio("./src/assets/sounds/music/TakeOnMe8BitUniverse.mp3");
const musicG = new Audio("./src/assets/sounds/music/Immortals8BitUniverse.mp3");
const musicH = new Audio("./src/assets/sounds/music/Believer8BitUniverse.mp3");
const musicI = new Audio("./src/assets/sounds/music/WelcomeToTheBlackParade8BitUniverse.mp3");
const musicJ = new Audio("./src/assets/sounds/music/HotelCalifornia8BitUniverse.mp3");
const completLineAudio = new Audio("./src/assets/sounds/line-clear.wav");
const gameOverAudio = new Audio("./src/assets/sounds/gameOver.wav");
const freezeAudio = new Audio("./src/assets/sounds/colision.wav");
const moveSound = new Audio("./src/assets/sounds/move-piece.mp3");
const rotateSound = new Audio("./src/assets/sounds/rotate-piece.mp3");

// Funções para ajustar os sons
function playRotateSound() {
    rotateSound.playbackRate = 3.50;
    rotateSound.play();
}

function playMoveSound() {
    moveSound.playbackRate = 1.03;
    moveSound.play();
}

// Controles de áudio
const muteButton = document.getElementById("mute-button");
const audioIcon = document.getElementById("audio-icon");
let isMuted = false;

muteButton.addEventListener("click", () => {
    isMuted = !isMuted; // Inverte o estado de mutado

    if (isMuted) {
        unmuteAudio();
    } else {
        muteAudio();
    }
});

function muteAudio() {
    audioIcon.classList.remove("audio-on");
    audioIcon.classList.add("audio-off");

    // Define volume de todas as músicas para 0
    setMusicVolume(0);
}

function unmuteAudio() {
    audioIcon.classList.remove("audio-off");
    audioIcon.classList.add("audio-on");

    // Restaura o volume original das músicas
    setMusicVolume(1.0);
}

function setMusicVolume(volume) {
    musicA.volume = volume;
    musicB.volume = volume;
    musicC.volume = volume;
    musicD.volume = volume;
    musicE.volume = volume;
    musicF.volume = volume;
    musicG.volume = volume;
    musicH.volume = volume;
    musicI.volume = volume;
    musicJ.volume = volume;
    
}

function setSoundEffects(volume){
    rotateSound.volume = volume;
    moveSound.volume = volume;
    completLineAudio.volume = volume;
    freezeAudio.volume = volume;
}

// Configura os volumes iniciais
setMusicVolume(0.5);
setSoundEffects(0.4);

let currentMusic = musicA; // Inicialmente, com a música A
let musicStarted = false; // Flag para verificar se a música já começou

// Função para iniciar a música de fundo
function playBackgroundMusic() {
    if (!musicStarted && currentMusic.paused) {
        currentMusic.play();
        musicStarted = true;
    }
}

// Função para trocar a música de fundo
function changeMusic(newMusic) {
    if (currentMusic !== newMusic) {
        currentMusic.pause();
        currentMusic = newMusic;
        currentMusic.currentTime = 0;
        currentMusic.play();
        musicStarted = true;
    }
}

function playPauseSound() {
    new Audio("./src/assets/sounds/pause.wav").play();
}

function playCompleteLineAudio() {
    completLineAudio.playbackRate = 1.2;
    completLineAudio.play();

    linesCleared++; // Incrementa o contador de linhas
    updateLinesCounter(); // Atualiza o contador de linhas
    
}

// Formas das peças do Tetris
const lShape = [
    // 1° rotação, 2° rotação, 3°rotação, 4°rotação
    [1, 2, gridWidth+1, gridWidth*2+1], 
    [gridWidth, gridWidth+1, gridWidth+2, gridWidth*2+2],
    [1, gridWidth+1, gridWidth*2, gridWidth*2+1],
    [gridWidth, gridWidth*2, gridWidth*2+1, gridWidth*2+2]
]
const zShape = [
    [gridWidth + 1, gridWidth + 2, gridWidth*2, gridWidth*2 + 1],
    [0, gridWidth, gridWidth + 1, gridWidth*2 + 1],
    [gridWidth + 1, gridWidth + 2, gridWidth*2, gridWidth*2 + 1],
    [0, gridWidth, gridWidth + 1, gridWidth*2 + 1]
]
const tShape = [
    [1, gridWidth, gridWidth + 1, gridWidth + 2],
    [1, gridWidth + 1, gridWidth + 2, gridWidth*2 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth*2 + 1],
    [1, gridWidth, gridWidth + 1, gridWidth*2 + 1]
]
const oShape = [
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1],
    [0, 1, gridWidth, gridWidth + 1]
]
const iShape = [
    [1, gridWidth + 1, gridWidth*2 + 1, gridWidth*3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
    [1, gridWidth + 1, gridWidth*2 + 1, gridWidth*3 + 1],
    [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3]
]

const allShapes = [lShape, zShape, tShape, oShape, iShape];

// Cores das peças
const colors = ["red", "green", "orange", "yellow", "pink"];
let currentColor = Math.floor(Math.random() * colors.length);
let nextColor = colors[currentColor];
let currentPosition = 3;
let currentRotation = 0;
let randomShape = Math.floor(Math.random() * allShapes.length);
let currentShape = allShapes[randomShape][currentRotation];
let $gridSquares = Array.from(document.querySelectorAll(".grid div"));

// Definição dos próximos formatos
const $miniGridSquares = document.querySelectorAll(".mini-grid div");
const miniGridWidth = 6;
const nextPosition = 2;
const possibleNextShapes = [
    [ 1, 2, miniGridWidth+1, miniGridWidth*2+1 ],
    [ miniGridWidth+1, miniGridWidth+2, miniGridWidth*2, miniGridWidth*2+1 ],
    [ 1, miniGridWidth, miniGridWidth+1, miniGridWidth+2],
    [ 0, 1, miniGridWidth, miniGridWidth+1],
    [ 1, miniGridWidth+1, miniGridWidth*2+1, miniGridWidth*3+1 ]
]

let nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length);

// Função para exibir o próximo formato
function displayNextShape(){
    
    // apaga os formatos antigos
    $miniGridSquares.forEach(square => square.classList.remove("shapePainted", `${colors[nextColor]}`));
    nextColor = Math.floor(Math.random() * colors.length)


    nextRandomShape =  Math.floor(Math.random() * possibleNextShapes.length);
    const nextShape = possibleNextShapes[nextRandomShape];

    nextShape.forEach(squareIndex =>
        $miniGridSquares[squareIndex + nextPosition + miniGridWidth].classList.add("shapePainted", `${colors[nextColor]}`)
    );   
}

displayNextShape();

// Função para desenhar a forma atual no grid
function drawShape(){
    currentShape.forEach(squareIndex => {
        $gridSquares[squareIndex + currentPosition].classList.add("shapePainted", `${colors[currentColor]}`);
    })
}

// Função para apagar a forma atual do grid
function eraseShape(){
    currentShape.forEach(squareIndex => {
        $gridSquares[squareIndex + currentPosition].classList.remove("shapePainted", `${colors[currentColor]}`);
    })
}

// Função para congelar a forma atual quando atinge o fundo ou outra forma
function freezeFilled(){
    if (currentShape.some(squareIndex =>
        squareIndex + currentPosition + gridWidth >= $gridSquares.length ||
        $gridSquares[squareIndex + currentPosition + gridWidth].classList.contains("filled")
    )) {
        currentShape.forEach(squareIndex => {
            if ($gridSquares[squareIndex + currentPosition]) { // Verifica se o elemento existe
                $gridSquares[squareIndex + currentPosition].classList.add("filled");
            }
        });

        // Verifica se o jogo terminou antes de remover o último bloco
        if(hasWon) {
            // Remove a classe "shapePainted" para que o último bloco desapareça
            currentShape.forEach(squareIndex =>{
                if ($gridSquares[squareIndex + currentPosition])
                {
                    $gridSquares[squareIndex + currentPosition].classList.remove("shapePainted");
                }

            })
        }

        currentShape.forEach(squareIndex=>{
            // Verifica se o elemento existe
            if ($gridSquares[squareIndex + currentPosition])
            {
                $gridSquares[squareIndex + currentPosition].classList.add("filled");
            }
        })

        currentPosition = 3;
        currentRotation = 0;

        randomShape = nextRandomShape;
        currentShape = allShapes[randomShape][currentRotation];
        currentColor = nextColor;

        drawShape();
        checkIfRowsFilled();

        // Aumenta a pontuação toda vez que uma forma é congelada (5 pontos no momento)
        updateScore(5);
        displayNextShape();
        freezeAudio.play();

        // Verifica se o jogo acabou
        gameOver();
    }
}

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
        minScore: 500,
        maxScore: 1900,
        music: musicB,
        timeMoveDown: 390
    },
    {
        minScore: 1900,
        maxScore: 3200,
        music: musicC,
        timeMoveDown: 350
    },
    {
        minScore: 3200,
        maxScore: 4500,
        music: musicD,
        timeMoveDown: 290
    },
    {
        minScore: 4500,
        maxScore: 5700,
        music: musicE,
        timeMoveDown: 230
    },
    {
        minScore: 5700,
        maxScore: 6900,
        music: musicF,
        timeMoveDown: 200
    },
    {
        minScore: 6900,
        maxScore: 8000,
        music: musicG,
        timeMoveDown: 190
    },
    {
        minScore: 8000,
        maxScore: 9500,
        music: musicH,
        timeMoveDown: 180
    },
    {
        minScore: 9500,
        maxScore: 10000,
        music: musicI,
        timeMoveDown: 150
    },
    {
        minScore: 10000,
        maxScore: 10010,
        music: musicJ,
        timeMoveDown: 148
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


// Função para manipular eventos de teclado
document.addEventListener("keydown", controlKeyBoard);
document.addEventListener("keyup", onKeyUp);

let pressRight = false
let pressLeft = false
let pressDown = false
let pressUp = false

function onKeyUp(event) {
    mustBeRotate = true

    if (event.key == 'ArrowRight') {
        pressRight = false
    }
    else if (event.key == 'ArrowLeft') {
        pressLeft = false
    }
    else if (event.key == 'ArrowDown') {
        pressDown = false
    }
    else if (event.key == 'ArrowUp') {
        pressUp = false
    }
}

const keyBoardMap = {
    "ArrowLeft": moveLeft,
    "ArrowRight": moveRight,
    "ArrowDown": moveDown,
    "ArrowUp": rotateShape
}

setInterval(() => {
    if(!timerId){
        return
    }
    if (pressRight) {
        moveRight();
    }
    if (pressLeft) {
        moveLeft();
    }
    if (pressDown) {
        moveDown();
    }
}, 75)

let rotateCoolDown = 0;
let mustBeRotate = true

setInterval(() => {
    if(!timerId){
        return
    }
    if (pressUp && mustBeRotate) {
        rotateShape();
        mustBeRotate = false
    }
}, 25)

function controlKeyBoard(event){
    if(event.keyCode == 32){
        event.preventDefault()
        pauseGame()
    }
    
    if (timerId){
        if (event.key == 'ArrowRight') {
            pressRight = true
        }
        else if (event.key == 'ArrowLeft') {
            pressLeft = true
        }
        else if (event.key == 'ArrowDown') {
            pressDown = true
        }
        else if (event.key == 'ArrowUp') {
            pressUp = true
        }
    }
}

// Funções para movimentação das peças
function moveDown(){
    // Verifica se o jogo já foi vencido para parar
    if (hasWon) return;

    freezeFilled();
    eraseShape();
    currentPosition += gridWidth;
    drawShape();
    playMoveSound();
}

function moveLeft(){
    if (hasWon) return;

    // Verificação para o limite de borda
    const isEdgeLimit  = currentShape.some((squareIndex) => (squareIndex + currentPosition) % gridWidth === 0)
    if (isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex => 
        $gridSquares[squareIndex + currentPosition - 1].classList.contains("filled")
    )

    if (isFilled) return

    eraseShape();
    currentPosition--
    drawShape();
    playMoveSound();
}

function moveRight(){
    if (hasWon) return;

    const isEdgeLimit  = currentShape.some((squareIndex) => (squareIndex + currentPosition) % gridWidth === gridWidth - 1)
    if (isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex => 
        $gridSquares[squareIndex + currentPosition + 1].classList.contains("filled")
    )
    if (isFilled) return
    eraseShape();
    currentPosition++
    drawShape();
    playMoveSound();
}

function previousRotation(){
    if (currentRotation === 0){
        currentRotation = currentShape.length - 1;
    } else {
        currentRotation--;
    }
    currentShape = allShapes[randomShape][currentRotation];
}

function rotateShape(){
    if (hasWon) return;
    eraseShape();

    if (currentRotation === currentShape.length - 1) {
        currentRotation = 0;
    } else {
        currentRotation++;
    }
    currentShape = allShapes[randomShape][currentRotation]
    
    const isLeftEdgeLimit = currentShape.some((squareIndex)=> (squareIndex + currentPosition) % gridWidth === 0 )
    const isRightEdgeLimit = currentShape.some((squareIndex)=> (squareIndex + currentPosition) % gridWidth === gridWidth-1 )

    if (isLeftEdgeLimit && isRightEdgeLimit){
        previousRotation();
    }
    const isFilled  = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition].classList.contains("filled")
    )
    if (isFilled) {
        previousRotation();
    }
    drawShape();
    playRotateSound();
}

/* Controle Mobile */
const isMobile = window.matchMedia('(max-width: 990px)').matches;

if (isMobile) {
    const buttonMap = {
        'left-button': moveLeft,
        'right-button': moveRight,
        'down-button': moveDown,
        'rotate-button': rotateShape,
    }

    const $mobileButtons = document.querySelectorAll(".mobile-buttons-container button");

    $mobileButtons.forEach(button=>{
        button.classList.add('disabled-dbl-tap-zoom');

        button.addEventListener("click", ()=>{
            if (timerId){
                buttonMap[button.classList[0]]()
            }
    
        });

    });
}