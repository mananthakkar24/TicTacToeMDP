var board;
//const human="";
//const ai="";
$(document).ready(function() {
    $("#choose-x").on("click", function() {
      human = "X";
      ai = "O";
      document.getElementById("turn-tell").innerHTML = "Player X turn first";
    });
    $("#choose-o").on("click", function() {
      human = "O";
      ai = "X";
      document.getElementById("turn-tell").innerHTML = "Player O turn first";
      
    });
});

  // Enemy screen buttons
  $("#choose-human").on("click", function() {
    cpuEnabled = false;
    startGame();
  });
  $("#choose-cpu").on("click", function() {
    cpuEnabled = true;
    startGame();
  });

var win=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

function opengame(){
    document.getElementById("turn-tell").style.visibility="visible";
    document.getElementById("gametable").style.display="block";
    document.querySelector(".open-button").style.display="none";
    document.querySelector(".close-button").style.display="block";
    document.getElementById("intro-screen").style.visibility="hidden";
}

function closegame(){
    document.querySelector(".close-button").style.display="none";
    document.querySelector(".open-button").style.display="block";
    document.getElementById("gametable").style.display="none";
    document.getElementById("intro-screen").style.visibility="visible";
}

const cells=document.querySelectorAll('.cell');
startGame();

function playsound() {
    var a = new Audio('sound.mp3');
    a.play();
}
function startGame(){
    document.querySelector('.endgame').style.display='none';
    board = Array.from(Array(9).keys());
    for(var i=0;i<cells.length;i++){
        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',playsound,false);
        cells[i].addEventListener('click',turnClick,false);
        
    }
}

function turnClick(square){
    if (typeof board[square.target.id] == 'number') {
        turn(square.target.id, human);
        if (!checkTie()) turn(bestSpot(), ai);
        
    }
}

function turn(squareId,player){
    board[squareId]=player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(board, player)
    if (gameWon){
        gameOver(gameWon);
    }
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => 
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, wins] of win.entries()) {
        if (wins.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of win[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == human ? "grey" : "grey";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player==human?"You win!":"You lose!");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return board.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(board,ai).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "grey";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        // var c = 0;
        // var count=c+1;
        // alert(count);
        return true;
    }
    return false;
}


function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, human)) {
        return {score: -10};
    } else if (checkWin(newBoard, ai)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == ai) {
            var result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player === ai) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

