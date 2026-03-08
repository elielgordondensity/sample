import React, { useCallback } from 'react';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import {
  Text,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { trigger } from 'react-native-haptic-feedback';

interface LiquidGlassButtonProps {
  onPress: () => void;
  title?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  hasShadow?: boolean;
}

const SIZES = {
  sm: { height: 36, paddingHorizontal: 14, fontSize: 13, borderRadius: 18 },
  md: { height: 44, paddingHorizontal: 18, fontSize: 14, borderRadius: 22 },
  lg: { height: 52, paddingHorizontal: 24, fontSize: 15, borderRadius: 26 },
} as const;

export function LiquidGlassButton({
  onPress,
  title,
  icon,
  size = 'md',
  hasShadow = true,
  style,
  textStyle,
}: LiquidGlassButtonProps) {
  const sizeConfig = SIZES[size];
  const isIconOnly = icon && !title;

  const buttonStyle: ViewStyle = {
    height: sizeConfig.height,
    paddingHorizontal: isIconOnly ? 0 : sizeConfig.paddingHorizontal,
    width: isIconOnly ? sizeConfig.height : undefined,
    borderRadius: sizeConfig.borderRadius,
    backgroundColor: 'rgba(228, 228, 228, 0.6)',
  };

  const shadowStyle: ViewStyle = {
    boxShadow: hasShadow
      ? [
          {
            offsetX: 0.5,
            offsetY: 2,
            blurRadius: 4,
            spreadDistance: 1,
            color: 'rgba(0, 0, 0, 0.08)',
          },
        ]
      : undefined,
  };

  const handlePress = useCallback(
    (_event: GestureResponderEvent) => {
      trigger('impactLight');
      onPress();
    },
    [onPress],
  );

  // Use native liquid glass on iOS 26+, fallback blur on older versions
  if (isLiquidGlassSupported) {
    return (
      <View style={[shadowStyle, buttonStyle]}>
        <LiquidGlassView
          style={[styles.glassButton, buttonStyle, style]}
          interactive
          effect="regular"
          onTouchEnd={handlePress}
        >
          <View style={styles.buttonContent} pointerEvents="none">
            {icon}
            {title && (
              <Text
                style={[
                  styles.buttonText,
                  { fontSize: sizeConfig.fontSize },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            )}
          </View>
        </LiquidGlassView>
      </View>
    );
  }

  // Fallback for non-supported devices
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fallbackButton,
        buttonStyle,
        shadowStyle,
        style,
        pressed && styles.pressed,
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={20}
        reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.8)"
      />
      {icon}
      {title && (
        <Text
          style={[
            styles.buttonText,
            { fontSize: sizeConfig.fontSize },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glassButton: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fallbackButton: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    flexDirection: 'row',
    gap: 6,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontFamily: 'Inter Variable',
  },
});
