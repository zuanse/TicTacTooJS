class RobotAlphaBeta extends BaseRobot{
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
        var bestScore = -Infinity;
        let player = board.turn;
        let opponent = board.opponent(player);
        for(var i = 0; i < moves.length; i++){
            let [row, col, free] = moves[i];
            board.cells[row][col] = player;
            let score = this.alphabeta(board, player, opponent, this.maxDepth-1, -Infinity, Infinity, false);
            board.cells[row][col] = 0;
            if(score >= bestScore)
            {
                bestScore = score;
                bestMove = moves[i];
            }
        }
        board.makeMove(bestMove[0], bestMove[1]);
    }
    alphabeta(board, player, playerTurn, depth, alpha, beta, maximizing){
        if(depth == 0){
            let score = this.boardScore(board, player, this.maxDepth - depth);
            return score;
        }
        //if node is a terminal node then
        //return the heuristic value of node
        let moves = this.getPossibleMoves(board);
        if(moves.length == 0)
        {
            let score = this.boardScore(board, player, this.maxDepth - depth);
            return score;           
        }
        let opponent = board.opponent(playerTurn);
        if(maximizing)
        {
            var value = -Infinity;
            for(var i = 0; i < moves.length; i++){
                let [row, col, free] = moves[i];
                board.cells[row][col] = playerTurn;
                value = Math.max(value, this.alphabeta(board, player, opponent, depth -1, alpha, beta, !maximizing));
                board.cells[row][col] = 0;
                if(value >= beta)
                    break;
                alpha = Math.max(alpha, value);
            }
            return value;
        }
        else
        {
            var value = Infinity;
            for(var i = 0; i < moves.length; i++){
                let [row, col, free] = moves[i];
                board.cells[row][col] = playerTurn;
                value = Math.min(value, this.alphabeta(board, player, opponent, depth -1, alpha, beta, !maximizing));
                board.cells[row][col] = 0;
                if(value <= alpha)
                    break;
                beta = Math.min(beta, value);
            }
            return value
        }
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
            return [[maxR,maxC,0]];

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
    boardScore(board, player, depth){
        let opponent = board.opponent(player);
        let playerScore = board.playerScore(player);
        let opponentScore = board.playerScore(opponent);
        return playerScore - opponentScore + depth;
    }
}