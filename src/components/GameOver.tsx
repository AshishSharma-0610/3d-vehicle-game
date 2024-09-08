import React from 'react'

interface GameOverProps {
    score: number;
    onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
    return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Game Over</h1>
                <p className="text-2xl mt-4">Score: {score}</p>
                <button className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-700 rounded" onClick={onRestart}>
                    Restart
                </button>
            </div>
        </div>
    )
}

export default GameOver
