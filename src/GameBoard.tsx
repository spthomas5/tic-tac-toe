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

  const handlePress = (rowIndex: number, colIndex: number) => {
    console.log(rowIndex, colIndex);
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