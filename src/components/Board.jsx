import React, { useState } from "react";
import { Slot } from "./Slot";

export const Board = () => {
    const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill('')));
    const [currPlayer, setCurrPlayer] = useState('R');
    const [gameOver, setGameOver] = useState(false);
    const [currColumns, setCurrColumns] = useState([5, 5, 5, 5, 5, 5, 5]);

    const setPiece = (col) => {
        if (gameOver) return;

        let row = currColumns[col];
        if (row < 0) return;

        const newBoard = [...board];
        newBoard[row][col] = currPlayer;

        const newColumns = [...currColumns];
        newColumns[col] = row - 1;

        setBoard(newBoard);
        setCurrColumns(newColumns);

        if (checkWinner(newBoard, row, col, currPlayer)) {
            setGameOver(true);
            return;
        }

        setCurrPlayer(currPlayer === 'R' ? 'Y' : 'R');
    };

    const checkWinner = (board, row, col, player) => {
        let count = 0;

        for (let c = 0; c < 7; c++) {
            count = board[row][c] === player ? count + 1 : 0;
            if (count === 4) return true;
        }

        count = 0;
        for (let r = 0; r < 6; r++) {
            count = board[r][col] === player ? count + 1 : 0;
            if (count === 4) return true;
        }

        count = 0;
        let r = row, c = col;
        while (r > 0 && c > 0) { r--; c--; }
        while (r < 6 && c < 7) {
            count = board[r][c] === player ? count + 1 : 0;
            if (count === 4) return true;
            r++; c++;
        }

        count = 0;
        r = row; c = col;
        while (r > 0 && c < 6) { r--; c++; }
        while (r < 6 && c >= 0) {
            count = board[r][c] === player ? count + 1 : 0;
            if (count === 4) return true;
            r++; c--;
        }

        return false;
    };

    return (
        <>
            <h2>{gameOver ? `${currPlayer === 'R' ? 'Red' : 'Yellow'} Wins!` : `${currPlayer === 'R' ? 'Red' : 'Yellow'}'s Turn`}</h2>
            <div id='board'>
                {board.map((row, i) => {
                    return row.map((ch, j) => (
                        <Slot key={`${i}-${j}`} ch={ch} row={i} col={j} setPiece={setPiece} />
                    ));
                })}
            </div>
        </>
    );
};