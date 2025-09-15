import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

export default GameBoard;