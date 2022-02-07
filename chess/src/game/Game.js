import {Component} from "react";
import * as PIXI from "pixi.js";
import darkSquare from "../img/blackGradient.png";
import lightSquare from "../img/whiteGradient.png";
import K from "../img/white_king_2.png";
import k from "../img/black_king_2.png";
import Q from "../img/white_queen_2.png";
import r from "../img/black_rook_2.png";
import R from "../img/white_rook_2.png";
import n from "../img/black_knight_2.png";
import N from "../img/white_knight_2.png";
import b from "../img/black_bishop_2.png";
import B from "../img/white_bishop_2.png";
import p from "../img/black_pawn_2.png";
import P from "../img/white_pawn_2.png";
import q from "../img/black_queen_2.png";
import moves from "./Moves";
import PossibleMovesCalculator from "./PossibleMovesCalculator";
import pieceMoveSound from "../sounds/pieceMove.mp3";
import castleSound from "../sounds/castling_sound_2 (2).mp3";
import "./Game.css";

class Game extends Component {

    constructor(props) {
        super(props);
        this.pixi_cnt = null;
        this.scale = props.scale;
        this.size = {
            rows: 8,
            columns: 8
        };
        this.application = new PIXI.Application({width: this.size.columns*this.scale, height: this.size.rows*this.scale, backgroundAlpha: 0.0});
        this.loader = null;
        this.dragging = false;
        this.data = null;
        this.possibleMoves = moves;
        this.board = {
            castlingRights: [],
            en_passants: [],
            turn: 0,
            data: [],
            sprites: []
        };
        this.startingX = null;
        this.startingY = null;
        this.piece = {
            sprite: null,
            symbol: null,
            moves: null
        };
        this.pieceMoves = null;
        this.boardSimplified = null;
        this.sprites = [];
        this.lastX = null;
        this.lastY = null;
        this.moveValid = false;
        this.lastCastleData = null;
        this.castlingRights = [];
        this.pattern = props.boardPattern;
        this.choosePattern = props.chooseGradientOverPattern;
    }

    updatePixiCnt =(element)=> {
        this.pixi_cnt = element;
        if(this.pixi_cnt && this.pixi_cnt.children.length <= 0) {
            this.pixi_cnt.appendChild(this.application.view);
        }
        this.setup();
    }

    setup =()=> {
        this.loader = new PIXI.Loader();
        this.loader
            .add("lightSquare",lightSquare)
            .add("darkSquare",darkSquare)
            .add("K",K)
            .add("k",k)
            .add("q",q)
            .add("Q",Q)
            .add("B",B)
            .add("b",b)
            .add("r",r)
            .add("R",R)
            .add("N",N)
            .add("n",n)
            .add("p",p)
            .add("P",P)
            .load(this.initialize);
    }

    initialize =()=> {
        this.displayBoard();
        let startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w QKqk -";
        this.displayPieces(startFen);
    }

    /*
    This method displays the chess board tiles in standard manner,
    using graphics element with chosen color of fill.
     */
    displayBoard() {

        let columns = this.size.columns;
        let rows = this.size.rows;
        let pattern = this.pattern;
        let scale = this.scale;

        for(let i=0; i<rows; i++) {
            for(let j=0; j<columns; j++) {
                if(!this.choosePattern) {

                    let graphics = new PIXI.Graphics();
                    let color = (i+j)%2 === 0 ? pattern.light : pattern.dark;
                    graphics.beginFill(color)
                            .drawRect(scale*i,scale*j,scale,scale)
                            .endFill();

                    // adding the letters in last row, and numbers in first column
                    if(i === rows-1 || j === 0)
                    this.displayPositionNotation(i,j,graphics, this.pattern.light, this.pattern.dark);

                    // adding each node to the container
                    this.application.stage.addChild(graphics);
                }
            }
        }

    }

    /*
    This internal method places letters and numbers on selected edge tiles
    to make reading the board easier for players
     */
    displayPositionNotation(i, j, sprite, darkColor, lightColor) {

        let rows = this.size.rows;
        let scale = this.scale;

        let columnText = ["8", "7", "6", "5", "4", "3", "2", "1"];
        let rowText = ["a","b","c","d","e","f","g","h"];

        let darkColorHex = darkColor;
        let lightColorHex = lightColor;

        if(i === rows-1) {
            let color = j%2 !== 0 ? lightColorHex : darkColorHex;
            let text = new PIXI.Text(rowText[j],{fill: color, fontSize: 18});
            text.setTransform(scale*j+0.84*scale,scale*i+0.75*scale);
            sprite.addChild(text);
        }

        if(j === 0) {
            let color = i%2 === 0 ? lightColorHex : darkColorHex;
            let text = new PIXI.Text(columnText[i],{fill: color, fontSize: 18});
            text.setTransform(scale*j+0.05*scale,scale*i+0.05*scale);
            sprite.addChild(text);
        }

    }

    /*
    This method displays all pieces according to obtained FEN notation
     */
    displayPieces(fen) {

        this.parseFen(fen);

        let rows = this.size.rows;
        let columns = this.size.columns;
        let board = this.board.data;
        this.application.stage.sortableChildren = true;
        let scale = this.scale;

        for(let i=0; i<rows; i++) {
            let line = [];
            for(let j=0; j<columns; j++) {
                try {
                    let texture = this.loader.resources[board[i][j]].texture;
                    let piece = new PIXI.Sprite(texture);
                    piece.interactive = true;
                    piece.cursor = "grab";
                    piece.roundPixels = false;
                    piece.anchor.set(0.5);
                    piece.setTransform(scale*j+scale/2,scale*i+scale/2,0.472,0.472);
                    this.application.stage.addChild(piece);
                    line.push(piece);
                    piece
                        .on('pointerdown', this.onDragStart)
                        .on('pointerup', this.onDragEnd)
                        .on('pointerdown', this.onPieceClicked, this)       // passing reference to the class to make it easier to access objects
                        .on('pointerup', this.onPieceRevoked, this)
                        .on('pointerupoutside', this.onDragEnd)
                        .on('pointermove', this.onDragMove);
                } catch (exception) {
                }
            }
            this.sprites.push(line);
        }

    }

    onDragStart(event) {
        this.cursor = "grabbing";
        Game.startingX = this.x;
        Game.startingY = this.y;
        this.data = event.data;
        this.zIndex = 100;
        this.dragging = true;
    }

    onDragEnd() {

        this.cursor = "grab";
        let scale = Game.scale;

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
                        console.log(!rights.includes(right));
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
                this.x = (newX*scale)+scale/2;
                this.y = (newY*scale)+scale/2;

                // updating the board object
                let pieceSymbol = Game.boardSimplified[oldY][oldX];

                // setting up new position in the virtual board
                Game.boardSimplified[oldY][oldX] = "0";
                Game.boardSimplified[newY][newX] = pieceSymbol;

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

    onDragMove() {
        if(this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }

    /*
    This method calculates all possible moves for the clicked piece
     */
    onPieceClicked() {

        let scale = this.scale;

        let x = Math.floor(Game.startingX/scale);
        let y = Math.floor(Game.startingY/scale);

        let pieceName = this.board.data[y][x];
        let color = pieceName.toLowerCase() === pieceName ? "black" : "white";

        let calculator = new PossibleMovesCalculator(
            this.possibleMoves,
            pieceName,
            color,
            this.board.data,
            {x: x, y: y},
            this.castlingRights,
            "");

        Game.pieceMoves = calculator.getFilteredMoves();

        Game.boardSimplified = this.board.data;
        Game.sprites = this.sprites;
        Game.castlingRights = this.castlingRights;
        Game.lastCastleData = this.lastCastleData;
        Game.scale = this.scale;
    }

    /*
    Listener of revoking the grab of the piece
    Performs tasks related to the class, so
    Removing the sprites from the grid
    And updating the virtual board of sprites
     */
    onPieceRevoked() {

        let scale = this.scale;

        if(Game.moveValid) {

            let newY = Game.lastY;
            let newX = Game.lastX;

            let oldY = Math.floor(Game.startingY/scale);
            let oldX = Math.floor(Game.startingX/scale);

            this.application.stage.removeChild(this.sprites[newY][newX]);

            if(Game.lastCastleData != null) {

                let castlingType = Game.lastCastleData;

                let rookOffsets = new Map();
                rookOffsets.set("Q", 3);
                rookOffsets.set("q", 3);
                rookOffsets.set("K", -2);
                rookOffsets.set("k", -2);

                let oldRookX = null;
                let oldRookY = null;
                if(castlingType === "Q" || castlingType === "q") {
                    oldRookX = 0;
                }
                if(castlingType === "K" || castlingType === "k") {
                    oldRookX = 7;
                }
                if(castlingType === "K" || castlingType === "Q") {
                    oldRookY = 7;
                }
                if(castlingType === "k" || castlingType === "q") {
                    oldRookY = 0;
                }

                this.sprites[oldRookY][oldRookX].x = scale*(oldRookX+rookOffsets.get(castlingType))+scale/2;
                this.sprites[oldRookY][oldRookX+rookOffsets.get(castlingType)] = this.sprites[oldRookY][oldRookX];
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
        Game.moveValid = false;
    }

    parseFen(fen) {

        // saving data to simple board with fen representations
        let lines = fen.split("/");

        for(let i=0; i<lines.length; i++) {
            let boardLine = [];

            if(i === 7) {

                let lastPart = lines[i].split(" ");
                let lastLine = lastPart[0];

                // adding last line information in normal manner
                for(let k=0; k<lastLine.length; k++) {

                    let piece = lastLine[k];

                    if(this.isFENNumeric(piece)) {
                        let w = 0;
                        while(w < parseInt(piece)) {
                            boardLine.push("0");
                            w++;
                        }
                    }
                    else {
                        boardLine.push(piece);
                    }
                }

                // parsing rest of the data from the FEN
                this.board.turn = lastPart[1];

                // castling rights
                this.board.castlingRights = this.parseFENCastlingRights(lastPart[2]);

                // saving raw en passants possibilities
                this.board.en_passants = lastPart[3];
            }

            else {

                for(let j=0; j<lines[i].length; j++) {

                    let piece = lines[i][j];

                    // creating empty spaces
                    if(this.isFENNumeric(piece)) {
                        let w = 0;
                        while(w < parseInt(piece)) {
                            boardLine.push("0");
                            w++;
                        }
                    }
                    // adding a piece symbol
                    else {
                        boardLine.push(piece);
                    }

                }

            }

            // adding a line to the 2d board array
            this.board.data.push(boardLine);
        }
    }

    // this function checks if the number is supported in fen
    isFENNumeric(number) {

        return number === "1"
            || number === "2"
            || number === "3"
            || number === "4"
            || number === "5"
            || number === "6"
            || number === "7"
            || number === "8";
    }

    parseFENCastlingRights(castlingRights) {
        for(let i=0; i<castlingRights.length; i++) {
            this.castlingRights.push(castlingRights[i]);
        }
    }

    render() {
        return <div ref={this.updatePixiCnt}/>;
    }

}

export default Game;