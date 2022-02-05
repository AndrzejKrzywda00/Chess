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
import pieceMove from "../sounds/pieceMove.mp3";
import "./Game.css";

class Game extends Component {

    constructor(props) {
        super(props);
        this.pixi_cnt = null;
        this.application = new PIXI.Application({width: 800, height: 800, backgroundAlpha: 0.0});
        this.loader = null;
        this.dragging = false;
        this.data = null;
        this.possibleMoves = moves;
        this.board = {
            castlingRights: null,
            en_passants: [],
            turn: 0,
            data: [],
            sprites: []
        };
        this.startingX = null;
        this.startingY = null;
        this.size = {
            rows: 8,
            columns: 8
        }
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

        for(let i=0; i<rows; i++) {
            for(let j=0; j<columns; j++) {
                if(!this.choosePattern) {

                    let graphics = new PIXI.Graphics();
                    let color = (i+j)%2 === 0 ? pattern.light : pattern.dark;
                    graphics.beginFill(color);
                    graphics.drawRect(100*i,100*j,100,100);

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

        let columnText = ["8", "7", "6", "5", "4", "3", "2", "1"];
        let rowText = ["a","b","c","d","e","f","g","h"];

        let darkColorHex = darkColor;
        let lightColorHex = lightColor;

        if(i === rows-1) {
            let color = j%2 !== 0 ? lightColorHex : darkColorHex;
            let text = new PIXI.Text(rowText[j],{fill: color, fontSize: 18});
            text.setTransform(100*j+84,100*i+75);
            sprite.addChild(text);
        }

        if(j === 0) {
            let color = i%2 === 0 ? lightColorHex : darkColorHex;
            let text = new PIXI.Text(columnText[i],{fill: color, fontSize: 18});
            text.setTransform(100*j+5,100*i+5);
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

        for(let i=0; i<rows; i++) {
            let line = [];
            for(let j=0; j<columns; j++) {
                try {
                    let texture = this.loader.resources[board[i][j]].texture;
                    let piece = new PIXI.Sprite(texture);
                    piece.interactive = true;
                    piece.buttonMode = true;
                    piece.roundPixels = false;
                    piece.anchor.set(0.5);
                    piece.setTransform(100*j+50,100*i+50,0.40,0.40);
                    this.application.stage.addChild(piece);
                    line.push(piece);
                    piece
                        .on('pointerdown', this.onDragStart)
                        .on('pointerup', this.onDragEnd)
                        .on('pointerdown', this.onPieceClicked, this)
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
        Game.startingX = this.x;
        Game.startingY = this.y;
        this.data = event.data;
        this.zIndex = 100;
        this.dragging = true;
    }

    onDragEnd() {

        console.log(this);

        try {
            let newX = Math.floor(this.data.getLocalPosition(this.parent).x/100);
            let newY = Math.floor(this.data.getLocalPosition(this.parent).y/100);

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
                newY - Math.floor(Game.startingY/100),
                newX - Math.floor(Game.startingX/100)
            ];

            let possibleMoves = Game.pieceMoves;
            let moveValid = false;

            possibleMoves.forEach(element => {
                if(element[0] === offset[0] && element[1] === offset[1]) {
                    moveValid = true;
                }
            });

            if(moveValid) {

                // inform finisher that can take piece
                Game.moveValid = true;

                // updating the coordinates of the sprite
                this.x = newX*100+50;
                this.y = newY*100+50;

                // updating the board object
                let oldX = Math.floor(Game.startingX/100);
                let oldY = Math.floor(Game.startingY/100);
                let pieceSymbol = Game.boardSimplified[oldY][oldX];

                // setting up new position in the virtual board
                Game.boardSimplified[oldY][oldX] = "0";
                Game.boardSimplified[newY][newX] = pieceSymbol;

                // playing the sound of the move
                let audio = new Audio(pieceMove);
                audio.play().catch();

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

        let x = Math.floor(Game.startingX/100);
        let y = Math.floor(Game.startingY/100);

        let pieceName = this.board.data[y][x];
        let color = pieceName.toLowerCase() === pieceName ? "black" : "white";

        Game.pieceMoves = new PossibleMovesCalculator(
            this.possibleMoves,
            pieceName,
            color,
            this.board.data,
            {x: x, y: y},
            "",
            "")
            .filteredMoves;

        Game.boardSimplified = this.board.data;
        Game.sprites = this.sprites;
    }

    onPieceRevoked() {

        if(Game.moveValid) {
            let newY = Game.lastY;
            let newX = Game.lastX;

            let oldY = Math.floor(Game.startingY/100);
            let oldX = Math.floor(Game.startingX/100);

            this.application.stage.removeChild(this.sprites[newY][newX]);

            // removing the chosen sprite from the board
            Game.sprites[newY][newX] = Game.sprites[oldY][oldX];
            Game.sprites[oldY][oldX] = undefined;
        }

        this.board.data = Game.boardSimplified;
        this.sprites = Game.sprites;
        this.lastX = Game.lastX;
        this.lastY = Game.lastY;
        Game.moveValid = false;

        console.log(this.sprites);
        console.log(this.board.data);
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
                this.board.castlingRights = lastPart[2];

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

    render() {
        return <div ref={this.updatePixiCnt}/>;
    }

}

export default Game;