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
            let [row, col, free] = moves[i];
            board.cells[row][col] = player;
            moves[i][2] = 1;
            let score = this.makeMoveForPlayer(board, player, false, opponent, this.maxDepth-1, moves);
            //let score = this.makeMoveForPlayer(board, player, false, opponent, moves.length - 1, moves);
            moves[i][2] = 0;
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
        let m = 1; // margin
        let rc = board.rowsCount;
        let cc = board.colsCount;
        var minR = rc;
        var maxR = 0;
        var minC = cc;
        var maxC = 0;
        // get surround rect
        for(var r = 0; r < rc; r++){
            for(var c =0; c < board.colsCount; c++){
                if(board.cells[r][c] != 0){
                    minR = Math.min(minR, r);
                    maxR = Math.max(maxR, r);
                    minC = Math.min(minC, c);
                    maxC = Math.max(maxC, c);
                }
            }
        }
        if(minC > maxC){
            // empty board
            minR = Math.trunc(rc / 2);
            maxR = minR;
            minC = Math.trunc(cc / 2);
            maxC = minC;
        }
        minR = Math.max(minR - m, 0);
        maxR = Math.min(maxR + m, rc-1);
        minC = Math.max(minC - m, 0);
        maxC = Math.min(maxC + m, cc-1);

        var emptyCells = [];
        for(var r = minR; r <= maxR; r++){
            for(var c =minC; c <= maxC; c++){
                if(board.cells[r][c] == 0){
                    emptyCells = emptyCells.concat([[r,c,0]]);
                }
            }
        }
        return emptyCells;
    }
    makeMoveForPlayer(board, player, maximizing, playerTurn, depth, moves)
    {
        let opponent = board.opponent(playerTurn);
        if(depth == 0 || board.gameOver()){
            let score = this.boardScore(board, player, depth);
            return score;
        }   
        var noMoves = true;
        var bestScore;
        if(maximizing){
            bestScore = -200000;
            for(var i = 0; i < moves.length; i++){
                let [row, col, free] = moves[i];
                if(free == 1)
                    continue;
                noMoves = false;
                board.cells[row][col] = playerTurn;
                moves[i][2] = 1;
                let score = this.makeMoveForPlayer(board, player, ! maximizing, opponent, depth - 1, moves);
                moves[i][2] = 0;
                board.cells[row][col] = 0;
                bestScore = Math.max(bestScore, score);
            }        
        }
        else{
            bestScore = 200000;
            for(var i = 0; i < moves.length; i++){
                let [row, col, free] = moves[i];
                if(free == 1)
                    continue;
                noMoves = false;
                board.cells[row][col] = playerTurn;
                moves[i][2] = 1;
                let score = this.makeMoveForPlayer(board, player, ! maximizing, opponent, depth - 1, moves);
                moves[i][2] = 0;
                board.cells[row][col] = 0;
                bestScore = Math.min(bestScore, score);
            }    
        }
        if(noMoves)
            bestScore = this.boardScore(board, player, depth);
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