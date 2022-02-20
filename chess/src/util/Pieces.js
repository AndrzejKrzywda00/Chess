/*
This class is util component to give access to universal notation of chess pieces
And move any non-context related data operations from other classes.
Such as: finding the color of the piece by the name etc.
 */
class Pieces {

    constructor(args) {

        // TODO -- move this to standard FEN notation
        /*
        BE CAREFUL
        this is non standard notation of the chess position
        not matching FEN - because using 'E' and 'e' for en-passant
        Enum for piece names to use in universal and clean way.
         */
        const PieceName = {

            // --- black ---
            BlackRook: "r",
            BlackKnight: "n",
            BlackBishop: "b",
            BlackQueen: "q",
            BlackKing: "k",
            BlackPawn: "p",
            BlackEnPassant: "e",

            // --- white ---
            WhiteRook: "R",
            WhiteKnight: "N",
            WhiteBishop: "B",
            WhiteQueen: "Q",
            WhiteKing: "K",
            WhitePawn: "P",
            WhiteEnPassant: "E"
        }

        /*
        Enum for piece color
         */
        const PieceColor = {

            White: "white",
            Black: "black"

        }

        /*
        The map to connect colors with the
         */
        this.colorMap = new Map();

        this.colorMap.set(PieceName.BlackRook, PieceColor.Black);
        this.colorMap.set(PieceName.BlackKnight, PieceColor.Black);
        this.colorMap.set(PieceName.BlackBishop, PieceColor.Black);
        this.colorMap.set(PieceName.BlackQueen, PieceColor.Black);
        this.colorMap.set(PieceName.BlackKnight, PieceColor.Black);
        this.colorMap.set(PieceName.BlackPawn, PieceColor.Black);
        this.colorMap.set(PieceName.BlackEnPassant, PieceColor.Black);

        this.colorMap.set(PieceName.WhiteRook, PieceColor.White);
        this.colorMap.set(PieceName.WhiteKnight, PieceColor.White);
        this.colorMap.set(PieceName.WhiteBishop, PieceColor.White);
        this.colorMap.set(PieceName.WhiteQueen, PieceColor.White);
        this.colorMap.set(PieceName.WhiteKing, PieceColor.White);
        this.colorMap.set(PieceName.WhitePawn, PieceColor.White);
        this.colorMap.set(PieceName.WhiteEnPassant, PieceColor.White);
    }

    // getter for piece color
    getPieceColor(shortName) {
        return this.colorMap.get(shortName);
    }

}

export default Pieces;