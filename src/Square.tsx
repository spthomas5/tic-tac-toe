import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Square = ({ onPress, value }: {  onPress: () => void, value: string | null }) => {
  return (
    <View>
      <TouchableOpacity style={styles.square} onPress={onPress}> 
        <Text>{value}</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  square: {
    width: 50,
    height: 50,
    borderWidth: 1,
  },
});

export default Square;