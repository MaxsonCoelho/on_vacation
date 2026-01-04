import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xxl,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  changeRoleLink: {
    textDecorationLine: 'underline',
  },
  description: {
    marginBottom: theme.spacing.lg,
  },
  approvalNotice: {
    marginBottom: theme.spacing.xl,
  },
  form: {
    gap: theme.spacing.md,
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  loginLinkText: {
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    marginBottom: theme.spacing.xs,
  },
});

