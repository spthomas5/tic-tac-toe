import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Square = ({ value, onPress }: { value: string, onPress: () => void }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}> 
        <Text>Square</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default Square;