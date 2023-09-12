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

const gridWidth = 10; // tamanho total de linhas 

const musicThresholds = [500, 1000, 1500]; // Pontuações em que a música deve mudar
let currentMusicIndex = 0; // Índice da música atual


const musicA = new Audio("./src/assets/sounds/A-TypeMusic.mp3");
const musicB = new Audio("./src/assets/sounds/A-TypeMusic(v1.0).mp3");
const musicC = new Audio("./src/assets/sounds/B-TypeMusic.mp3");
const musicD = new Audio("./src/assets/sounds/C-TypeMusic.mp3");
const musicE = new Audio("./src/assets/sounds/TetrisBGM1.mp3");
const musicF = new Audio("./src/assets/sounds/TetrisBGM1(Fast).mp3");
const musicG = new Audio("./src/assets/sounds/TetrisBGM2.mp3");
const musicH = new Audio("./src/assets/sounds/TetrisBGM2(Fast).mp3");

const completLineAudio = new Audio("./src/assets/sounds/StageClear.mp3");
const gameOverAudio = new Audio("./src/assets/sounds/GameOver.mp3")
const freezeAudio = new Audio("./src/assets/sounds/block.mp3");



let currentMusic = musicA; // Inicialmente, com a música A
let musicStarted = false; // Flag para verificar se a música já começou

function playBackgroundMusic() {
    if (!musicStarted) {
        currentMusic.play();
        musicStarted = true;
    }
}

function playCompleteLineAudio() {
    completLineAudio.play();

    linesCleared++; // Incrementa o contador de linhas
    updateLinesCounter(); // Atualiza o contador de linhas
    
}

function changeMusic(newMusic) {
    currentMusic.pause();
    currentMusic = newMusic;
    currentMusic.currentTime = 0;
    currentMusic.play();
}

function changeMusicAndDifficulty() {
    // Verifica se a pontuação atingiu um dos limiares
    if (score >= musicThresholds[currentMusicIndex]) {
        // Avança para a próxima música (se houver) e aumenta a dificuldade
        currentMusicIndex++;
        if (currentMusicIndex < musicThresholds.length) {
            changeMusic(musicArray[currentMusicIndex]);
            increaseDifficulty();
        }
    }
}




// Formas
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

/*Definição de cores para formas*/
const colors = ["red", "green", "orange", "yellow", "pink"];
let currentColor = Math.floor(Math.random() * colors.length);
let nextColor = colors[currentColor];




// @1.0 Cálculo para geração aleatória dos formatos
let currentPosition = 3;
let currentRotation = 0;
let randomShape = Math.floor(Math.random() * allShapes.length);
let currentShape = allShapes[randomShape][currentRotation];
let $gridSquares = Array.from(document.querySelectorAll(".grid div"));





/*Funções para Desenhar, apagar, e congelar*/
function drawShape(){
    currentShape.forEach(squareIndex => {
        $gridSquares[squareIndex + currentPosition].classList.add("shapePainted", `${colors[currentColor]}`);
    })
}

drawShape();

function eraseShape(){
    currentShape.forEach(squareIndex => {
        $gridSquares[squareIndex + currentPosition].classList.remove("shapePainted", `${colors[currentColor]}`);
    })
}


function freezeFilled(){
    if (currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + gridWidth].classList.contains("filled")
    )) {
        currentShape.forEach(squareIndex => $gridSquares[squareIndex + currentPosition].classList.add("filled"))

        currentPosition = 3;
        currentRotation = 0;
        // @1.0
        randomShape = nextRandomShape;
        currentShape = allShapes[randomShape][currentRotation];
        currentColor = nextColor;

        drawShape();
        checkIfRowsFilled();

        // para cada vez que um shape for congelado recebe 5pts
        updateScore(5);
        displayNextShape();
        freezeAudio.play();
        
        gameOver();
    }
}





/*Preview do próximo formato*/
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


function displayNextShape(){
    // apaga os formatos antigos
    $miniGridSquares.forEach(square => square.classList.remove("shapePainted", `${colors[nextColor]}`));
    nextColor = Math.floor(Math.random() * colors.length)


    nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length);
    const nextShape = possibleNextShapes[nextRandomShape];

    nextShape.forEach(squareIndex =>
        $miniGridSquares[squareIndex + nextPosition + miniGridWidth].classList.add("shapePainted", `${colors[nextColor]}`)
    );
}

displayNextShape();






/*Start,  restart*/

let timeMoveDown = 600;
let timerId = null;
const $startStopButton = document.getElementById("start-button") ;

$startStopButton.addEventListener("click", ()=>{
    if (timerId){
        clearInterval(timerId);
        timerId = null;



    } else {
        timerId = setInterval(moveDown, timeMoveDown);

        playBackgroundMusic();
    }
})

const $restartButton = document.getElementById("restart-button");

$restartButton.addEventListener("click", ()=>{
    window.location.reload();
})






