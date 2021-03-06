class InfinityBoard extends BaseBoard{
    constructor(){
        super();
        let dim = 30;
        this.cells = new Array(dim);
        for(var i =0; i < dim; i++){
            this.cells[i] = new Array(dim).fill(0);
        }
        this.marksInRow = 5;
    }

    getWinner() {
        let rc = this.rowsCount;
        let cc = this.colsCount;
        var cnt = 0;
        // check rows
        for(var r = 0; r < rc; r++)
        {
            let v = this.cells[r][0];
            cnt = 0;
            for(var c = 0; c < cc; c++){
                if((this.cells[r][c] == v)&&(v > 0)){
                    cnt++;
                    if(cnt == this.marksInRow){
                        return v;
                    }
                }
                else
                {
                    v = this.cells[r][c];
                    cnt == 0;
                    if(v > 0){
                        cnt += 1;
                    }
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
                    if(cnt == this.marksInRow){
                        return v;
                    }
                }
                else
                {
                    v = this.cells[r][c];
                    cnt == 0;
                    if(v > 0){
                        cnt += 1;
                    }
                }
            }
        }
        //check diagonal
        let dStart = this.marksInRow -1;
        let dEnd = cc + rc - this.marksInRow - 1;
        for(var d = dStart; d <= dEnd; d++){
            let r = Math.min(d, rc - 1);
            let c = Math.max(0, d -r);
            let v = this.cells[r][c];
            let L = Math.min(cc - 1, d) - c;
            cnt = 0;
            for(var i = 0; i <= L; i++)
            {
                if((this.cells[r-i][c+i] == v)&&(v > 0)){
                    cnt++;
                    if(cnt == this.marksInRow){
                        return v;
                    }
                }
                else
                {
                    v = this.cells[r-i][c+i];
                    cnt == 0;
                    if(v > 0){
                        cnt += 1;
                    }
                }
            }
        }
        dStart = this.marksInRow - rc;
        dEnd = cc - this.marksInRow;
        for(var d = dStart; d <= dEnd; d++){
            let r = Math.max(0, -d);
            let c = r + d;
            let v = this.cells[r][c];
            let L = Math.min(rc - 1 + d, cc - 1) - c;
            cnt = 0;
            for(var i = 0; i <= L; i++)
            {
                if((this.cells[r+i][c+i] == v)&&(v > 0)){
                    cnt++;
                    if(cnt == this.marksInRow){
                        return v;
                    }
                }
                else
                {
                    v = this.cells[r+i][c+i];
                    cnt == 0;
                    if(v > 0){
                        cnt += 1;
                    }
                }
            }
        }

        return 0;
    }

    gameOver(){
        return this.getWinner() != 0;
    }

    getDiagonalScoreForPlayer(player){
        let cc = this.colsCount;
        let rc = this.rowsCount;
        let dStart = this.marksInRow -1;
        let dEnd = cc + rc - this.marksInRow - 1;
        let opp = this.opponent(player);
        let score = 0;
        for(var d = dStart; d <= dEnd; d++){
            let r = Math.min(d, rc - 1);
            let c = Math.max(0, d -r);
            let v = this.cells[r][c];
            let L = Math.min(cc - 1, d) - c;
            let scoreBuilder = new LinePatternScoreBuilder(player, opp);
            for(var i = 0; i <= L; i++)
            {
                scoreBuilder.putMark(this.cells[r-i][c+i]);
            }
            score += scoreBuilder.score;
        }
        dStart = this.marksInRow - rc;
        dEnd = cc - this.marksInRow;
        for(var d = dStart; d <= dEnd; d++){
            let r = Math.max(0, -d);
            let c = r + d;
            let v = this.cells[r][c];
            let L = Math.min(rc - 1 + d, cc - 1) - c;
            let scoreBuilder = new LinePatternScoreBuilder(player, opp);
            for(var i = 0; i <= L; i++)
            {
                scoreBuilder.putMark(this.cells[r+i][c+i]);
            }
            score += scoreBuilder.score;
        }
        return score;
    }

    getRowScoreForPlayer(row, player){
        let cc = this.colsCount;
        let opp = this.opponent(player);
        let scoreBuilder = new LinePatternScoreBuilder(player, opp);
        for(var c = 0; c < cc; c++){
            scoreBuilder.putMark(this.cells[row][c]);
        }
        return scoreBuilder.score;
    }

    getColumnScoreForPlayer(col, player){
        let rc = this.rowsCount;
        let opp = this.opponent(player);
        let scoreBuilder = new LinePatternScoreBuilder(player, opp);
        for(var r = 0; r < rc; r++){
            scoreBuilder.putMark(this.cells[r][col]);
        }
        return scoreBuilder.score;
    }

}

class LinePatternScoreBuilder {
    constructor(player, opponent, marksInRow){
        this.prev = 1;
        this.player = player;
        this.opponent = opponent;
        this.newPatt = true;
        this.score = 0;
        this.bounds = 0;
        this.length = 0;
        this.marksInRow = marksInRow;
    }

    putMark(mark){
        if(mark == this.player){
            if(this.newPatt){
                this.newPatt = false;
                this.bounds = this.prev;
                this.length = 1;
            }
            else {
                this.length++;
            }
        }
        else if(mark == this.opponent)
        {
            if(this.newPatt){
                this.prev = 0;
            }
            else{
                this.score += this.getPatternScore();
                this.setNewPatt(0);
             }
        }
        else {
            if(this.newPatt){
                this.prev = 1;
            }
            else {
                this.bounds++;
                this.score += this.getPatternScore();
                this.setNewPatt(1);
            }
        }
    }

    setNewPatt(prevValue){
        this.prev = prevValue;
        this.length = 0;
        this.bounds = 0;
        this.newPatt = true;
    }
    
    getPatternScore(){
        if(this.length == this.marksInRow)
            return 1000;
        if(this.bounds = 0){
            return 0;
        }
        return 2 * (this.length - 1) + this.bounds;

    }

}