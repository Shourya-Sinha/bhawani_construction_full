import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const glassStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  inner: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
  elevated: {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    transform: [{ translateY: -5 }],
  },
    pressed: {
    transform: [{ scale: 0.98 }],
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
  }
});