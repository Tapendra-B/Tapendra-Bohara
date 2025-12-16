import { Player } from '../types';

export const calculateWinner = (squares: Player[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
};

export const isBoardFull = (squares: Player[]): boolean => {
  return squares.every((square) => square !== null);
};

// Simple Minimax for "Hard" mode or just decent play
export const getBestMove = (squares: Player[], aiPlayer: Player): number => {
  const opponent = aiPlayer === 'X' ? 'O' : 'X';
  
  // Available moves
  const availableMoves = squares.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null) as number[];

  if (availableMoves.length === 0) return -1;

  // 1. Try to win
  for (let move of availableMoves) {
    const copy = [...squares];
    copy[move] = aiPlayer;
    if (calculateWinner(copy)) return move;
  }

  // 2. Block opponent win
  for (let move of availableMoves) {
    const copy = [...squares];
    copy[move] = opponent;
    if (calculateWinner(copy)) return move;
  }

  // 3. Take center if available
  if (squares[4] === null) return 4;

  // 4. Random otherwise
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};

export const getRandomMove = (squares: Player[]): number => {
  const availableMoves = squares.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null) as number[];
  if (availableMoves.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};