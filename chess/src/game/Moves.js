const moves = new Map();

let whiteRookMoves = [];

for(let i=0; i<=7; i++) {
    let upV = [-i,0];
    whiteRookMoves.push(upV);

    let upD = [i,0];
    whiteRookMoves.push(upD);

    let lft = [0,i];
    whiteRookMoves.push(lft);

    let rgt = [0,-i];
    whiteRookMoves.push(rgt);
}

let whiteBishopMoves = [];

for(let i=0; i<=7; i++) {
    let moveUpVector = [i,i];
    whiteBishopMoves.push(moveUpVector);

    let moveDownVector = [-i,-i];
    whiteBishopMoves.push(moveDownVector);

    let moveLeftVector = [i,-i];
    whiteBishopMoves.push(moveLeftVector);

    let moveRightVector = [-i,i];
    whiteBishopMoves.push(moveRightVector);
}

// possible knight move vectors
let whiteKnightMoves = [
    [0,0],
    [-2,-1],
    [-2,1],
    [-1,2],
    [1,2],
    [2,1],
    [2,-1],
    [1,-2],
    [-1,-2]
];

let whitePawnMoves = [
    [0,0],
    [-1,0],
    [-2,0],     // en passant
    [-1,1],     // takes
    [-1,-1]     // takes
];

let whiteQueenMoves = [whiteBishopMoves,whiteRookMoves].flat(1);

let whiteKingMoves = [
    [-1,-1],
    [0,-1],
    [1,-1],
    [-1,0],
    [0,0],
    [1,0],
    [-1,1],
    [0,1],
    [1,1],
    [0,3],         // king side castling for white
    [0,-4]         // queen side castling for white
];

// adding all moves for white to the map
moves.set("Q", whiteQueenMoves);
moves.set("B", whiteBishopMoves);
moves.set("R", whiteRookMoves);
moves.set("N", whiteKnightMoves);
moves.set("P", whitePawnMoves);
moves.set("K", whiteKingMoves);

const blackQueenMoves = [];

for(let i=0; i<whiteQueenMoves.length; i++) {
    let move = [-whiteQueenMoves[i][0], -whiteQueenMoves[i][1]];
    blackQueenMoves.push(move);
}

const blackBishopMoves = [];

for(let i=0; i<whiteBishopMoves.length; i++) {
    let move = [-whiteBishopMoves[i][0], -whiteBishopMoves[i][1]];
    blackBishopMoves.push(move);
}

const blackRookMoves = [];

for(let i=0; i<whiteRookMoves.length; i++) {
    let move = [-whiteRookMoves[i][0], -whiteRookMoves[i][1]];
    blackRookMoves.push(move);
}

const blackKnightMoves = [];

for(let i=0; i<whiteKnightMoves.length; i++) {
    let move = [-whiteKnightMoves[i][0], -whiteKnightMoves[i][1]];
    blackKnightMoves.push(move);
}

const blackPawnMoves = [];

for(let i=0; i<whitePawnMoves.length; i++) {
    let move = [-whitePawnMoves[i][0], -whitePawnMoves[i][1]];
    blackPawnMoves.push(move);
}

const blackKingMoves = [];

for(let i=0; i<whiteKingMoves.length; i++) {
    let move = [-whiteKingMoves[i][0], -whiteKingMoves[i][1]];
    blackKingMoves.push(move);
}

moves.set("q", blackQueenMoves);
moves.set("b", blackBishopMoves);
moves.set("r", blackRookMoves);
moves.set("n", blackKnightMoves);
moves.set("p", blackPawnMoves);
moves.set("k", blackKingMoves);

export default moves;