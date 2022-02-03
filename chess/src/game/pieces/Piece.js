class Piece {

    constructor(color,
                moveVector,
                castlingRights,
                pieceName)
    {
        this.color = color;
        this.moveVector = moveVector;
        this.pieceName = pieceName;
        this.castlingRights = castlingRights;
    }

    /*
    Board is the simple FEN notation object
     */
    calculatePossibleMoves(board, i, j) {

        let possibleMoves = this.moveVector;
        let possiblePiecesToTake = this.calculatePossiblePiecesToTake();
        let output = possibleMoves;

        if(this.color === "black") {
            for(let k=0; k<possiblePiecesToTake.length; k++) {
                possiblePiecesToTake[k].toUpperCase();
            }
        }

        for(let x=0; x<possibleMoves.length; x++) {
            if(board[i+possibleMoves[x][0]][j+possibleMoves[x][1]] !== "0") {
                output.remove(x);
            }
        }

        return output;
    }

    calculatePossiblePiecesToTake() {
        return [
            "0",
            "r",
            "n",
            "b",
            "q",
            "p"
        ];
    }

}