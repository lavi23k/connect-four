import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Slot } from "./Slot";

const socket = io('http://localhost:3001');

export const Board = () => {
    const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill('')));
    const [currPlayer, setCurrPlayer] = useState('R');
    const [gameOver, setGameOver] = useState(false);
    const [myColor, setMyColor] = useState(null);
    const [currColumns, setCurrColumns] = useState([5, 5, 5, 5, 5, 5, 5]);

    useEffect(() => {
        socket.on('colorAssignment', (color) => {
            setMyColor(color);
        });

        socket.on('gameState', (gameState) => {
            setBoard(gameState.board);
            setCurrPlayer(gameState.currPlayer);
            setGameOver(gameState.gameOver);
            setCurrColumns(gameState.currColumns);
        });

        socket.on('gameOver', (winner) => {
            setGameOver(true);
        });

        return () => {
            socket.off('colorAssignment');
            socket.off('gameState');
            socket.off('gameOver');
        };
    }, []);

    const setPiece = (col) => {
        if (gameOver || currPlayer !== myColor) return;
        socket.emit('move', col);
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
