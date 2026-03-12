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

export function getButtonVariants(isDark: boolean) {
  return {
    primary: {
      backgroundColor: isDark ? colors.blue['600'] : colors.midnight[2],
      textColor: isDark ? '#F0F3F6' : colors.blue['000'],
      borderColor: '#102C4C00',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: isDark ? colors.amber[4] : colors.amber[3],
      textColor: isDark ? '#F0F3F6' : colors.midnight[2],
      borderColor: isDark ? colors.amber[4] : colors.amber[1],
      borderWidth: StyleSheet.hairlineWidth,
    },
    tertiary: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.6)',
      textColor: isDark ? '#C9D1D9' : '#121B03F5',
      borderColor: isDark ? '#30363D' : 'white',
      borderWidth: 1,
    },
    link: {
      backgroundColor: 'transparent',
      textColor: isDark ? '#C9D1D9' : '#121B03F5',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    destructive: {
      backgroundColor: isDark ? colors.red[800] : colors.red[400],
      textColor: isDark ? colors.red[200] : colors.red[700],
      borderColor: isDark ? colors.red[600] : colors.red[200],
      borderWidth: StyleSheet.hairlineWidth,
    },
    icon: {
      backgroundColor: 'transparent',
      textColor: isDark ? '#C9D1D9' : '#121B03F5',
      borderColor: isDark ? '#30363D' : 'white',
      borderWidth: 1,
    },
  } as const;
}

// Keep backward compat — light variants as default export
export const BUTTON_VARIANTS = getButtonVariants(false);
