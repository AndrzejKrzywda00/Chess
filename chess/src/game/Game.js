import {Component} from "react";
import * as PIXI from "pixi.js";
import pawnImage from "../img/chesspawn.png";
import darkSquare from "../img/darkSquare.png";
import lightSquare from "../img/whiteSquare.png";
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

class Game extends Component {

    constructor(props) {
        super(props);
        this.pixi_cnt = null;
        this.app = new PIXI.Application({width: 800, height: 800, transparent: false});
        this.avatar = null;
        this.loader = null;
        this.dragging = false;
        this.data = null;
    }

    updatePixiCnt =(element)=> {
        this.pixi_cnt = element;
        if(this.pixi_cnt && this.pixi_cnt.children.length <=0 ) {
            this.pixi_cnt.appendChild(this.app.view);
        }
        this.setup();
    }

    setup =()=> {
        this.loader = new PIXI.Loader();
        this.loader
            .add("pawnImage",pawnImage)
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
        this.avatar = new PIXI.Sprite(this.loader.resources["pawnImage"].texture);
        this.displayBoard();
    }

    displayBoard() {

        let columns = 8;
        let rows = 8;

        for(let i=0; i<rows; i++) {
            for(let j=0; j<columns; j++) {
                let texture = this.loader.resources[(i+j) % 2 === 0 ? "lightSquare":"darkSquare"].texture;
                let sprite = new PIXI.Sprite(texture);
                this.displayPositionNotation(i,j,sprite);
                sprite.setTransform(i*100,j*100);
                this.app.stage.addChild(sprite);
            }
        }
        this.displayPieces();
    }

    displayPositionNotation(i, j, sprite) {

        let columnText = ["8", "7", "6", "5", "4", "3", "2", "1"];
        let rowText = ["a","b","c","d","e","f","g","h"];

        let darkColorHex = "#668611";
        let lightColorHex = "#f4f6dc";

        if(j === 7) {
            let color = i%2 !== 0 ? darkColorHex : lightColorHex;
            let text = new PIXI.Text(rowText[i],{fontWeight: "bold", fill: color});
            text.setTransform(80,67);
            sprite.addChild(text);
        }

        if(i === 0) {
            let color = j%2 === 0 ? darkColorHex : lightColorHex;
            let text = new PIXI.Text(columnText[j],{fontWeight: "bold", fill: color});
            text.setTransform(5,5);
            sprite.addChild(text);
        }

    }

    displayPieces() {

        // black is lowercase
        // white is uppercase
        // next letter after last line of board is which player turn is it
        // next symbol is castling possibilites
        // - means neigher can castle
        // Qk - white can queensize, black can kingsize
        // max. option is KQkq
        // next symbol is en-passant possibilities
        let startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
        this.parseFen(startingFen);
    }

    onDragStart(event) {
        this.data = event.data;
        this.dragging = true;
    }

    onDragEnd(event) {
        let newX = Math.floor(this.data.getLocalPosition(this.parent).x/100);
        let newY = Math.floor(this.data.getLocalPosition(this.parent).y/100);
        this.x = newX*100+50;
        this.y = newY*100+50;
        this.data = null;
        this.dragging = false;
    }

    onDragMove(event) {
        if(this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }

    parseFen(fen) {

        let lines = fen.split("/");
        for(let i=0; i<lines.length; i++) {
            for(let j=0; j<lines[i].length; j++) {
                try {
                    let texture = this.loader.resources[lines[i][j]].texture;
                    let piece = new PIXI.Sprite(texture);
                    piece.interactive = true;
                    piece.buttonMode = true;
                    piece.roundPixels = false;
                    piece.anchor.set(0.5);
                    piece.setTransform(100*j+50,100*i+50,0.10,0.10);
                    piece
                        .on('pointerdown',this.onDragStart)
                        .on('pointerup',this.onDragEnd)
                        .on('pointerupoutside',this.onDragEnd)
                        .on('pointermove',this.onDragMove);
                    this.app.stage.addChild(piece);
                } catch (Exception) {
                    continue;
                }
            }
        }

    }


    calculatePossibleMoves() {
        // this function shall calculate board with all possible moves
        // 0 for free, 1 for taken
        // obviously 1 stands for spaces taken with other pieces, including one which is dragged
        // 1 for illegal moves, like king to king & moves outside the range of this piece
        // 1 for moves that make a check to your king
        // ---
        // for king of course no check moves
        // no castling afer move
        // but king can be dragged over rook when has castling opportunity
        // once again for en-passant attack on pawn, there should be information
    }

    render() {
        return <div ref={this.updatePixiCnt}/>;
    }

}

export default Game;