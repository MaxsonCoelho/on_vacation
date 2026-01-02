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
    width: 150,
    height: 150,
  },
  name: {
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  email: {
    textAlign: 'center',
  },
  registrationInfo: {
    textAlign: 'center',
    fontSize: theme.typography.fontSize.body,
  },
  infoCard: {
    marginBottom: 0,
  },
  statusCard: {
    marginBottom: 0,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.default,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  infoLabel: {
    flex: 1,
  },
  statusText: {
    marginTop: theme.spacing.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  rejectButton: {
    flex: 1,
  },
  approveButton: {
    flex: 1,
  },
});

