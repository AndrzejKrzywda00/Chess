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
import moves from "./engine/Moves";
import "./Game.css";
import onDragStart from "./move_handlers/OnDragStart";
import onDragMove from "./move_handlers/OnDragMove";
import onPieceClicked from "./operational_click_handlers/OnPieceClicked";
import onPieceRevoked from "./operational_click_handlers/OnPieceRevoked";
import onDragEnd from "./move_handlers/OnDragEnd";

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
                else {
                    // TODO -- generate background from images
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
            text.setTransform(scale*j+0.84*scale,scale*i+0.8*scale);
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
                        .addListener('pointerdown', onDragStart)
                        .addListener('pointerup', onDragEnd)
                        .addListener('pointerdown', onPieceClicked, this)
                        .addListener('pointerup', onPieceRevoked, this)
                        .addListener('pointerupoutside', onDragEnd)
                        .addListener('pointermove', onDragMove);
                } catch (exception) {
                }
            }
            this.sprites.push(line);
        }

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