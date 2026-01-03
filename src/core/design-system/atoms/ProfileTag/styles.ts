import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 5,
    right: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    position: 'relative',
    zIndex: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

