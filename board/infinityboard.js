class InfinityBoard extends BaseBoard{
    constructor(){
        super();
        this.cells = [[0,0,0],[0,0,0],[0,0,0]];
    }

    getWinner() {
        let marksInRow = 5;
        let rc = this.rowsCount;
        let cc = this.colsCount;
        var cnt = 0;
        // check rows
        for(var r = 0; r < rc; r++)
        {
            let v = this.cells[r][0];
            cnt = 0;
            for(var c = 0; c < cc; cc++){
                if((this.cells[r][c] == v)&&(v > 0)){
                    cnt++;
                    if(cnt == marksInRow){
                        return v;
                    }
                }
                else
                {
                    v = this.cells[r][c];
                    cnt == 0;
                }
            }
        }
        // check columns
        for(var c = 0; c < cc; c++)
        {
            let v = this.cells[0][c];
            cnt = 0;
            for(var r = 0; r < rc; r++){
                if((this.cells[r][c] == v)&&(v > 0)){
                    cnt++;
                    if(cnt == marksInRow){
                        return v;
                    }
                }
                else
                {
                    v = this.cells[r][c];
                    cnt == 0;
                }
            }
        }
        //check diagonal
        let dStart = marksInRow -1;
        let dEnd = cc + rc - marksInRow - 1;
        for(var d = dStart; d <= dEnd; d++){
            let r = Math.Min(d, rc - 1);
            let c = Math.Max(0, d -r);
            let v = this.cells[r][c];
            let L = cc - c - 1;
            cnt = 0;
            for(var i = 0; i <= L; i++)
            {
                if((this.cells[r-i][c+i] == v)&&(v > 0)){
                    cnt++;
                    if(cnt == marksInRow){
                        return v;
                    }
                }
                else
                {
                    v = this.cells[r-i][c+i];
                    cnt == 0;
                }
            }
        }
        dStart = marksInRow - rc;
        dEnd = cc - marksInRow;
        for(var d = dStart; d <= dEnd; d++){
            let r = Math.Max(0, -d);
            let c = r + d;
            let v = this.cells[r][c];
            let L = Math.Min(rc - r, cc - c) - 1;
            cnt = 0;
            for(var i = 0; i <= L; i++)
            {
                if((this.cells[r+i][c+i] == v)&&(v > 0)){
                    cnt++;
                    if(cnt == marksInRow){
                        return v;
                    }
                }
                else
                {
                    v = this.cells[r+i][c+i];
                    cnt == 0;
                }
            }
        }

        return 0;
    }

    gameOver(){
        return this.getWinner() != 0;
    }

    getDiagonalScoreForPlayer(player){
        return 0;
    }

    getRowScoreForPlayer(row, player){
        return 0;
    }

    getColumnScoreForPlayer(col, player){
        return 0;
    }

}