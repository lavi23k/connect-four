import React from 'react';
import redToken from '../assets/red token.svg';
import yellowToken from '../assets/yellow token.svg';

export const Slot = ({ ch, row, col, setPiece }) => {
    const handleClick = () => {
        setPiece(col);
    };

    return (
        <div className="slot" onClick={ch === '' ? handleClick : null}>
            {ch && (
                <img src={ch === 'R' ? redToken : yellowToken} alt="token" width="100%" height="100%" />
            )}
        </div>
    );
};