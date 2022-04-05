class BaseBoard{
    constructor(){
        this.turn = 1;
        this.cells =[];
    }
    makeMove(r, c){
        if((r <0)|| (this.cells.length <= r)){
            return false;
        }
        if((c <0) || (this.cells[r].length <= c)){
            return false;
        }
        if(this.cells[r][c] != 0){
            return false;
        }
        this.cells[r][c] = this.turn;
        this.turn = this.opponent(this.turn);
        return true;
    }

    getWinner() {
        return 0;
    }

    gameOver(){
        return true;
    }

    opponent(player){
        return player == 1? 2 : 1;
    }

    playerScore(player)
    {
        // let winner = this.getWinner();
        // if(winner == player){
        //     return 1000;
        // }
        // let opponent = this.opponent(player);
        // if(winner == opponent){
        //     return -1000;
        // }
        var score = this.getDiagonalScoreForPlayer(player);
        let rc = this.rowsCount;
        for(var i = 0; i < rc; i ++){
            score += this.getRowScoreForPlayer(i, player);
            score += this.getColumnScoreForPlayer(i, player);
        }
        return score;
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

    get rowsCount(){
        return this.cells.length;
    }

    get colsCount(){
        return (this.cells.length>0)? this.cells[0].length: 0;
    }
}

//export { BaseBoard};