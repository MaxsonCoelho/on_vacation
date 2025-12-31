import { StyleSheet } from 'react-native';
import { theme } from '../../tokens';
import { HeaderTitleAlign } from './types';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
  },
});

export const getAlignmentStyles = (align: HeaderTitleAlign) => ({
  alignItems: align === 'center' ? 'center' : 'flex-start',
} as const);
