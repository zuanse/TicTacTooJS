//import {EasyBoard} from './easyboard.js';
//import {RobotRandom} from './robotrandom.js';
//import {RobotMiniMax} from './robotminimax.js';

function updateBoardView(board){
    document.getElementById("00").src = getImageSrc(board.cells[0][0])
    document.getElementById("01").src = getImageSrc(board.cells[0][1])
    document.getElementById("02").src = getImageSrc(board.cells[0][2])
    document.getElementById("10").src = getImageSrc(board.cells[1][0])
    document.getElementById("11").src = getImageSrc(board.cells[1][1])
    document.getElementById("12").src = getImageSrc(board.cells[1][2])
    document.getElementById("20").src = getImageSrc(board.cells[2][0])
    document.getElementById("21").src = getImageSrc(board.cells[2][1])
    document.getElementById("22").src = getImageSrc(board.cells[2][2])
}

function getImageSrc(cellValue) {
    if(cellValue == 1)
    {
        return "crossIcon.jpg";
    }
    else if(cellValue == 2)
    {
        return "zeroIcon.jpg";
    }
    else
    {
        return "blankIcon.jpg"
    }
}

function getWinnerName(cellValue) {
    if(cellValue == 1)
    {
        return "Cross";
    }
    else if(cellValue == 2)
    {
        return "Zero";
    }
    else
    {
        return "Draw"
    }
}

var currentBoard = null;
var robot = null;
initNewGame();
if(document.getElementById("idFirstMove").value == "robot")
{
    robot.makeMove(currentBoard);
    updateBoardView(currentBoard);
}

async function onCellClick(r, c){
    if(currentBoard.gameOver())
        return;
    if(!currentBoard.makeMove(r, c)){
        return;
    }
    updateBoardView(currentBoard);
    onPlayerMoveDone();
   
    if(!currentBoard.gameOver()){
        //aiRandomMakeMove(currentBoard);
        await sleep(500);
        robot.makeMove(currentBoard);
        updateBoardView(currentBoard);
        onPlayerMoveDone();  
    }
}

function onPlayerMoveDone(){
    if(currentBoard.gameOver())
    {
        let winner = currentBoard.getWinner();
        document.getElementById("idWinnerImage").src = getImageSrc(winner);
        document.getElementById("idWinnerCaption").innerText = getWinnerName(winner);
    }  
}

function onNewGameClick(){
    initNewGame();

    if(document.getElementById("idFirstMove").value == "robot")
    {
        robot.makeMove(currentBoard);
        updateBoardView(currentBoard);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createBoard(){
    return new EasyBoard();
}

function createRobot(){
    let rob = document.getElementById("idRobotType").value;
    if(rob == "robotRandom")
        return new RobotRandom();
    else if(rob == "robotMiniMax")
        return new RobotMiniMax(1);
}

function initNewGame(){
    currentBoard = createBoard();
    robot = createRobot();
    document.getElementById("idWinnerCaption").innerText = "";
    document.getElementById("idWinnerImage").src = getImageSrc(0);
    updateBoardView(currentBoard);
}