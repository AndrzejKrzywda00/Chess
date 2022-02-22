import pieceMoveSound from "../../sounds/pieceMove.mp3";
import castleSound from "../../sounds/castling_sound_2 (2).mp3";
import Game from "../Game";
import Pieces from "../../util/Pieces";

/*
This handler takes care of all processes related to the sprite object that was dragged.
 */
export default function onDragEnd() {

    this.cursor = "grab";
    let scale = Game.scale;
    let pieces = new Pieces();

    try {

        let newX = Math.floor(this.data.getLocalPosition(this.parent).x/scale);
        let newY = Math.floor(this.data.getLocalPosition(this.parent).y/scale);

        let oldX = Math.floor(Game.startingX/scale);
        let oldY = Math.floor(Game.startingY/scale);

        if(newX < 0) {
            newX = 0;
        }
        if(newX > 7) {
            newX = 7;
        }
        if(newY > 7) {
            newY = 7;
        }
        if(newY < 0) {
            newY = 0;
        }

        let offset = [
            newY - oldY,
            newX - oldX
        ];

        // parameters to finish the move correctly
        let possibleMoves = Game.pieceMoves;
        let moveValid = false;
        let castling = {
            queenside: false,
            kingside: false
        };
        let enPassant = false;

        possibleMoves.forEach(element => {
            if(element[0] === offset[0] && element[1] === offset[1]) {
                moveValid = true;
            }
        });

        // checking if it was castling
        if(Game.boardSimplified[oldY][oldX].toLowerCase() === "k" && offset[0] === 0) {
            if(offset[1] === 3) {
                castling.kingside = true;
            }
            if(offset[1] === -4) {
                castling.queenside = true;
            }

        }

        if(Game.boardSimplified[oldY][oldX].toLowerCase() === "k") {
            if(offset[1] !== 3 && offset[1] !== -4) {
                let color = Game.boardSimplified[oldY][oldX].toLowerCase() === Game.boardSimplified[oldY][oldX] ? "black" : "white";
                let rights = [];
                if(color === "white") {
                    rights = ["Q","K"];
                }
                if(color === "black") {
                    rights = ["q","k"];
                }
                Game.castlingRights = Game.castlingRights.filter(right => {
                    return !rights.includes(right);
                });
            }
        }

        // clean all en_passants
        let columns = 8;
        let whiteRank = 5;
        let blackRank = 2;

        for(let i=0; i<columns; i++) {
            if(Game.boardSimplified[blackRank][i] === "e") {
                Game.boardSimplified[blackRank][i] = "0";
            }
            if(Game.boardSimplified[whiteRank][i] === "E") {
                Game.boardSimplified[whiteRank][i] = "0";
            }
        }

        // checking if it was en passant move
        if(Game.boardSimplified[oldY][oldX].toLowerCase() === "p" && Math.abs(offset[0]) === 2) {
            enPassant = true;
        }

        if(moveValid) {

            // inform finisher that can take piece
            Game.moveValid = true;

            if(castling.queenside) {
                newX +=2;
            }
            if(castling.kingside) {
                newX -= 1;
            }

            // updating the coordinates of the sprite
            this.x = (newX*scale) + scale/2;
            this.y = (newY*scale) + scale/2;

            // updating the board object
            let pieceSymbol = Game.boardSimplified[oldY][oldX];

            // setting up new position in the virtual board
            Game.boardSimplified[oldY][oldX] = "0";
            Game.boardSimplified[newY][newX] = pieceSymbol;

            // updating the position of the appropriate king
            if(pieceSymbol === pieces.PieceName.BlackKing) {
                Game.blackKingPosition = {i: newY, j: newX};
            }
            if(pieceSymbol === pieces.PieceName.WhiteKing) {
                Game.whiteKingPosition = {i: newY, j: newX};
            }

            // additionally moving the rook
            if(castling.queenside) {
                let additionalCastleToRemove = null;
                let oldRookY = pieceSymbol === pieceSymbol.toLowerCase() ? 0 : 7;
                let oldRookX = 0;
                Game.boardSimplified[oldRookY][oldRookX] = "0";
                let newRookX = oldRookX + 3;
                Game.boardSimplified[oldRookY][newRookX] = pieceSymbol === pieceSymbol.toLowerCase() ? "r" : "R";
                if(pieceSymbol === pieceSymbol.toLowerCase()) {
                    Game.lastCastleData = "q";
                    additionalCastleToRemove = "k";
                }
                else {
                    Game.lastCastleData = "Q";
                    additionalCastleToRemove = "K";
                }
                Game.castlingRights = Game.castlingRights.filter(right => {
                    return right !== Game.lastCastleData;
                });
                Game.castlingRights = Game.castlingRights.filter(right => {
                    return right !== additionalCastleToRemove;
                });
            }
            if(castling.kingside) {
                let additionalCastleToRemove = null;
                let oldRookY = pieceSymbol === pieceSymbol.toLowerCase() ? 0 : 7;
                let oldRookX = 7;
                Game.boardSimplified[oldRookY][oldRookX] = "0";
                let newRookX = oldRookX - 2;
                Game.boardSimplified[oldRookY][newRookX] = pieceSymbol === pieceSymbol.toLowerCase() ? "r" : "R";
                if(pieceSymbol === pieceSymbol.toLowerCase()) {
                    Game.lastCastleData = "k";
                    additionalCastleToRemove = "q";
                }
                else {
                    Game.lastCastleData = "K";
                    additionalCastleToRemove = "Q";
                }
                Game.castlingRights = Game.castlingRights.filter(right => {
                    return right !== Game.lastCastleData;
                });
                Game.castlingRights = Game.castlingRights.filter(right => {
                    return right !== additionalCastleToRemove;
                });
            }

            if(enPassant) {
                let yVector = pieceSymbol.toLowerCase() === pieceSymbol ? -1 : 1;
                Game.boardSimplified[newY+yVector][newX] = pieceSymbol.toLowerCase() === pieceSymbol ? "e" : "E";
            }

            // playing the sound of the move
            if(!castling.kingside && !castling.queenside) {
                let audio = new Audio(pieceMoveSound);
                audio.play().catch();
            }
            else {
                let audio = new Audio(castleSound);
                audio.play().catch();
            }

            // saving the last position
            Game.lastX = newX;
            Game.lastY = newY;
        }
        else {
            this.x = Game.startingX;
            this.y = Game.startingY;
        }
    } catch(exception) {}

    this.zIndex = 65;
    this.dragging = false;
    this.data = null;

}