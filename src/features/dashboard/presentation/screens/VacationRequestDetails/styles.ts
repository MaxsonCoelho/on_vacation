import { StyleSheet } from 'react-native';
import { theme } from '../../../../../core/design-system/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerInfo: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  headerIconCard: {
    width: 80,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // Adding a subtle shadow or background color to match "card" look
    backgroundColor: '#FFDAC1', // Light orange/peach as in prototype
    position: 'relative',
  },
  // Timeline Styles
  timelineContainer: {
    paddingLeft: theme.spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 60,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 30,
    marginRight: theme.spacing.md,
  },
  timelineIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: theme.colors.background, // Match screen background to hide line behind icon if needed
  },
  timelineLine: {
    position: 'absolute',
    top: 24,
    bottom: -10, // Extend to next item
    width: 1,
    backgroundColor: theme.colors.border,
    zIndex: 0,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2, // Align text with icon visually
  },
  timelineText: {
    marginTop: 2,
  },
});
