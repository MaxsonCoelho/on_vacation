import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  requesterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  requesterInfo: {
    marginLeft: theme.spacing.md,
  },
  requesterRole: {
    color: theme.colors.brand.manager,
  },
  titleContainer: {
    marginBottom: theme.spacing.xl,
  },
  periodContainer: {
    marginBottom: theme.spacing.xl,
  },
  durationText: {
    color: theme.colors.brand.manager,
    marginTop: theme.spacing.xs,
  },
  observationsContainer: {
    marginBottom: theme.spacing.xl,
  },
});
