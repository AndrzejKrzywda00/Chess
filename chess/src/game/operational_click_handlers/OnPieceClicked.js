import PossibleMovesCalculator from "../engine/PossibleMovesCalculator";
import Game from "../Game";
import Pieces from "../../util/Pieces";

/*
Handler listening on clicking events on the piece.
It takes care of processing the possible moves for the clicked piece.
 */
export default function onPieceClicked() {

    // getting the scale of the board (of how big it is on the screen)
    let scale = this.scale;

    // getting the normalized position of the element on the board
    // x => {0,7} & x => {0,7}
    let x = Math.floor(Game.startingX / scale);
    let y = Math.floor(Game.startingY / scale);

    // getting the short name of the virtualBoard
    let pieceName = this.board.data[y][x];

    // getting the real color of the piece (black or white)
    let color = new Pieces().getPieceColor(pieceName);

    // creating the instance of the calculator of the possible moves
    let calculator = new PossibleMovesCalculator(
        this.possibleMoves,
        pieceName,
        color,
        this.board.data,
        {x: x, y: y},
        this.castlingRights,
        "");

    // getting filtered moves - moves which are possible in the position on the virtual board.
    Game.pieceMoves = calculator.getFilteredMoves();

    // passing all data to Game class to be accessible for other handlers
    Game.boardSimplified = this.board.data;
    Game.sprites = this.sprites;
    Game.castlingRights = this.castlingRights;
    Game.lastCastleData = this.lastCastleData;
    Game.scale = this.scale;
}