import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Square from './Square';

type Cell = 'X' | 'O' | null;
type Board = Cell[][];

const GameBoard = () => {
  const [board, setBoard] = useState<Board>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ])

  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'cpu' | 'draw' | null>(null);

  const makeAIMove = (currentBoard: Board) => {
    // Find all empty cells
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === null) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    // Pick a random empty cell
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      // Make the move
      const newBoard = currentBoard.map(r => [...r]);
      newBoard[row][col] = 'O';
      setBoard(newBoard);

      // Check if AI won
      const result = checkWinner(newBoard);
      if (result === 'O') {
        setWinner('cpu');
        setGameOver(true);
      } else if (result === 'X') {
        setWinner('player');
        setGameOver(true);
      } else if (result === 'draw') {
        setWinner('draw');
        setGameOver(true);
      }
    }
  };

  const handlePress = (rowIndex: number, colIndex: number) => {
    // Check if valid move
    if (board[rowIndex][colIndex] !== null || gameOver) return;

    // Player moves (X)
    const newBoard = board.map(row => [...row]);
    newBoard[rowIndex][colIndex] = 'X';
    setBoard(newBoard);

    // Check if player won
    const result = checkWinner(newBoard);
    if (result === 'X') {
      setWinner('player');
      setGameOver(true);
      return;
    } else if (result === 'draw') {
      setWinner('draw');
      setGameOver(true);
      return;
    }

    // AI moves after a delay
    setTimeout(() => {
      makeAIMove(newBoard);
    }, 500);
  };

  const checkWinner = (board: Board): 'X' | 'O' | 'draw' | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        return board[i][0];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        return board[0][i];
      }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return board[0][0];
    }

    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return board[0][2];
    }

    // Check for draw
    const isDraw = board.every(row => row.every(cell => cell !== null));
    if (isDraw) return 'draw';

    return null;
  };
  
  const resetGame = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <View>
      <Text style={styles.title}>Tic Tac Toe</Text>

      {/* Show game status */}
      <Text style={styles.status}>
        {winner === 'player' && 'You Win!'}
        {winner === 'cpu' && 'CPU Wins!'}
        {winner === 'draw' && "Draw!"}
        {!winner && !gameOver && 'Your Turn'}
      </Text>

      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Square key={`${rowIndex}-${colIndex}`} value={cell} onPress={() => handlePress(rowIndex, colIndex)} />
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.resetButton} onPress={resetGame} >
        <Text style={styles.resetButtonText}>New Game</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  resetButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameBoard;