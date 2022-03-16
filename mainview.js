function Board(){
    this.cells = [[0,0,0],[0,0,0],[0,0,0]];
    this.turn = 1;
    this.makeMove = function(r, c){
        if(this.cells[r][c] != 0){
            return false;
        }
        this.cells[r][c] = this.turn;
        this.turn = this.turn == 1 ? 2: 1;
        return true;
    }
    this.getWinner = function(){
        // check rows
        for(var r = 0; r < 3; r++)
        {
            let v = this.cells[r][1];
            if(this.cells[r][0] == v && v == this.cells[r][2])
            {
                return v;
            }
        }
        // check columns
        for(var c = 0; c < 3; c++)
        {
            let v = this.cells[1][c];
            if(this.cells[0][c] == v && v == this.cells[2][c])
            {
                return v;
            }
        }
        //check diagonal
        let v = this.cells[1][1];
        if (this.cells[0][0] == v && this.cells[2][2] == v)
        {
            return v;
        }
        if (this.cells[2][0] == v && this.cells[0][2] == v)
        {
            return v;
        }
        return 0;
    }

    this.gameOver = function(){
        if(this.getWinner() != 0)
            return true;
        return this.cells.flat().every((v) => v > 0);
    }
}

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

var currentBoard = new Board();
updateBoardView(currentBoard)

function onCellClick(r, c){
    if(currentBoard.gameOver())
        return;
    if(!currentBoard.makeMove(r, c)){
        return;
    }
    updateBoardView(currentBoard);
    onPlayerMoveDone();
   
    if(!currentBoard.gameOver()){
        //aiRandomMakeMove(currentBoard);
        aiMinMaxMakeMove(currentBoard, 8);
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
    currentBoard = new Board();
    document.getElementById("idWinnerCaption").innerText = "";
    document.getElementById("idWinnerImage").src = getImageSrc(0);

    if(document.getElementById("idFirstMove").value == "robot")
    {
        aiMinMaxMakeMove(currentBoard, 8);
    }
    updateBoardView(currentBoard);
}


function aiRandomMakeMove(board){
    let moves = aiGetPossibleMoves(board);
    let ind = Math.floor(Math.random() * moves.length );
    let [row, col] = emptyCells[ind];
    board.makeMove(row, col);
}

function aiGetPossibleMoves(board){
    var emptyCells = [];
    for(var r = 0; r < 3; r++){
        for(var c =0; c < 3; c++){
            if(board.cells[r][c] == 0){
                emptyCells = emptyCells.concat([[r,c]]);
            }
        }
    }
    return emptyCells;
}

function aiMinMaxMakeMove(board, depth){
    let moves = aiGetPossibleMoves(board);
    if(moves.length == 0){
        return;
    }
    var bestMove;
    var bestScore = -200000;
    let player = board.turn;
    let opponent = player == 1? 2 : 1;
    for(var i = 0; i < moves.length; i++){
        let [row, col] = moves[i];
        board.cells[row][col] = player;
        let score = aiMinMaxMakeMoveForPlayer(board, player, false, opponent, depth-1);
        board.cells[row][col] = 0;
        if(score > bestScore)
        {
            bestScore = score;
            bestMove = moves[i];
        }
    }
    board.makeMove(bestMove[0], bestMove[1]);
}

function aiMinMaxMakeMoveForPlayer(board, player, maximizing, playerTurn, depth)
{
    let opponent = playerTurn == 1? 2 : 1;
    if(depth == 0 || board.gameOver()){
        let score = aiMinMaxBoardScore(board, player);
        //console.log(maximizing, player, score);
        //console.log(board.cells);
        return score;
    }   
    let moves = aiGetPossibleMoves(board);
    if(maximizing){
        var bestScore = -200000;
        for(var i = 0; i < moves.length; i++){
            let [row, col] = moves[i];
            board.cells[row][col] = playerTurn;
            let score = aiMinMaxMakeMoveForPlayer(board, player, ! maximizing, opponent, depth - 1);
            board.cells[row][col] = 0;
            bestScore = Math.max(bestScore, score);
        }        
    }
    else{
        var bestScore = 200000;
        for(var i = 0; i < moves.length; i++){
            let [row, col] = moves[i];
            board.cells[row][col] = playerTurn;
            let score = aiMinMaxMakeMoveForPlayer(board, player, ! maximizing, opponent, depth - 1);
            board.cells[row][col] = 0;
            bestScore = Math.min(bestScore, score);
        }    
    }
    return bestScore;
}

function aiMinMaxBoardScore(board, player){
    let opponent = player == 1? 2 : 1;
    let playerScore = aiPlayerScore(board, player);
    let opponentScore = aiPlayerScore(board, opponent);
    return playerScore - opponentScore;
}

function aiPlayerScore(board, player){
    let winner = board.getWinner();
    if( winner == player){
        return 1000;
    }
    let opponent = player == 1? 2 : 1;
    if(winner == opponent){
        return -1000;
    }
    var score = aiGetDiagonalScoreForPlayer(board, player);
    for(var i = 0; i< 3; i ++){
        score += aiGetRowScoreForPlayer(board, i, player);
        score += aiGetColumnScoreForPlayer(board, i, player);
    }

    return score;
}

function aiGetRowScoreForPlayer(board, row, player){
    var cnt = 0;
    for(var col =0; col < 3; col++){
        if(board.cells[row][col] == player)
        {
            cnt++;
        }
        else if (board.cells[row][col] >0)
        {
            return 0;
        }
    }
    return cnt * 10;
}

function aiGetColumnScoreForPlayer(board, col, player){
    var cnt = 0;
    for(var row =0; row < 3; row++){
        if(board.cells[row][col] == player)
        {
            cnt++;
        }
        else if (board.cells[row][col] >0)
        {
            return 0;
        }
    }
    return cnt * 10;
}

function aiGetDiagonalScoreForPlayer(board, player){
    var cntMain = 0;
    var multMain = 10;
    var cntAlter = 0;
    var multAlter = 10;
    for(var row =0; row < 3; row++){
        if(board.cells[row][row] == player)
        {
            cntMain++;
        }
        else if (board.cells[row][row] >0)
        {
            multMain = 0;
        }
        if(board.cells[row][2 - row] == player)
        {
            cntAlter++;
        }
        else if (board.cells[row][2 - row] >0)
        {
            multAlter = 0;
        }
    }
    return cntMain * multMain + cntAlter * multAlter;
}
