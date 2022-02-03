class King extends Piece {

    constructor(props) {
        super(props);
        this.canCastleKingSide = true;
        this.canCastleQueenSide = true;
        this.color = props.color;
    }

    /*
    Board is the simple FEN notation object
     */
    calculatePossibleMoves(board, i, j) {

        let possible_moves = [
            [-1,-1],
            [-1,0],
            [0,-1],
            [1,-1],
            [1,1],
            [0,1],
            [0,0],
            [-1,1],
            [1,0]
        ];

        let possiblePieces = [
          "0",
          "r",
          "n",
          "b",
          "q",
          "p"
        ];

        let output = possible_moves;

        if(this.color === "black") {
            for(let k=0; k<possiblePieces.length; k++) {
                possiblePieces[k].toUpperCase();
            }
        }

        for(let x=0; x<possible_moves.length; x++) {
            if(board[i+possible_moves[x][0]][possible_moves[x][1]] !== "0") {
                output.remove(x);
            }
        }

        return output;
    }

}