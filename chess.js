const chessboard = document.getElementById('chessboard');

const pieces = [
    '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
    '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
    '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
];

for (let i = 0; i < 64; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add((i + Math.floor(i / 8)) % 2 === 0 ? 'white' : 'black');
    if (pieces[i]) {
        square.textContent = pieces[i];
        square.draggable = true;
    }
    chessboard.appendChild(square);
}

const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function() {
    console.log('WebSocket bağlantısı kuruldu!');
};

socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    if (message.type === 'move') {
        updateChessboard(message.move);
    }
};

function sendMove(move) {
    const message = {
        type: 'move',
        move: move
    };
    socket.send(JSON.stringify(message));
}

function updateChessboard(move) {
    const { from, to } = move;
    const fromSquare = chessboard.children[from];
    const toSquare = chessboard.children[to];

    toSquare.textContent = fromSquare.textContent;
    fromSquare.textContent = '';
}

let selectedSquare = null;

chessboard.addEventListener('click', function(event) {
    const index = Array.from(chessboard.children).indexOf(event.target);
    if (selectedSquare === null) {
        selectedSquare = index;
    } else {
        const move = { from: selectedSquare, to: index };
        sendMove(move);
        updateChessboard(move);
        selectedSquare = null;
    }
});