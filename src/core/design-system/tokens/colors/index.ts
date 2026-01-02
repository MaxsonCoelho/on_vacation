/**
 * Design System Color Tokens
 * 
 * A premium, modern color palette designed for a corporate vacation application.
 * Focuses on clean UX, accessibility, and semantic clarity.
 */

// Base Palette - Primitive values (Private)
const palette = {
  // Brand - Ocean & Sky
  primary: {
    main: '#0066CC', // Trusted, professional blue
    light: '#4D94FF',
    dark: '#004C99',
    contrast: '#FFFFFF',
  },
  // Accent - Sunset & Sand
  secondary: {
    main: '#FF8C42', // Warm, inviting accent
    light: '#FFB07F',
    dark: '#CC5F22',
    contrast: '#FFFFFF',
  },
  // Neutrals - Modern Grayscale
  neutral: {
    white: '#FFFFFF',
    background: '#F8F9FA', // Soft off-white for reduced eye strain
    surface: '#FFFFFF',
    lightGrey: '#E9ECEF',
    grey: '#DEE2E6',
    darkGrey: '#495057',
    black: '#212529',
  },
  // Semantic - Feedback
  status: {
    success: '#28A745', // Clear success
    warning: '#FFC107', // Noticeable warning
    error: '#DC3545',   // Urgent error
    info: '#17A2B8',    // Helpful info
  },
  // Brand - Role based
  brand: {
    collaborator: '#0066CC', // Default Blue
    manager: '#009933',      // Dark Green
    admin: '#CC5F22',        // Dark Orange
  },
};

export const colors = {
  /**
   * Primary brand colors.
   * Used for main actions, active states, and brand identity.
   */
  primary: palette.primary.main,
  primaryDark: palette.primary.dark,
  primaryLight: palette.primary.light,
  primaryContrast: palette.primary.contrast,

  /**
   * Role-based brand colors.
   * Used to distinguish different user profiles.
   */
  brand: {
    collaborator: palette.brand.collaborator,
    manager: palette.brand.manager,
    admin: palette.brand.admin,
  },

  /**
   * Secondary brand colors.
   * Used for highlights, floating action buttons, and accents.
   */
  secondary: palette.secondary.main,
  secondaryDark: palette.secondary.dark,
  secondaryLight: palette.secondary.light,
  secondaryContrast: palette.secondary.contrast,

  /**
   * Background colors.
   * Defines the canvas of the application.
   */
  background: palette.neutral.background, // Main app background
  
  /**
   * Surface colors.
   * Used for cards, modals, and elevated elements.
   */
  surface: palette.neutral.surface,

  /**
   * Text and Typography colors.
   * High contrast ensures readability and accessibility.
   */
  text: {
    primary: palette.neutral.black,    // Main content
    secondary: palette.neutral.darkGrey, // Subtitles, supporting text
    inverse: palette.neutral.white,    // Text on dark backgrounds
    disabled: '#ADB5BD',               // Unavailable text
    link: palette.primary.main,        // Interactive text
  },

  /**
   * Borders and Dividers.
   * Subtle separation between elements.
   */
  border: palette.neutral.grey,

  /**
   * Status indicators.
   * Semantic colors for user feedback.
   */
  status: {
    success: palette.status.success,
    warning: palette.status.warning,
    error: palette.status.error,
    info: palette.status.info,
  },

  /**
   * Interaction states.
   * Specific overrides for disabled or interactive elements.
   */
  action: {
    active: palette.primary.main,
    disabledBackground: palette.neutral.lightGrey,
    disabledText: '#ADB5BD',
    hover: 'rgba(0, 0, 0, 0.04)',
    pressed: 'rgba(0, 0, 0, 0.12)',
  },
};
