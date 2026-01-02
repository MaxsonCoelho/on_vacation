import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  metricCard: {
    flex: 1,
  },
  metricLabel: {
    marginBottom: theme.spacing.xs,
  },
  metricValue: {
    fontSize: 32,
    lineHeight: 40,
  },
  approvedValue: {
    color: theme.colors.status.success,
  },
  pendingValue: {
    color: theme.colors.status.warning,
  },
  rejectedValue: {
    color: theme.colors.status.error,
  },
  fullCard: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.default,
    marginVertical: theme.spacing.xs,
  },
});

