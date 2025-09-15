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

  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);

  const handlePress = (rowIndex: number, colIndex: number) => {
    if (board[rowIndex][colIndex] !== null) {
      return;
    }

    const newBoard = [...board];
    newBoard[rowIndex][colIndex] = isPlayerTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsPlayerTurn(prevIsPlayerTurn => !prevIsPlayerTurn);

    if (checkWin()) {
      Alert.alert('Player ' + (isPlayerTurn ? 'X' : 'O') + ' wins!');
    }
  };

  const checkWin = () => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== null) {
        return true;
      }
    }
  

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== null) {
      return true;
    }
  }

  // Check diagonals
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== null) {
    return true;
  }
  
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== null) {
    return true;
  }

  return false;
  };
  
  const resetGame = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setIsPlayerTurn(true);
  };

  return (
    <View>
      <Text>Tic Tac Toe</Text>

      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <Square key={`${rowIndex}-${colIndex}`} value={cell} onPress={() => handlePress(rowIndex, colIndex)} />
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.resetButton} onPress={resetGame} >
        <Text>Reset Game</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default GameBoard;