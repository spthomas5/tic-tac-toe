import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useResponsiveSize } from './hooks/useResponsiveSize';

const Square = ({ onPress, value, row, col, disabled = false }: {
  onPress: () => void,
  value: string | null,
  row: number,
  col: number,
  disabled?: boolean
}) => {
  const borderWidth = useResponsiveSize(0.4);

  const styles = StyleSheet.create({
    square: {
      flex: 1,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f8f8',
      borderRightWidth: col < 2 ? borderWidth : 0,
      borderBottomWidth: row < 2 ? borderWidth : 0,
      borderColor: '#333',
    },
    text: {
      fontSize: useResponsiveSize(12),
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Poppins-Bold',
    },
  });

  return (
    <View>
      <TouchableOpacity
        style={styles.square}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={styles.text}>{value}</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Square;