import { ViewStyle } from 'react-native';

const shadowColor = '#000000';

export const shadows = {
  /**
   * No shadow. Used to reset elevation.
   */
  none: {
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  /**
   * Subtle shadow for low elevation elements.
   * Best for: Small Cards, Buttons, Input focus states.
   */
  sm: {
    shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  } as ViewStyle,

  /**
   * Medium shadow for standard elevation.
   * Best for: Content Cards, Dropdowns, Popovers.
   */
  md: {
    shadowColor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,

  /**
   * Large shadow for high elevation.
   * Best for: Modals, Dialogs, Floating Action Buttons (FAB).
   */
  lg: {
    shadowColor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  } as ViewStyle,
} as const;

export type Shadow = keyof typeof shadows;
