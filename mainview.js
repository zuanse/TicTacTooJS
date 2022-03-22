//import {EasyBoard} from './easyboard.js';
//import {RobotRandom} from './robotrandom.js';
//import {RobotMiniMax} from './robotminimax.js';

function updateBoardView(board){
    var table = document.getElementById("idBoard");
    table.innerHTML = "";
    let rc = board.rowsCount;
    let cc = board.colsCount;
    let ss = getStyleSheet('board');
    table.style.gridTemplateRows = "repeat(" + rc +", auto)";
    table.style.gridTemplateColumns = "repeat(" + cc +", auto)";
    for(var r = 0; r < rc; r++){
        for(var c = 0; c < cc; c++){
            cell = document.createElement('div');
            img = document.createElement('img');
            img.setAttribute('id', "" + r + c);
            img.setAttribute('src', getImageSrc(board.cells[r][c]));
            img.setAttribute('onclick',"onCellClick("+r+","+c+")")
            cell.appendChild(img);
            table.appendChild(cell);
        }
    }
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
function getStyleSheet(unique_title) {
    for (const sheet of document.styleSheets) {
      if (sheet.title === unique_title) {
        return sheet;
      }
    }
  }

function createBoard(){
    let brd = document.getElementById("idGameType").value;
    if(brd == "easy"){
        return new EasyBoard();
    }
    else {
        return new InfinityBoard();
    }
}

function createRobot(){
    let rob = document.getElementById("idRobotType").value;
    if(rob == "robotRandom")
        return new RobotRandom();
    else if(rob == "robotMiniMax")
        return new RobotMiniMax(8);
}

function initNewGame(){
    currentBoard = createBoard();
    robot = createRobot();
    document.getElementById("idWinnerCaption").innerText = "";
    document.getElementById("idWinnerImage").src = getImageSrc(0);
    updateBoardView(currentBoard);
}