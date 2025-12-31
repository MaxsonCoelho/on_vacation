/**
 * Design System Typography Tokens
 * 
 * Mobile-first typography scale designed for maximum legibility.
 * Uses coherent scales for font size, line height, and letter spacing.
 * Uses RFValue for responsiveness across different screen sizes.
 */

import { RFValue } from 'react-native-responsive-fontsize';

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

// Font Sizes - Responsive
const fontSize = {
  h1: RFValue(32),
  h2: RFValue(24),
  h3: RFValue(20),
  title: RFValue(24),
  subtitle: RFValue(20),
  body: RFValue(14),
  label: RFValue(14),
  caption: RFValue(12),
};

// Line Heights - Responsive
// Generally 1.2 - 1.5 ratio depending on size
const lineHeight = {
  h1: RFValue(40),
  h2: RFValue(32),
  h3: RFValue(28),
  title: RFValue(32),
  subtitle: RFValue(28),
  body: RFValue(24),
  label: RFValue(20),
  caption: RFValue(16),
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
