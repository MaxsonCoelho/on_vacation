import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  metricCard: {
    flex: 1,
  },
  metricCardFull: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  metricLabel: {
    marginBottom: theme.spacing.xs,
  },
  metricValue: {
    fontSize: 32,
    lineHeight: 40,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    marginBottom: theme.spacing.sm,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  actionTitle: {
    marginBottom: theme.spacing.xs,
  },
  actionSubtitle: {
    marginBottom: theme.spacing.xs,
  },
  actionImage: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.md,
  },
});
