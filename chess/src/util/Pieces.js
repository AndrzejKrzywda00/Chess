/*
This class is util component to give access to universal notation of chess pieces
And move any non-context related data operations from other classes.
Such as: finding the color of the piece by the name etc.
 */
class Pieces {

    // TODO -- move this to standard FEN notation
    /*
    BE CAREFUL
    this is non standard notation of the chess position
    not matching FEN - because using 'E' and 'e' for en-passant
    Enum for piece names to use in universal and clean way.
     */
    PieceName = {

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
        WhiteEnPassant: "E",

        // --- empty ---
        Empty: "0"
    }

    /*
    Enum for piece color
    */
    PieceColor = {

        White: "white",
        Black: "black"

    }

    constructor(args) {

        /*
        The map to connect colors with the names.
         */
        this.colorMap = new Map();

        this.colorMap.set(this.PieceName.BlackRook, this.PieceColor.Black);
        this.colorMap.set(this.PieceName.BlackKing, this.PieceColor.Black);
        this.colorMap.set(this.PieceName.BlackBishop, this.PieceColor.Black);
        this.colorMap.set(this.PieceName.BlackQueen, this.PieceColor.Black);
        this.colorMap.set(this.PieceName.BlackKnight, this.PieceColor.Black);
        this.colorMap.set(this.PieceName.BlackPawn, this.PieceColor.Black);
        this.colorMap.set(this.PieceName.BlackEnPassant, this.PieceColor.Black);

        this.colorMap.set(this.PieceName.WhiteRook, this.PieceColor.White);
        this.colorMap.set(this.PieceName.WhiteKnight, this.PieceColor.White);
        this.colorMap.set(this.PieceName.WhiteBishop, this.PieceColor.White);
        this.colorMap.set(this.PieceName.WhiteQueen, this.PieceColor.White);
        this.colorMap.set(this.PieceName.WhiteKing, this.PieceColor.White);
        this.colorMap.set(this.PieceName.WhitePawn, this.PieceColor.White);
        this.colorMap.set(this.PieceName.WhiteEnPassant, this.PieceColor.White);
    }

    // getter for piece color
    getPieceColor(shortName) {
        return this.colorMap.get(shortName);
    }

}

export default Pieces;