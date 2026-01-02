import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
  },
  greeting: {
    marginBottom: theme.spacing.lg,
  },
  bannerCard: {
    height: 200,
    justifyContent: 'flex-end',
    backgroundColor: '#C4B5A5', // Placeholder for the beige image
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerContent: {
    zIndex: 2,
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bannerTitle: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.inverse,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerDescription: {
    color: theme.colors.text.inverse,
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    gap: theme.spacing.md,
  },
  listItem: {
    // Styles are handled by TeamRequestListItem component
  },
});
