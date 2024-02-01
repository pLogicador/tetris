
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
