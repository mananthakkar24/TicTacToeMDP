var board;
var points1 = 0;
var points2 = 0;
var points3 = 0;

$(document).ready(function() {
    $("#choose-x").on("click", function() {
      human1 = "X";
      human2 = "O";
      document.getElementById("opted").innerHTML="You chose X";
    });
    $("#choose-o").on("click", function() {
      human1 = "O";
      human2 = "X";
      document.getElementById("opted").innerHTML="You chose O";
    });
});

  // Enemy screen buttons
  $("#choose-human").on("click", function() {
    cpuEnabled = false;
    startGameHuman();

  });
  $("#choose-cpu").on("click", function() {
    cpuEnabled = true;
    document.getElementById("xscore").innerHTML="Your Score:";
    document.getElementById("oscore").innerHTML="CPU Score:";
    startGameComp();

  });
  function chooser(){
    if (cpuEnabled===true){
        startGameComp();
    }
    else{
        startGameHuman();
    }
}
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

var currentTurn = 1;
var movesMade = 0;

var winnerContainer = $('.winner');
var reset = $('.reset');
var sqr = $('.square');

function showit(){
document.getElementById("play_against").style.visibility="visible";
}
function showit2(){
    document.getElementById("open-button").style.visibility="visible";
    }


function opengame(){
    //document.getElementById("turn-tell").style.visibility="visible";
    document.getElementById("gametable").style.display="block";
    document.querySelector(".open-button").style.display="none";
    document.querySelector(".close-button").style.display="block";
    document.getElementById("scoring_data").style.visibility="visible";
    document.getElementById("play_against").style.visibility="hidden";
    document.getElementById("option_choose").style.visibility="hidden";
    // document.getElementById("intro-screen").style.visibility="hidden";
}

function closegame(){
    document.querySelector(".close-button").style.display="none";
    document.querySelector(".open-button").style.display="block";
    document.getElementById("gametable").style.display="none";
    // document.getElementById("intro-screen").style.visibility="visible";
}

const cells=document.querySelectorAll('.cell');
// startGame();

function playsound() {
    var a = new Audio('sound.mp3');
    a.play();
}

function startGameComp(){
    document.querySelector('.endgame').style.display='none';
    board = Array.from(Array(9).keys());
    for(var i=0;i<cells.length;i++){
        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',playsound,false);
        cells[i].addEventListener('click',turnClickComp,false);
        
    }
}

function startGameHuman(){
    document.querySelector('.endgame').style.display='none';
    board = Array.from(Array(9).keys());
    for(var i=0;i<cells.length;i++){
        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',playsound,false);
        cells[i].addEventListener('click',turnClickHuman,false);
    }
}

function turnClickComp(square){
    if (typeof board[square.target.id] == 'number') {
        turn(square.target.id, human1);
        if (!checkTie()) turn(bestSpot(), human2);
        
    }
}

function turnClickHuman(square){
    if (typeof board[square.target.id] == 'number') {
            if (currentTurn % 2 === 1) {
                turn(square.target.id, human1);
                currentTurn++;
            } else {
                turn(square.target.id, human2);
                currentTurn--;
            }
            if (!checkTie()) turn(turnClickHuman());
            //     theWinner = currentTurn == 1 ? human2 : human1;
            //     declareWinner(theWinner);
            // }
        
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
            gameWon.player == human1 ? "grey" : "grey";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClickComp, false);
        cells[i].removeEventListener('click', turnClickHuman, false);
    }
    if (cpuEnabled===true){
        declareWinner(gameWon.player==human1?"Player 1 Wins!":"CPU Wins!");
    }
    else{
        declareWinner(gameWon.player==human1?"Player 1 Wins!":"Player 2 Wins!"); 
    }
    
    if (gameWon.player===human1){
        points1++;
        document.getElementById("computer_score").innerHTML = points1;
        console.log(points1);
    }
    else if(gameWon.player===human2){
        points2++;
        document.getElementById("player_score").innerHTML = points2;
        console.log(points2);
    }
    //else{
       // points3++;
     //   document.getElementById("tie_score").innerHTML = points3;
   // }
    
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return board.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(board,human2).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "grey";
            cells[i].removeEventListener('click', turnClickComp, false);
            cells[i].removeEventListener('click', turnClickHuman, false);
        }
        declareWinner("Tie Game!")
        points3++;
        document.getElementById("tie_score").innerHTML = points3;
        return true;
    }
    return false;
}


function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, human1)) {
        return {score: -10};
    } else if (checkWin(newBoard, human2)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == human2) {
            var result = minimax(newBoard, human1);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, human2);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player === human2) {
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