/*Funções de movimentos */
function moveDown(){
    freezeFilled();

    eraseShape();
    currentPosition += 10;
    drawShape();
}

function moveLeft(){
    // @1.2 Verificação para o limite de borda
    const isEdgeLimit  = currentShape.some((squareIndex) => (squareIndex + currentPosition) % gridWidth === 0)
    if (isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex => 
        $gridSquares[squareIndex + currentPosition - 1].classList.contains("filled")
    )
    if (isFilled) return


    eraseShape();
    currentPosition--
    drawShape();
}

function moveRight(){
    // @1.2
    const isEdgeLimit  = currentShape.some((squareIndex) => (squareIndex + currentPosition) % gridWidth === gridWidth - 1)
    if (isEdgeLimit) return


    const isFilled = currentShape.some(squareIndex => 
        $gridSquares[squareIndex + currentPosition + 1].classList.contains("filled")
    )
    if (isFilled) return


    eraseShape();
    currentPosition++
    drawShape();
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

}



/*Ao preencher uma linha completa*/
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
        
            updateScore(50);
            playCompleteLineAudio();
        }
    }
}



// variável para rastrear o número de linhas completadas
let linesCleared = 0;

function updateLinesCounter() {
    const $linesCount = document.getElementById('lines-count');
    $linesCount.textContent = linesCleared;
}





/* Função para atualizar a pontuação e a dificuldade*/
const $score = document.querySelector(".score");
let score = 0;

function updateScore(updateValue){
    score += updateValue;
    $score.textContent = score;

    
    // Dificuldades conforme pontuação
    clearInterval(timerId)
    changeMusicAndDifficulty();

    timerId = setInterval(moveDown, timeMoveDown);

}



function changeMusicAndDifficulty() {
    if (score > 500 && score <= 1000 && currentMusic !== musicB) {
        timeMoveDown = 500;
        changeMusic(musicB);
        applyTheme(1);
    } else if (score > 1000 && score <= 2600 && currentMusic !== musicC) {
        timeMoveDown = 400;
        changeMusic(musicC);
        applyTheme(2);
    } else if (2600 < score && score <= 3900 && currentMusic !== musicD) {
        timeMoveDown = 250;
        changeMusic(musicD);
        applyTheme(3);
    } else if (3900 < score && score <= 5200 && currentMusic !== musicE) {
        timeMoveDown < 150;
        changeMusic(musicE);
        applyTheme(4);
    } else if (5200 < score && score <= 9900 && currentMusic !== musicF) {
        timeMoveDown < 100;
        changeMusic(musicF);
    } else if (9900 < score && score <= 15900 && currentMusic !== musicG) {
        timeMoveDown < 100;
        changeMusic(musicG);
    } else if (15900 < score && score <= 60900 && currentMusic !== musicG){
        timeMoveDown < 90;
        changeMusic(musicG);
    }
}


const themes = [
    {
        gridBackground: 'linear-gradient(0deg, pink, white)'
    
    },
    {
        gridBackground: 'linear-gradient(15deg, green, purple)' 
    },
    {
        gridBackground: 'linear-gradient(15deg, red, orange)' 
    },

    {
        gridBackground: 'linear-gradient(15deg, yellow, green)' 
    }
    
];


function applyTheme(themeIndex) {
    // Obtenhem o tema atual com base no índice
    const theme = themes[themeIndex];

    // Aplica os estilos do tema ao grid e ao texto
    const $grid = document.querySelector('.grid');
    const $score = document.querySelector('.score');

    $grid.style.background = theme.gridBackground;
    $score.style.color = theme.textColor;

}








/* Função game over*/
function gameOver(){
    if (currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition].classList.contains("filled")
    )) {
        updateScore(-13);
        clearInterval(timerId);
        timerId = null;
        $startStopButton.disabled = true;

        if (musicStarted) {
            currentMusic.pause();
            musicStarted = false;
        }

        gameOverAudio.play();
        $score.innerHTML += "<br />" + "<br />" + "GAMER OVER";
    };
}




// Evento de cliques
document.addEventListener("keydown", controlKeyBoard);

function controlKeyBoard(event){
    if (timerId){
        if(event.key === "ArrowLeft"){
            moveLeft();
        } else if (event.key === "ArrowRight")
        {
            moveRight();
        } else if (event.key === "ArrowDown"){
            moveDown();
        } else if (event.key === "ArrowUp")
        {
            rotateShape();
        }
    }

}

/*Caso mobile*/
const isMobile = window.matchMedia('(max-width: 990px)').matches;

if (isMobile){
    const $mobileButtons = document.querySelectorAll(".mobile-buttons-container button");
    $mobileButtons.forEach(button => button.addEventListener("click", ()=>{
        if (timerId){
            if (button.classList[0] === "left-button"){
                moveLeft();
            } else if (button.classList[0] === "right-button"){
                moveRight();
            } else if (button.classList[0] === "down-button"){
                moveDown();
            } else if (button.classList[0] === "rotate-button"){
                rotateShape();
            }
        }

    }))
}