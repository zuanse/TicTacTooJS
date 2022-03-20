//import {BaseBoard} from './baserobot.js';
class RobotRandom extends BaseRobot{
    makeMove(board){
        let moves = this.getPossibleMoves(board);
        let ind = Math.floor(Math.random() * moves.length );
        let [row, col] = moves[ind];
        board.makeMove(row, col);
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
}

//export {RobotRandom};