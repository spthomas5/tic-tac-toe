import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const useResponsiveSize = (percentage: number, dimension: 'width' | 'height' = 'width') => {
  const baseSize = dimension === 'width' ? screenWidth : screenHeight;
  return baseSize * (percentage / 100);
};