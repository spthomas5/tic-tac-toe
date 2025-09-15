import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Square from './Square';

const GameBoard = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));

  const handlePress = (index: number) => {
    console.log(index);
  };

  return (
    <View>
      {board.map((square, index) => (
        <Square key={index} value={square} onPress={() => handlePress(index)} />
      ))}
      <Text>GameBoard</Text>
    </View>
  );
};

export default GameBoard;