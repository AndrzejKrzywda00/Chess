/*
This is the main class to calculate all the possible moves the selected piece can make in position.
 */
import {act} from "@testing-library/react";

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
        this.moves = allMoves.get(pieceName);
        this.castlingRights = castlingRights;
        this.enPassant = enPassantPossibilities;
        this.position = position;
        this.color = color;
        this.pieceName = pieceName;
    }

    calculate() {

        let x = this.position.x;
        let y = this.position.y;
        let board = this.board;
        let moves = this.moves;

        console.log(this.castlingRights);

        let blackPieces = ["r","n","b","q","k","p","e"];
        let whitePieces = ["R","N","B","Q","K","P","E"];
        let allMoves = new Map();
        allMoves.set("black", blackPieces);
        allMoves.set("white", whitePieces);

        let rejectedMoves = [];

        for(let i=0; i<moves.length; i++) {

            let move = moves[i];

            // 1st checking if the move doesn't go over the board
            if(y + move[0] < 0 || y + move[0] > 7 || x + move[1] < 0 || x + move[1] > 7) {
                rejectedMoves.push(move);
            }

            else {

                // finding if the spot is free to go or take opponent's piece
                // filtering out the possibility to take your own piece
                let yPosition = parseInt(y + move[0]);
                let xPosition = parseInt(x + move[1]);
                let playersPieces = allMoves.get(this.color);

                if(board[yPosition][xPosition] !== "0" && playersPieces.includes(board[yPosition][xPosition])) {
                    if(this.pieceName.toLowerCase() === "k" && move[0] === 0) {
                        if(move[1] !== 3 && move[1] !== -4) {
                            rejectedMoves.push(move);
                        }
                    }
                    else {
                        rejectedMoves.push(move);
                    }
                }

                // check if the move is not blocked by any piece (for any piece that is not a knight)
                if(this.pieceName.toLowerCase() !== "n") {

                    let yIterator = Math.sign(move[0]);
                    let xIterator = Math.sign(move[1]);
                    let currentX = x + xIterator;
                    let currentY = y + yIterator;

                    while(currentX !== xPosition || currentY !== yPosition) {
                        if(board[currentY][currentX] !== "0") {
                            rejectedMoves.push(move);
                        }
                        currentX += xIterator;
                        currentY += yIterator;
                    }
                }

                // filter out not permitted moves for a pawn
                if(this.pieceName.toLowerCase() === "p") {

                    // double move only on 6th rank for down and 1st rank for up
                    let allowedRank = this.color === "black" ? 1 : 6;
                    if(y !== allowedRank) {
                        if(Math.abs(move[0]) === 2) rejectedMoves.push(move);
                    }

                    // second removing taking the piece move, when there is no opponent
                    let oppositeColor = this.color === "white" ? "black" : "white";
                    let opponentPieces = allMoves.get(oppositeColor);

                    if(Math.abs(move[0]) === 1 && Math.abs(move[1]) === 1) {
                        if(!opponentPieces.includes(board[yPosition][xPosition])) {
                            rejectedMoves.push(move);
                        }
                    }

                    if(move[1] === 0) {
                        if(board[yPosition][xPosition] !== "0") {
                            rejectedMoves.push(move);
                        }
                    }

                }

                // remove all moves that are not valid for a king
                if(this.pieceName.toLowerCase() === "k") {

                    let activeCastleRight = null;
                    if(move[0] === 0) {
                        if(move[1] === 3) {
                            activeCastleRight = this.color === "white" ? "K" : "k";
                            if(!this.castlingRights.includes(activeCastleRight)) {
                                rejectedMoves.push(move);
                            }
                        }
                        if(move[1] === -4) {
                            activeCastleRight = this.color === "white" ? "Q" : "q";
                            if(!this.castlingRights.includes(activeCastleRight)) {
                                rejectedMoves.push(move);
                            }
                        }
                    }

                }

            }

        }

        let acceptedMoves = [];

        for(let i=0; i<moves.length; i++) {
            if (!rejectedMoves.includes(moves[i])) {
                acceptedMoves.push(moves[i]);
            }
        }

        return acceptedMoves;
    }

    calculatePositionsControlledByOpponent(opponentColor) {

        // so calculate all positions controlled by opponent
        // understood as: fields where opponent can move in next move + counting the fields on which are his pieces
        let allPieces = new Map();
        allPieces.set("white", ["R","B","N","Q","K","P"]);
        allPieces.set("black", ["r","b","n","q","k","p"]);

        let opponentPieces = allPieces.get(opponentColor);
        let possibleOpponentMoves = this.calculate();



    }


    getFilteredMoves() {
        return this.calculate();
    }

}

export default PossibleMovesCalculator;