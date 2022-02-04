import {Component} from "react";
import * as PIXI from "pixi.js";
import darkSquare from "../img/blackGradient.png";
import lightSquare from "../img/whiteGradient.png";
import K from "../img/white_king.png";
import k from "../img/black_king.png";
import Q from "../img/white_queen.png";
import r from "../img/black_rook.png";
import R from "../img/white_rook.png";
import n from "../img/black_knight.png";
import N from "../img/white_knight.png";
import b from "../img/black_bishop.png";
import B from "../img/white_bishop.png";
import p from "../img/black_pawn.png";
import P from "../img/white_pawn.png";
import q from "../img/black_queen.png";
import moves from "./Moves";
import PossibleMovesCalculator from "./PossibleMovesCalculator";
import pieceMove from "../sounds/pieceMove.mp3";

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

    displayBoard() {

        let columns = this.size.columns;
        let rows = this.size.rows;

        for(let i=0; i<rows; i++) {
            for(let j=0; j<columns; j++) {
                if(!this.choosePattern) {
                    let graphics = new PIXI.Graphics();
                    if((i+j)%2 === 0) {
                        graphics.beginFill(this.pattern.dark);
                    }
                    else {
                        graphics.beginFill(this.pattern.light);
                    }
                    graphics.drawRect(100*i,100*j,100,100);
                    this.displayPositionNotation(i,j,graphics, this.pattern.dark, this.pattern.light);
                    this.application.stage.addChild(graphics);
                }
            }
        }
    }

    displayPositionNotation(i, j, sprite, darkColor, lightColor) {

        let rows = this.size.rows;

        let columnText = ["8", "7", "6", "5", "4", "3", "2", "1"];
        let rowText = ["a","b","c","d","e","f","g","h"];

        let darkColorHex = darkColor;
        let lightColorHex = lightColor;

        if(i === rows-1) {
            let color = j%2 !== 0 ? lightColorHex : darkColorHex;
            let text = new PIXI.Text(rowText[j],{fontWeight: "bold", fill: color, fontSize: 18});
            text.setTransform(100*j+84,100*i+75);
            sprite.addChild(text);
        }

        if(j === 0) {
            let color = i%2 === 0 ? lightColorHex : darkColorHex;
            let text = new PIXI.Text(columnText[i],{fontWeight: "bold", fill: color, fontSize: 18});
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
                    piece.setTransform(100*j+50,100*i+50,0.10,0.10);
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
            this.board.sprites.push(line);
        }
    }

    onDragStart(event) {
        Game.startingX = this.x;
        Game.startingY = this.y;
        this.data = event.data;
        this.dragging = true;
    }

    onDragEnd() {

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

            // updating the coordinates of the sprite
            this.x = newX*100+50;
            this.y = newY*100+50;

            // updating the board object
            let oldX = Math.floor(Game.startingX/100);
            let oldY = Math.floor(Game.startingY/100);
            console.log(oldY + ";" + oldX);
            let pieceSymbol = Game.boardSimplified[oldY][oldX];
            Game.boardSimplified[oldY][oldX] = "0";
            Game.boardSimplified[newY][newX] = pieceSymbol;

            let audio = new Audio(pieceMove);
            audio.play().catch();

            console.log(Game.boardSimplified);
        }
        else {
            this.x = Game.startingX;
            this.y = Game.startingY;
        }

        this.data = null;
        this.dragging = false;
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
    }

    onPieceRevoked() {
        this.board.data = Game.boardSimplified;
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