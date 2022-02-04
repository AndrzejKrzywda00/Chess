class PossibleMovesCalculator {

    constructor(allMoves,
                pieceName,
                color,
                board,
                position,
                castlingRights,
                enPassantPossibilities)
    {
        this.board = board;
        this.moves = allMoves.get(pieceName.toLowerCase());
        this.castlingRights = castlingRights;
        this.enPassant = enPassantPossibilities;
        this.position = position;
        this.color = color;
        this.pieceName = pieceName;

        this.filteredMoves = this.calculate();
    }

    calculate() {

        let x = this.position.x;
        let y = this.position.y;
        let board = this.board;

        // reversing the y coordinates for the position
        if(this.color === "black") {
            this.moves.forEach(element => {
                element[0] = -1 * element[0];
                element[1] = -1 * element[1];
            });
        }

        let filteredMoves = Array.from(this.moves);

        let blackPieces = ["r","n","b","q","k","p"];
        let whitePieces = ["R","N","B","Q","K","P"];
        let piecesMoves = new Map();
        piecesMoves.set("black", blackPieces);
        piecesMoves.set("white", whitePieces);

        for(let i=0; i<this.moves.length; i++) {

            let move = this.moves[i];

            // 1st checking if the move doesn't go over the board
            if(y + move[0] < 0 || y + move[0] > 7 || x + move[1] < 0 || x + move[1] > 7) {
                filteredMoves = filteredMoves.filter(element => {
                    return element !== move;
                });
            }
            else {

                // finding if the spot is free to go or take opponent's piece
                // filtering out the possibility to take your own piece
                let yPosition = parseInt(y + move[0]);
                let xPosition = parseInt(x + move[1]);
                let playersPieces = piecesMoves.get(this.color);

                if(board[yPosition][xPosition] !== "0" && playersPieces.includes(board[yPosition][xPosition])) {
                    filteredMoves = filteredMoves.filter(element => {
                        return element !== move;
                    });
                }
                // check if the move is not blocked by any piece (for any piece that is not a knight)
                else {
                    if(this.pieceName.toLowerCase() !== "n") {

                        let yIterator = Math.sign(move[0]);
                        let xIterator = Math.sign(move[1]);
                        let limit = Math.max(Math.abs(move[0]), Math.abs(move[1]));
                    }

                }



            }

        }

        console.log(filteredMoves.length);

        filteredMoves.forEach(element => {
            console.log(element);
        });

        return filteredMoves;
    }

}

export default PossibleMovesCalculator;