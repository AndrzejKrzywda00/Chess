import Pieces from "../../util/Pieces";

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
                enPassantPossibilities,
                blackKingPosition,
                whiteKingPosition)
    {
        this.board = board;
        this.moves = allMoves.get(pieceName);
        this.castlingRights = castlingRights;
        this.enPassant = enPassantPossibilities;
        this.position = position;
        this.color = color;
        this.pieceName = pieceName;
        this.whiteKingPostion = whiteKingPosition;
        this.blackKingPosition = blackKingPosition;
    }

    calculate() {

        console.log(this.whiteKingPostion);
        console.log(this.blackKingPosition);

        let pieces = new Pieces();
        let symbols = pieces.PieceName;

        let x = this.position.x;
        let y = this.position.y;
        let board = this.board;
        let moves = this.moves;

        // creating map of pairs
        // "color" => [array of symbols of pieces]
        let blackPieces = ["r","n","b","q","k","p","e"];
        let whitePieces = ["R","N","B","Q","K","P","E"];
        let allMoves = new Map();
        allMoves.set(pieces.PieceColor.Black, blackPieces);
        allMoves.set(pieces.PieceColor.White, whitePieces);

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

                if (board[yPosition][xPosition] !== symbols.Empty && playersPieces.includes(board[yPosition][xPosition])) {

                    if (this.pieceName.toLowerCase() === symbols.BlackKing && move[0] === 0)
                    {
                        if(move[1] !== 3 && move[1] !== -4) {
                            rejectedMoves.push(move);
                        }
                    }
                    else {
                        rejectedMoves.push(move);
                    }
                }

                // check if the move is not blocked by any piece (for any piece that is not a knight)
                if(this.pieceName.toLowerCase() !== symbols.BlackKnight) {

                    let yIterator = Math.sign(move[0]);
                    let xIterator = Math.sign(move[1]);
                    let currentX = x + xIterator;
                    let currentY = y + yIterator;

                    while(currentX !== xPosition || currentY !== yPosition) {
                        if(board[currentY][currentX] !== symbols.Empty) {
                            rejectedMoves.push(move);
                        }
                        currentX += xIterator;
                        currentY += yIterator;
                    }
                }

                // filter out not permitted moves for a pawn
                if(this.pieceName.toLowerCase() === symbols.BlackPawn) {

                    // double move only on 6th rank for down and 1st rank for up
                    let allowedRank = this.color === pieces.PieceColor.Black ? 1 : 6;
                    if(y !== allowedRank) {
                        if(Math.abs(move[0]) === 2) rejectedMoves.push(move);
                    }

                    // second removing taking the piece move, when there is no opponent
                    let oppositeColor = this.color === pieces.PieceColor.White ? pieces.PieceColor.Black : pieces.PieceColor.White;
                    let opponentPieces = allMoves.get(oppositeColor);

                    if(Math.abs(move[0]) === 1 && Math.abs(move[1]) === 1) {
                        if(!opponentPieces.includes(board[yPosition][xPosition])) {
                            rejectedMoves.push(move);
                        }
                    }

                    if(move[1] === 0) {
                        if(board[yPosition][xPosition] !== symbols.Empty) {
                            rejectedMoves.push(move);
                        }
                    }

                }

                // remove all moves that are not valid for a king
                if(this.pieceName.toLowerCase() === symbols.BlackKing) {

                    let activeCastleRight = null;
                    if(move[0] === 0) {
                        if(move[1] === 3) {
                            activeCastleRight = this.color === pieces.PieceColor.White ? symbols.WhiteKing : symbols.BlackKing;
                            if(!this.castlingRights.includes(activeCastleRight)) {
                                rejectedMoves.push(move);
                            }
                        }
                        if(move[1] === -4) {
                            activeCastleRight = this.color === pieces.PieceColor.White ? symbols.WhiteQueen : symbols.BlackQueen;
                            if(!this.castlingRights.includes(activeCastleRight)) {
                                rejectedMoves.push(move);
                            }
                        }
                    }

                }

                /*
                let virtualBoard = this.board;
                virtualBoard[yPosition][xPosition] = this.pieceName;
                virtualBoard[y][x] = symbols.Empty;

                let opponentColor = pieces.getPieceColor(this.pieceName);

                if(false) {
                    this.doesAnyOpponentMoveTakeKing(virtualBoard, opponentColor, {i:0, j:0});
                }
                 */
            }

        }

        let acceptedMoves = [];

        for(let i=0; i<moves.length; i++) {
            if (!rejectedMoves.includes(moves[i])) {
                acceptedMoves.push(moves[i]);
            }
        }

        console.log(acceptedMoves);

        return acceptedMoves;
    }

    /***
     * A function to test if the move is legal: so if it does not generate check on our king.
     * @param virtualBoard is the board AFTER the move we are checking
     * @param opponentColor is the color we are checking for moves that can take the king.
     * @param kingPosition is the position of the friendly king
     */
    doesAnyOpponentMoveTakeKing(virtualBoard, opponentColor, kingPosition) {

        let pieces = new Pieces();
        let opponentPiecesMap = new Map();

        // collecting all the opponent pieces that remain after move of the player.
        // saving them in manner [object: {i: 0, j:0}] => "pieceName"
        for(let i=0; i<8; i++) {
            for(let j=0; j<8; j++) {
                if(pieces.getPieceColor(virtualBoard[i][j]) === opponentColor) {
                    opponentPiecesMap.set({i:i, j:j}, virtualBoard[i][j]);
                }
            }
        }

        // for each piece find out if it takes the king

    }

    getFilteredMoves() {
        return this.calculate();
    }

}

export default PossibleMovesCalculator;