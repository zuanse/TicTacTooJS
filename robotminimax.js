//import { BaseRobot } from "./baserobot.js";

class RobotMiniMax extends BaseRobot{
    constructor(depth){
        super();
        this.maxDepth = depth;
    }
    makeMove(board){
        let moves = this.getPossibleMoves(board);
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
            let score = this.makeMoveForPlayer(board, player, false, opponent, this.maxDepth-1);
            board.cells[row][col] = 0;
            if(score > bestScore)
            {
                bestScore = score;
                bestMove = moves[i];
            }
        }
        board.makeMove(bestMove[0], bestMove[1]);    
    }

    getPossibleMoves(board){
        var emptyCells = [];
        for(var r = 0; r < board.rowsCount; r++){
            for(var c =0; c < board.colsCount; c++){
                if(board.cells[r][c] == 0){
                    emptyCells = emptyCells.concat([[r,c]]);
                }
            }
        }
        return emptyCells;
    }
    makeMoveForPlayer(board, player, maximizing, playerTurn, depth)
    {
        let opponent = board.opponent(playerTurn);
        if(depth == 0 || board.gameOver()){
            let score = this.boardScore(board, player, depth);
            return score;
        }   
        let moves = this.getPossibleMoves(board);
        if(maximizing){
            var bestScore = -200000;
            for(var i = 0; i < moves.length; i++){
                let [row, col] = moves[i];
                board.cells[row][col] = playerTurn;
                let score = this.makeMoveForPlayer(board, player, ! maximizing, opponent, depth - 1);
                board.cells[row][col] = 0;
                bestScore = Math.max(bestScore, score);
            }        
        }
        else{
            var bestScore = 200000;
            for(var i = 0; i < moves.length; i++){
                let [row, col] = moves[i];
                board.cells[row][col] = playerTurn;
                let score = this.makeMoveForPlayer(board, player, ! maximizing, opponent, depth - 1);
                board.cells[row][col] = 0;
                bestScore = Math.min(bestScore, score);
            }    
        }
        return bestScore;
    }

    boardScore(board, player, depth){
        let opponent = board.opponent(player);
        let playerScore = board.playerScore(player);
        let opponentScore = board.playerScore(opponent);
        return playerScore - opponentScore + depth;
    }

}

//export {RobotMiniMax};