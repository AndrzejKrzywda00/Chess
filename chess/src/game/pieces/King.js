class King extends Piece {

    constructor(props) {
        super(props);
        this.canCastleKingSide = true;
        this.canCastleQueenSide = true;
    }

}