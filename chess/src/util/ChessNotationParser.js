const symbols = require("../front/patterns/Symbols");

/*
This is utility class that will parse positions to elegant chess notation.
 */
class ChessNotationParser {

    constructor(props) {
        this.pieceName = props.pieceName;
        this.startingPosition = props.startingPosition;
        this.endingPosition = props.endingPosition;
        this.takes = props.takes;
    }

    parse() {

        let piece = this.pieceName;
        let start = this.startingPosition;
        let end = this.endingPosition;
        let takes = this.takes;

        return symbols.get(piece) + this.positionToLetterNotation(start) + takes === true ? "x" : "" + this.positionToLetterNotation(end);
    }

    positionToLetterNotation(position) {

        let numbers = ["8","7","6","5","4","3","2","1"];
        let letters = ["a","b","c","d","e","f","g","h"];

        return letters[position.x] + numbers[position.y];
    }

}

export default ChessNotationParser;