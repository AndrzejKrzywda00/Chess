const moves = new Map();

let rookMoves = [];

for(let i=0; i<=7; i++) {
    let upV = [-i,0];
    rookMoves.push(upV);

    let upD = [i,0];
    rookMoves.push(upD);

    let lft = [0,i];
    rookMoves.push(lft);

    let rgt = [0,-i];
    rookMoves.push(rgt);
}

let bishopMoves = [];

for(let i=0; i<=7; i++) {
    let moveUpVector = [i,i];
    bishopMoves.push(moveUpVector);

    let moveDownVector = [-i,-i];
    bishopMoves.push(moveDownVector);

    let moveLeftVector = [i,-i];
    bishopMoves.push(moveLeftVector);

    let moveRightVector = [-i,i];
    bishopMoves.push(moveRightVector);
}

// possible knight move vectors
let knightMoves = [
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

let pawnMoves = [
    [0,0],
    [-1,0],
    [-2,0],     // en passant
    [-1,1],     // takes
    [-1,-1]     // takes
];

let queenMoves = [bishopMoves,rookMoves].flat(1);

let kingMoves = [
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

// adding all moves to map
moves.set("q",queenMoves);
moves.set("b",bishopMoves);
moves.set("r",rookMoves);
moves.set("n",knightMoves);
moves.set("p",pawnMoves);
moves.set("k",kingMoves);

export default moves;