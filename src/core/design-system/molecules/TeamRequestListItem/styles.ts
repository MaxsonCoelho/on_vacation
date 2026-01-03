import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { theme } from '../../tokens';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  requestInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  userName: {
    marginBottom: 4,
  },
  dateRange: {
    color: theme.colors.brand.manager,
    fontSize: RFValue(11),
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: theme.spacing.sm,
  },
});

