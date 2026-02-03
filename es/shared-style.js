// ============================================
// Modern Design System - Easy 3D Builder
// ============================================

// Base Colors
export var COLORS = {
  white: '#FFFFFF',
  black: '#000000',
  // Gray scale (modern neutral palette)
  gray50: '#FAFAFA',
  gray100: '#F4F4F5',
  gray200: '#E4E4E7',
  gray300: '#D4D4D8',
  gray400: '#A1A1AA',
  gray500: '#71717A',
  gray600: '#52525B',
  gray700: '#3F3F46',
  gray800: '#27272A',
  gray900: '#18181B',
  gray950: '#09090B'
};

// Material Design Colors (kept for compatibility)
export var MATERIAL_COLORS = {
  500: {
    amber: '#F59E0B',
    blue_grey: '#64748B',
    blue: '#3B82F6',
    brown: '#A16207',
    cyan: '#06B6D4',
    deep_orange: '#F97316',
    deep_purple: '#7C3AED',
    green: '#22C55E',
    grey: '#6B7280',
    indigo: '#6366F1',
    light_blue: '#0EA5E9',
    light_green: '#84CC16',
    lime: '#A3E635',
    orange: '#F97316',
    pink: '#EC4899',
    purple: '#A855F7',
    red: '#EF4444',
    teal: '#14B8A6',
    yellow: '#EAB308'
  }
};

// Primary Theme Colors (Dark Mode - OLED Friendly)
export var PRIMARY_COLOR = {
  main: '#0F0F10', // Deep black background
  alt: '#1A1A1D', // Slightly lighter panel background
  icon: '#A1A1AA', // Muted gray for inactive icons
  border: '1px solid rgba(255,255,255,0.08)',
  text_main: '#FAFAFA', // High contrast white text
  text_alt: '#D4D4D8', // Secondary text
  text_muted: '#71717A', // Muted text
  input: '#27272A', // Input background
  surface: '#18181B', // Card/surface background
  hover: '#27272A' // Hover state background
};

// Secondary/Accent Colors
export var SECONDARY_COLOR = {
  main: '#3B82F6', // Primary blue
  alt: '#2563EB', // Darker blue for hover
  light: '#60A5FA', // Lighter blue for accents
  icon: '#3B82F6', // Icon highlight color
  border: '1px solid #3B82F6',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)' // Subtle glow effect
};

// CTA/Action Colors
export var CTA_COLOR = {
  main: '#F97316', // Orange for CTAs
  hover: '#EA580C', // Darker orange on hover
  text: '#FFFFFF'
};

// Status Colors
export var STATUS_COLORS = {
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
  info: '#3B82F6'
};

// 3D Mesh Colors
export var MESH_SELECTED = '#60A5FA';

export var AREA_MESH_COLOR = {
  selected: MESH_SELECTED,
  unselected: '#E4E4E7'
};

export var LINE_MESH_COLOR = {
  selected: MESH_SELECTED,
  unselected: '#71717A'
};

// Typography
export var TYPOGRAPHY = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFamilyMono: "'Fira Code', 'SF Mono', Monaco, Consolas, monospace",
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '24px'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  }
};

// Spacing Scale
export var SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px'
};

// Border Radius
export var RADIUS = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px'
};

// Shadows (subtle for dark mode)
export var SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
  glow: '0 0 20px rgba(59, 130, 246, 0.15)',
  inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)'
};

// Transitions
export var TRANSITIONS = {
  fast: 'all 150ms ease-out',
  normal: 'all 200ms ease-out',
  slow: 'all 300ms ease-out',
  colors: 'background-color 200ms ease-out, border-color 200ms ease-out, color 200ms ease-out'
};

// Z-Index Scale
export var Z_INDEX = {
  dropdown: 100,
  sticky: 200,
  modal: 300,
  popover: 400,
  tooltip: 500
};