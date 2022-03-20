//import { BaseBoard } from './baseboard.js';

class EasyBoard extends BaseBoard{
    constructor(){
        super();
        this.cells = [[0,0,0],[0,0,0],[0,0,0]];
    }
    getWinner() {
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

    gameOver(){
        if(this.getWinner() != 0)
            return true;
        return this.cells.flat().every((v) => v > 0);
    }

    getRowScoreForPlayer(row, player){
        var cnt = 0;
        let rc = this.rowsCount;
        for(var col =0; col < rc; col++){
            if(this.cells[row][col] == player)
            {
                cnt++;
            }
            else if (this.cells[row][col] >0)
            {
                return 0;
            }
        }
        return cnt * 10;
    }
    
    getColumnScoreForPlayer(col, player){
        var cnt = 0;
        let rc = this.rowsCount;
        for(var row =0; row < rc; row++){
            if(this.cells[row][col] == player)
            {
                cnt++;
            }
            else if (this.cells[row][col] >0)
            {
                return 0;
            }
        }
        return cnt * 10;
    }
    
    getDiagonalScoreForPlayer(player){
        var cntMain = 0;
        var multMain = 10;
        var cntAlter = 0;
        var multAlter = 10;
        let rc = this.rowsCount;
        for(var row =0; row < rc; row++){
            if(this.cells[row][row] == player)
            {
                cntMain++;
            }
            else if (this.cells[row][row] >0)
            {
                multMain = 0;
            }
            if(this.cells[row][rc - 1 - row] == player)
            {
                cntAlter++;
            }
            else if (this.cells[row][rc - 1 - row] >0)
            {
                multAlter = 0;
            }
        }
        return cntMain * multMain + cntAlter * multAlter;
    }    
}

//export {EasyBoard};