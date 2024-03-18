const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const footer = document.querySelector('footer')
const playBtn = document.getElementById('playBtn')
const nextBtn = document.getElementById('nextBtn')
const sizeOutput = document.getElementById('sizeOutput')
const sizeSlider = document.getElementById('size')
const speedOutput = document.getElementById('speedOutput')
const speedSlider = document.getElementById('speed')
const grid = []
let size = 50
let speed = 100


// utility functions
{
function randomNumberRange(minInt, maxInt){
    return Math.random() * (maxInt - minInt) + minInt;
}
function randomColor(colorArray){
    return colorArray[Math.floor(Math.random()*colorArray.length)];
}
}
class Cell{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.alive = false;
        this.survive = false;
    }
    draw(){
        let x = this.x * this.size;
        let y = this.y * this.size;

        c.beginPath();
        if(this.alive){
            c.fillStyle = 'yellow';
            c.fillRect(x,y,this.size,this.size);
        }
        c.strokeStyle = 'black'
        c.lineWidth = 1;
        c.strokeRect(this.x*this.size, this.y*this.size, this.size, this.size);
        c.closePath();
    }
    update(){
        this.alive = this.survive;
    }
}

function createGrid(size){
    let width = canvas.width / size;
    let height = canvas.height / size;
    for(let i = 0; i < width; i++){
        const row = []
        for(let j = 0; j < height; j++){
            row.push(new Cell(i, j, size))
        }
        grid.push(row)
    }
}

function drawGrid(){
    grid.forEach(row => {
        row.forEach(cell => {
            cell.draw();
        });
    });
}

addEventListener('click', event =>{
    let mouse = {
        x: Math.floor(event.clientX / size),
        y: Math.floor(event.clientY / size)
    }
    if(event.clientX > 0 && event.clientX < canvas.width && event.clientY > 0 && event.clientY < canvas.height){
        let cell = grid[mouse.x][mouse.y]
        cell.alive = !cell.alive
        // checkCell(cell)
    }
})

function nextTick(){
    grid.forEach(row => {
        row.forEach(cell => {
            cell.survive = checkCell(cell);
        });
    });
    grid.forEach(row => {
        row.forEach(cell => {
            cell.update();
        });
    });
}

function checkCell(cell){
    let x = cell.x - 1;
    let y = cell.y - 1;
    
    //get 3x3 grid around cell 
    let subGrid = [];
    for(let i = 0; i< 3; i++){
        const column = [];
        if(grid[x+i] !== undefined){
            for(let j = 0; j< 3; j++){
                if(x+i >= 0 && y+j >= 0 && grid[x + i][y + j] != cell && grid[x + i][y + j] !== undefined){
                    column.push(grid[x + i][y + j].alive)
                }
                else{
                    column.push(null)
                }
            }
            subGrid.push(column)
        }
    }
    //count neighbours
    let aliveNeighbours = 0
    subGrid.forEach(column => {
        column.forEach(state => {
            if(state === true){
                aliveNeighbours++
            }
        });
    });
    
    //rules
    if(cell.alive){
        if(aliveNeighbours < 2 || aliveNeighbours > 3){
            return false
        }
        else{
            return true
        }
    }
    else{
        if(aliveNeighbours == 3){
            return true
        }
        else{
            return false
        }
    }
}
let autoplay = false
function play(){
    autoplay = !autoplay;
    
    if(autoplay){
        loop();
        playBtn.innerHTML = 'pause'
    }
    else{
        playBtn.innerHTML = 'play'
    }

    function loop(){
        setTimeout(() => {
            nextTick();
            if(autoplay){
                loop();
            }
        }, speed);
    }

}

function init() {
    canvas.height = window.innerHeight - document.querySelector('footer').clientHeight - 10;
    canvas.width = window.innerWidth;
    grid.length = 0
    createGrid(size);
    play((autoplay = true));
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);    
    drawGrid();
}



addEventListener('resize',init)
init();
animate();

//outside canvas
playBtn.addEventListener('click', play)
nextBtn.addEventListener('click', nextTick)
sizeSlider.addEventListener('input',event =>{
    sizeOutput.innerHTML = sizeSlider.value;
    size = sizeSlider.value;
    init()
})
speedSlider.addEventListener('input',event =>{
    speedOutput.innerHTML = speedSlider.value;
    speed = speedSlider.value;
    
})