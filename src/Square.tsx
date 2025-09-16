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

  const getPlayerColor = () => {
    if (value === 'X') return '#00ff88'; // Green for X
    if (value === 'O') return '#00aaff'; // Neon blue for O
    return '#00ff88'; // Default green
  };

  const styles = StyleSheet.create({
    square: {
      flex: 1,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2a2a2a',
      borderRightWidth: col < 2 ? borderWidth * 0.5 : 0,
      borderBottomWidth: row < 2 ? borderWidth * 0.5 : 0,
      borderColor: '#404040',
      margin: useResponsiveSize(0.5),
      borderRadius: useResponsiveSize(2),
      shadowColor: getPlayerColor(),
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: value ? 0.3 : 0,
      shadowRadius: 4,
      elevation: value ? 4 : 0,
    },
    text: {
      fontSize: useResponsiveSize(8),
      fontWeight: 'bold',
      color: getPlayerColor(),
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