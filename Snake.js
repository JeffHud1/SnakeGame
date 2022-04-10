const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const chompImg = document.getElementById('chomp');
const bombOmbImg = document.getElementById('bomb');
const marioImg = document.getElementById('mario');
const bulletBillImg = document.getElementById('bullet');
let score = document.getElementById('score');
let reset = document.getElementById('reset');
let easyButton = document.getElementById('easy-mode');
let hardButton = document.getElementById('hard-mode');
let easyLight = document.getElementById('easy');
let hardLight = document.getElementById('hard');
const W = canvas.width;
const H = canvas.height;
let cells = 20; //number of cells created in both x and y direction
let cellSize = W / cells; //standard size of any sprite
let chain = []; //tail collector
let chainVolume = 2; //number of bombs to be attached
let speed  = 10; //speed the chomp travels
let gameOver = false;
let musicOn = false;
const backGroundMusic = new Audio('super-mario-music.mp3');
const chompSound = new Audio('Chomp.wav');
const bombSound = new Audio('bomb-omb.wav');
const gameOverSound = new Audio('game-over.wav');

let chainChomp = {
    x: 15,//needs to be incremented by values of 1.5
    y: 15,
}

let mario = {
    x: (Math.floor(Math.random() * cells)*1.5),
    y: (Math.floor(Math.random() * cells)*1.5),
}

let bulletBillOn = true;
let bulletBillHard = false;
let bulletBill = {
    x:-30,
    y:(Math.floor(Math.random() * cells)*1.5),
    xVelocity:1.5,
}

class bombOmb { //When this class is called by "new", constructor creates a new empty object and fills it with the
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let xVelocity = 0;
let yVelocity = 0;


function drawGrid(){//takes in the cell count and the width of the canvas and returns a grid
    ctx.lineWidth = 1;
    for (let i = 1; i < cells; i++) {
      let f = (W / cells) * i;
      ctx.beginPath();
      ctx.moveTo(f, 0);
      ctx.lineTo(f, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, f);
      ctx.lineTo(W, f);
      ctx.stroke();
      ctx.closePath();
    }
}

function playOnInteraction(){
    if(musicOn === true) backGroundMusic.play();
}

function moveChomp(){
    chainChomp.x += xVelocity;
    chainChomp.y += yVelocity;
    
}

function eatMario(){
    if(mario.x === chainChomp.x && mario.y === chainChomp.y){
        mario.x = (Math.floor(Math.random() * cells)*1.5);
        mario.y = (Math.floor(Math.random() * cells)*1.5);
        chainVolume++;
        chompSound.play();
    }
}

function updateScore(){
    score.innerText = `Score : ${chainVolume-2}`;
}

function isTheGameOver(){
    if(xVelocity !== 0 || yVelocity !== 0){
        if(chainChomp.x < 0 || (chainChomp.x * cells) > (W - cellSize) || chainChomp.y < 0 || (chainChomp.y * cells) > (H - cellSize)){
            gameOver = true;
        }
        if(chainChomp.x === bulletBill.x && chainChomp.y === bulletBill.y){
            gameOver = true;
        }
        for(let i = 0; i < chain.length; i++){
            let bomb = chain[i];
            if(chainChomp.x === bomb.x && chainChomp.y === bomb.y){
                gameOver = true;
                break
            }
            else if(bulletBill.x === bomb.x && bulletBill.y === bomb.y){
                gameOver = true;
                break
            }
        }
        if(gameOver) {
            score.innerText = `Game over, reset to try again`
            backGroundMusic.pause();
            bombSound.play();
            gameOverSound.play();
        }
    }
    return gameOver
}

function drawBulletBill(){
    if(bulletBillHard){
        ctx.drawImage(bulletBillImg, (bulletBill.x * cells), (bulletBill.y * cells), cellSize, cellSize);
        bulletBill.x += bulletBill.xVelocity;
        if(bulletBill.x * cells > W){
            bulletBill.x = 0;
            bulletBill.y = (Math.floor(Math.random() * cells)*1.5);
        }
    }
    else if(bulletBillOn){
        ctx.drawImage(bulletBillImg, (bulletBill.x * cells), (bulletBill.y * cells), cellSize, cellSize);
        bulletBill.x += bulletBill.xVelocity;
        if(bulletBill.x * cells > W){
            bulletBill.x = -30;
            bulletBill.y = (Math.floor(Math.random() * cells)*1.5);
        }
    }
}

function drawMario(){
    ctx.drawImage(marioImg, (mario.x * cells), (mario.y * cells), cellSize, cellSize);
}

function drawChomp(){
    for(let i = 0; i < chain.length; i++){
        let bomb = chain[i];
        ctx.drawImage(bombOmbImg, (bomb.x * cells), (bomb.y * cells), cellSize, cellSize);
    }
    chain.push(new bombOmb(chainChomp.x, chainChomp.y));//creates an x,y coordinate marker for next bomb in chain based on heads position and pushes it onto chains array as an object
    if(chain.length > chainVolume){
        chain.shift();
    }
    ctx.drawImage(chompImg, (chainChomp.x * cells), (chainChomp.y * cells), cellSize, cellSize);
    // ctx.translate(W/2,H/2)
    // ctx.rotate(Math.PI / 2);
    // ctx.translate(-W/2, -H/2)
}

function clear(){
    ctx.clearRect(0,0, W, H);
}

//keypress movement needs to be divisible by size of object to keep in grid
document.addEventListener('keydown', (e)=>{
    musicOn = true;
    //Up
    if(e.code === "ArrowUp" || e.code === "KeyW"){
        if(yVelocity === 1.5) return;
        yVelocity = -1.5;
        xVelocity = 0;
    }
    //Down
    if(e.code === "ArrowDown" || e.code === "KeyS"){
        if(yVelocity === -1.5) return;
        yVelocity = 1.5;
        xVelocity = 0;
    }
    //Right
    if(e.code === "ArrowRight" || e.code === "KeyD"){
        if(xVelocity === -1.5) return;
        yVelocity = 0;
        xVelocity = 1.5;
    }
    //Left
    if(e.code === "ArrowLeft" || e.code === "KeyA"){
        if(xVelocity === -1.5) return;
        yVelocity = 0;
        xVelocity = -1.5;
    }
});

easyButton.addEventListener("click", (e) =>{
    easyLight.classList.toggle('off')
    easyLight.classList.toggle('on')
    bulletBillOn = !bulletBillOn
})

hardButton.addEventListener("click", (e) =>{
    hardLight.classList.toggle('off')
    hardLight.classList.toggle('on')
    bulletBillHard = !bulletBillHard
})

reset.addEventListener("click", (e) =>{
    if(gameOver){
        gameOver = false;
    
        chainChomp.x = 15;
        chainChomp.y = 15;
        
        mario.x = (Math.floor(Math.random() * cells)*1.5);
        mario.y = (Math.floor(Math.random() * cells)*1.5);
        
        bulletBill.x = -30;
        bulletBill.y = (Math.floor(Math.random() * cells)*1.5);
    
        xVelocity = 0;
        yVelocity = 0;
    
        chain = [];
        chainVolume = 2;
    
        update()
    }
    backGroundMusic.load();
})

function update(){
    playOnInteraction();
    moveChomp();
    if(isTheGameOver()) return;
    clear();
    drawGrid();
    drawBulletBill();
    drawMario();
    drawChomp();
    eatMario();
    updateScore();
    setTimeout(update, 1000/speed)
}

update();