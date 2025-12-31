import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';
import { AvatarSize } from './types';

const SIZES = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
};

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight, // Fallback background
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    color: theme.colors.primaryContrast,
    fontWeight: 'bold',
  },
});

export const getAvatarSize = (size: AvatarSize) => ({
  width: SIZES[size],
  height: SIZES[size],
  borderRadius: SIZES[size] / 2,
});

export const getInitialsFontSize = (size: AvatarSize) => ({
  fontSize: SIZES[size] * 0.4,
});
