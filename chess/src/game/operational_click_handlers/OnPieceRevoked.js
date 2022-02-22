import Game from "../Game";

/*
This operational handler performs all processes related to finishing the move.
Processing all class-related data, so changing the state of virtual board
Also the state of the array of sprites
And performing additional calculations which are related to castling.
 */
export default function onPieceRevoked() {

    let scale = this.scale;

    if(Game.moveValid) {

        let newY = Game.lastY;
        let newX = Game.lastX;

        let oldY = Math.floor(Game.startingY / scale);
        let oldX = Math.floor(Game.startingX / scale);

        this.application.stage.removeChild(this.sprites[newY][newX]);

        if (Game.lastCastleData != null) {

            let castlingType = Game.lastCastleData;

            let rookOffsets = new Map();
            rookOffsets.set("Q", 3);
            rookOffsets.set("q", 3);
            rookOffsets.set("K", -2);
            rookOffsets.set("k", -2);

            let oldRookX = null;
            let oldRookY = null;
            if (castlingType === "Q" || castlingType === "q") {
                oldRookX = 0;
            }
            if (castlingType === "K" || castlingType === "k") {
                oldRookX = 7;
            }
            if (castlingType === "K" || castlingType === "Q") {
                oldRookY = 7;
            }
            if (castlingType === "k" || castlingType === "q") {
                oldRookY = 0;
            }

            this.sprites[oldRookY][oldRookX].x = scale * (oldRookX + rookOffsets.get(castlingType)) + scale / 2;
            this.sprites[oldRookY][oldRookX + rookOffsets.get(castlingType)] = this.sprites[oldRookY][oldRookX];
            this.sprites[oldRookY][oldRookX] = undefined;
        }

        // removing the chosen sprite from the board
        Game.sprites[newY][newX] = Game.sprites[oldY][oldX];
        Game.sprites[oldY][oldX] = undefined;
    }

    this.lastCastleData = null;
    this.board.data = Game.boardSimplified;
    this.sprites = Game.sprites;
    this.lastX = Game.lastX;
    this.lastY = Game.lastY;
    this.castlingRights = Game.castlingRights;
    this.blackKingPosition = Game.blackKingPosition;
    this.whiteKingPosition = Game.whiteKingPosition;
    Game.moveValid = false;
}
