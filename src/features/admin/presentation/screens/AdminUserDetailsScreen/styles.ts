import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  profileCard: {
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  email: {
    textAlign: 'center',
  },
  role: {
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 0,
  },
  actionsCard: {
    marginBottom: 0,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.default,
    marginVertical: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    flex: 1,
  },
  actionButton: {
    width: '100%',
  },
});

