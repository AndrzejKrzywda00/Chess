class Piece {

    constructor(color,
                moveVectors,
                castlingRights,
                pieceName)
    {
        this.color = color;
        this.moveVector = moveVectors;
        this.pieceName = pieceName;
        this.castlingRights = castlingRights;
    }

    /*
    Board is the simple FEN notation object
     */
    calculatePossibleMoves(board, i, j) {

        let possibleMoves = this.moveVector.get(this.pieceName.toLowerCase());
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

        // return possible vectors to apply
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

export default Piece;