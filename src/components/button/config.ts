import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const BUTTON_SIZES = {
  none: { height: 19, borderRadius: 0, fontSize: 14, paddingHorizontal: 0 },
  xxs: { height: 28, borderRadius: 14, fontSize: 12, paddingHorizontal: 12 },
  xs: { height: 32, borderRadius: 16, fontSize: 12.5, paddingHorizontal: 12 },
  sm: { height: 40, borderRadius: 19, fontSize: 13, paddingHorizontal: 12 },
  md: { height: 46, borderRadius: 25, fontSize: 14, paddingHorizontal: 18 },
  lg: { height: 54, borderRadius: 27, fontSize: 14, paddingHorizontal: 12 },
  xl: { height: 60, borderRadius: 30, fontSize: 15, paddingHorizontal: 24 },
} as const;

export const BUTTON_VARIANTS = {
  primary: {
    backgroundColor: colors.midnight[2],
    textColor: colors.blue['000'],
    borderColor: '#102C4C00',
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: colors.amber[3],
    textColor: colors.midnight[2],
    borderColor: colors.amber[1],
    borderWidth: StyleSheet.hairlineWidth,
  },
  tertiary: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    textColor: '#121B03F5',
    borderColor: 'white',
    borderWidth: 1,
    boxShadow: {
      offsetX: 0,
      offsetY: 0,
      blurRadius: 1,
      spreadDistance: 10,
      inset: true,
      color: 'rgba(255, 255, 255, 0.1)',
    },
  },
  link: {
    backgroundColor: 'transparent',
    textColor: '#121B03F5',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  destructive: {
    backgroundColor: colors.red[400],
    textColor: colors.red[700],
    borderColor: colors.red[200],
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    backgroundColor: 'transparent',
    textColor: '#121B03F5',
    borderColor: 'white',
    borderWidth: 1,
  },
} as const;
