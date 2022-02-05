/*
This is the main class to calculate all the possible moves the selected piece can make in position.
 */
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

        // TODO -- optimize this to make less operations, and be quicker

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
                if(this.pieceName.toLowerCase() !== "n") {

                    let yIterator = Math.sign(move[0]);
                    let xIterator = Math.sign(move[1]);
                    let currentX = x + xIterator;
                    let currentY = y + yIterator;

                    while(currentX !== xPosition || currentY !== yPosition) {
                        if(board[currentY][currentX] !== "0") {

                            filteredMoves = filteredMoves.filter(element => {
                                return element !== move;
                            });
                        }
                        currentX += xIterator;
                        currentY += yIterator;
                    }
                }

                // filter out not permitted moves for a pawn
                if(this.pieceName.toLowerCase() === "p") {

                    // first en-passant
                    if(y !== 6) {
                        filteredMoves = filteredMoves.filter(move => {
                            return move[0] !== -2;
                        });
                    }

                    // second removing taking the piece move, when there is no opponent
                    let oppositeColor = this.color === "white" ? "black" : "white";
                    let opponentPieces = piecesMoves.get(oppositeColor);

                    if(move[0] === -1 && move[1] === -1) {
                        if(!opponentPieces.includes(board[y-1][x-1])) {
                            filteredMoves = filteredMoves.filter(activeMove => {
                                return activeMove !== move;
                            });
                        }
                    }

                    if(move[0] === -1 && move[1] === 1) {
                        if(!opponentPieces.includes(board[y-1][x+1])) {
                            filteredMoves = filteredMoves.filter(activeMove => {
                                return activeMove !== move;
                            });
                        }
                    }

                    if(move[1] === 0) {
                        if(move[0] === -1 && y-1 >= 0) {
                            if(board[y-1][x] !== "0") {
                                filteredMoves = filteredMoves.filter(activeMove => {
                                   return activeMove !== move;
                                });
                            }
                        }
                        if(move[0] === -2 && y-2 >= 0) {
                            if(board[y-2][x] !== "0") {
                                filteredMoves = filteredMoves.filter(activeMove => {
                                    return activeMove !== move;
                                })
                            }
                        }
                    }

                }

            }

        }

        return filteredMoves;
    }

}

export default PossibleMovesCalculator;