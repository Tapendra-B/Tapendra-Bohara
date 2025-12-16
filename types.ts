export type Player = 'X' | 'O' | null;

export enum GameMode {
  PvP = 'PvP', // Player vs Player
  PvC = 'PvC', // Player vs Computer
}

export enum GameDifficulty {
  EASY = 'EASY',
  HARD = 'HARD',
}

export enum AppView {
  SPLASH = 'SPLASH',
  MENU = 'MENU',
  GAME = 'GAME',
}

export interface GameState {
  board: Player[];
  xIsNext: boolean;
  winner: Player | 'DRAW' | null;
  winningLine: number[] | null;
}