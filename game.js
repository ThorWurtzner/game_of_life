const probabilitySlider = document.querySelector("#probabilityOfLife");
const beginBtn = document.querySelector("#beginBtn");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const tileSize = 10;

function matrixGen(row, col) {
    let m = [];

    for (let i = 0; i < row; i++) {
        m.push([]);

        for (let j = 0; j < col; j++) {
            m[i].push(0);
        }
    }

    return m;
}

let map = matrixGen(40, 40);
let nextGenMap = matrixGen(map.length, map[0].length);

canvas.height = map.length * tileSize;
canvas.width = map[0].length * tileSize;

let begun = false;

function setupCanvas() {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const tile = map[row][col];
            
            if (begun) {
                // Probability of life
                const chance = probabilitySlider.value / 10;
                if (Math.random() > chance) {
                    map[row][col] = 1;
                }
            }
            
            if (tile == 0) {
                ctx.fillStyle = "white";
                ctx.strokeStyle = "lightgray"
            }
            
            if (tile == 1) {
                ctx.strokeStyle = "white"
                ctx.fillStyle = "black";
            }
            
            ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
        
    }
}
setupCanvas();


function drawCanvas() {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {

            if (row > 0 && row < map.length - 1 && col > 0 && col < map[row].length - 1) {
                
                // Find måde at loop gennem naboer
                let neighbors = [
                    map[row][col + 1], 
                    map[row][col - 1], 
                    map[row + 1][col], 
                    map[row - 1][col], 
                    map[row + 1][col + 1], 
                    map[row + 1][col - 1], 
                    map[row - 1][col - 1], 
                    map[row - 1][col + 1] 
                ]
                
                let liveNeighbors = 0;
                
                for (let i = 0; i < neighbors.length; i++) {
                    if (neighbors[i] == 1) {
                        liveNeighbors++;
                    }
                }
                
                // Gamerule 1 - Any live cell with fewer than two live neighbors dies, as if by underpopulation.
                if (map[row][col] == 1 && liveNeighbors < 2) {
                    nextGenMap[row][col] = 0;
                }

                // Gamerule 2 - Any live cell with two or three live neighbors lives on to the next generation.
                if (map[row][col] == 1 && liveNeighbors == 2 && liveNeighbors == 3) {
                    nextGenMap[row][col] = 1;
                }
                
                // Gamerule 3 - Any live cell with more than three live neighbors dies, as if by overpopulation.
                if (map[row][col] == 1 && liveNeighbors > 3) {
                    nextGenMap[row][col] = 0;
                }
                
                // Gamerule 4 - Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
                if (map[row][col] == 0 && liveNeighbors == 3) {
                    nextGenMap[row][col] = 1;
                }
            
            }
        }
    }
    
    
    for (let row = 0; row < nextGenMap.length; row++) {
        for (let col = 0; col < nextGenMap[row].length; col++) {

            if (nextGenMap[row][col] == 0) {
                ctx.fillStyle = "white";
                ctx.strokeStyle = "lightgray"
            }
            
            if (nextGenMap[row][col] == 1) {
                ctx.strokeStyle = "white"
                ctx.fillStyle = "black";
            }
            
            ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);

            map[row][col] = nextGenMap[row][col];
        }
    }
}

beginBtn.addEventListener('click', () => {
    for (let i = 0; i < 9999; i++) {
        window.clearInterval(i);
    }
    begun = true;
    setupCanvas();
    window.setInterval(drawCanvas, 50);
})

