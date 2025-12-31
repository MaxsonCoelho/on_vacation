/**
 * Design System Typography Tokens
 * 
 * Mobile-first typography scale designed for maximum legibility.
 * Uses coherent scales for font size, line height, and letter spacing.
 */

// Font Families
// We use the system font stack by default for best platform integration.
const fontFamily = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
};

// Font Weights
const weight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

// Font Sizes
const fontSize = {
  title: 24,
  subtitle: 20,
  body: 16,
  label: 14,
  caption: 12,
};

// Line Heights
// Generally 1.2 - 1.5 ratio depending on size
const lineHeight = {
  title: 32,
  subtitle: 28,
  body: 24,
  label: 20,
  caption: 16,
};

// Letter Spacing
const letterSpacing = {
  default: 0,
  tight: -0.5, // For large titles
  wide: 0.5,   // For uppercase labels
};

export const typography = {
  fontFamily,
  weight,
  fontSize,
  lineHeight,
  letterSpacing,
};
