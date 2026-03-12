import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { trigger } from 'react-native-haptic-feedback';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  clamp,
} from 'react-native-reanimated';

import { LoadingIndicator } from '../loading-indicator';
import { Divider } from '../divider';
import { Typography } from '../typography';
import { useTheme } from '../../theme/ThemeProvider';

import { useLayoutDropdown } from './useLayoutDropdown';

export type DropDownItem<T> = {
  id: string;
  label: string;
  value?: T;
  iconLeft?: React.ReactElement | null | undefined;
  iconRight?: React.ReactElement | null | undefined;
};

export type DropDownSection<T> = {
  title: string;
  items: DropDownItem<T>[];
};

interface DropdownProps<T> {
  items?: DropDownItem<T>[];
  sections?: DropDownSection<T>[];
  defaultSelectedItemId?: string | null;
  isLoading?: boolean;
  disabled?: boolean;
  onSelect?: (item: DropDownItem<T>) => void;
  isDefaultOpen?: boolean;
  placeholderLabel?: string;
  pill?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  expandedPosition?: 'left' | 'center' | 'right';
  hasBorder?: boolean;
  hasShadow?: boolean;
  backgroundColor?: string | null;
  fullWidth?: boolean;
  fullItemsWidth?: boolean;
  showSectionItemCount?: boolean;
}

export function Dropdown<T>({
  items,
  sections,
  defaultSelectedItemId,
  onSelect,
  isLoading = false,
  disabled = false,
  isDefaultOpen = false,
  pill = false,
  placeholderLabel,
  size = 'md',
  hasBorder = true,
  hasShadow = true,
  backgroundColor = null,
  fullWidth = true,
  fullItemsWidth = false,
  showSectionItemCount = false,
}: DropdownProps<T>) {
  const { colors: themeColors } = useTheme();
  const resolvedBg = backgroundColor ?? themeColors.surface;
  const resolvedBorder = themeColors.inputBorder;
  const dropdownItemsWidthRef = useRef<number | null>(null);
  // Get all items from either items prop or sections prop
  const allItems = useMemo(() => {
    if (sections) {
      return sections.flatMap(section => section.items);
    }
    return items || [];
  }, [items, sections]);

  // Calculate total number of items including section headers
  const totalItemsWithHeaders = useMemo(() => {
    if (sections) {
      return sections.reduce(
        (total, section) => total + section.items.length + 1,
        0,
      ); // +1 for section header
    }
    return allItems.length;
  }, [sections, allItems]);

  const defaultSelectedItem = allItems.find(
    item => item.id === defaultSelectedItemId,
  );
  const [selectedItem, setSelectedItem] = useState<DropDownItem<T> | null>(
    defaultSelectedItem || null,
  );
  const dropdownButtonRef = useRef<View>(null);
  const { dropdownWindowStyle, onDropdownButtonLayout } = useLayoutDropdown(
    allItems,
    { left: 0 },
    fullItemsWidth,
  );
  const [isOpen, setIsOpen] = useState(isDefaultOpen);
  const animationValue = useSharedValue(isOpen ? 1 : 0);

  const toggleDropdown = useCallback(() => {
    trigger('selection', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    const newValue = !isOpen;
    setIsOpen(newValue);

    animationValue.value = withTiming(newValue ? 1 : 0, {
      duration: 300,
    });

    dropdownButtonRef.current?.measure((_fx, _fy, w, h, px, py) => {
      onDropdownButtonLayout(w, h, px, py, dropdownItemsWidthRef.current ?? 0);
    });
  }, [isOpen, animationValue, onDropdownButtonLayout]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animationValue.value,
      [0, 1],
      [0, clamp(totalItemsWithHeaders * 53, 0, 300)], // 53 is the height of each item/section header
    );

    return {
      height,
      opacity: animationValue.value,
    };
  });

  const rotateAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(animationValue.value, [0, 1], [0, 180]);

    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const handleSelectItem = useCallback(
    (item: DropDownItem<T>) => {
      setSelectedItem(item);
      onSelect?.(item);
      toggleDropdown();
    },
    [onSelect, toggleDropdown],
  );

  const renderItems = useMemo(() => {
    if (sections) {
      // Filters out sections with no items
      return sections
        .filter(section => section.items.length > 0)
        .map((section, sectionIndex) => (
          <View key={`section-${sectionIndex}`}>
            {sectionIndex !== 0 && <Divider />}
            <View style={styles.sectionHeader}>
              <Typography
                fontSize={11}
                fontType="native"
                fontWeight={700}
                letterSpacing={0.4}
                type="header"
              >
                {section.title.toUpperCase()}
                {showSectionItemCount && ` (${section.items.length})`}
              </Typography>
            </View>
            {section.items.map(item => (
              <View key={item.id} style={styles.itemWrapper}>
                <Divider />
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelectItem(item)}
                >
                  <View style={styles.iconLeftWithLabel}>
                    {item.iconLeft}
                    <Typography
                      fontSize={13}
                      fontType="native"
                      fontWeight={500}
                    >
                      {item.label}
                    </Typography>
                  </View>
                  {item.iconRight}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ));
    }

    return allItems.map((item, index) => (
      <View key={item.id} style={styles.itemWrapper}>
        {index !== 0 && <Divider />}
        <TouchableOpacity
          style={styles.item}
          onPress={() => handleSelectItem(item)}
        >
          <View style={styles.iconLeftWithLabel}>
            {item.iconLeft}
            <Typography fontSize={14} fontWeight={500}>
              {item.label}
            </Typography>
          </View>
          {item.iconRight}
        </TouchableOpacity>
      </View>
    ));
  }, [allItems, sections, handleSelectItem, showSectionItemCount]);

  const onContentSizeChange = (contentWidth: number, _height: number) => {
    dropdownItemsWidthRef.current = contentWidth;
  };

  return (
    <TouchableOpacity
      ref={dropdownButtonRef}
      disabled={disabled}
      onPress={toggleDropdown}
      activeOpacity={0.75}
      style={[
        styles.container,
        disabled && styles.disabled,
        hasBorder && [styles.bordered, { borderColor: resolvedBorder }],
        hasShadow && styles.shadow,
        { backgroundColor: resolvedBg },
        size === 'xs' && { height: 36, borderRadius: 10 },
        size === 'sm' && { height: 40, borderRadius: 14 },
        size === 'md' && { height: 52, borderRadius: 18 },
        size === 'lg' && { height: 60 },
        pill && styles.pill,
        fullWidth && { flex: 1 },
      ]}
    >
      <Modal
        onRequestClose={toggleDropdown}
        supportedOrientations={['portrait', 'landscape']}
        animationType="none"
        transparent={true}
        visible={isOpen}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleDropdown}
          style={{
            ...styles.dropdownOverlay,
            ...{
              backgroundColor: 'transparent',
            },
          }}
        />
        <Animated.View
          style={[
            styles.itemsContainer,
            { backgroundColor: resolvedBg, borderColor: resolvedBorder },
            fullItemsWidth
              ? {
                  position: 'absolute',
                  bottom: dropdownWindowStyle.bottom,
                  top: dropdownWindowStyle.top,
                  height: dropdownWindowStyle.height,
                  maxHeight: dropdownWindowStyle.maxHeight,
                  width: dropdownWindowStyle.width,
                  left: dropdownWindowStyle.left,
                  right: dropdownWindowStyle.right,
                }
              : {
                  position: 'absolute',
                  bottom: dropdownWindowStyle.bottom,
                  left: dropdownWindowStyle.left,
                  right: dropdownWindowStyle.right,
                  top: dropdownWindowStyle.top,
                  height: dropdownWindowStyle.height,
                  maxHeight: dropdownWindowStyle.maxHeight,
                },
            containerAnimatedStyle,
          ]}
        >
          <ScrollView
            pinchGestureEnabled={false}
            onContentSizeChange={onContentSizeChange}
            style={styles.itemScroll}
            alwaysBounceVertical
          >
            {renderItems}
          </ScrollView>
        </Animated.View>
      </Modal>

      <View style={styles.header}>
        <View style={styles.iconLeftWithLabel}>
          {selectedItem?.iconLeft}
          <Typography
            fontWeight={500}
            fontSize={size === 'xs' ? 13 : 14}
            lineHeight={0}
            numberOfLines={1}
            ellipsizeMode="tail"
            type="header"
          >
            {selectedItem ? selectedItem?.label : placeholderLabel}
          </Typography>
        </View>
        {isLoading ? (
          <LoadingIndicator size={14} />
        ) : (
          <Animated.Text style={[styles.arrow, { color: themeColors.textTertiary }, rotateAnimatedStyle]}>
            ▼
          </Animated.Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    justifyContent: 'center',
  },
  shadow: {
    shadowOffset: { width: 0.5, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  bordered: {
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
  },
  disabled: {
    opacity: 0.5,
  },
  pill: { borderRadius: 26 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    // gap: 10,
    // flex: 1
  },
  iconLeftWithLabel: {
    // flex: 1,
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
    minWidth: 0,
  },
  arrow: {
    fontSize: 10,
    marginLeft: 10,
  },
  itemsContainer: {
    marginBottom: 34,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 18,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    minWidth: 80,
  },
  itemScroll: { overflow: 'hidden' },
  itemWrapper: {
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  sectionHeader: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    // backgroundColor: '#F8F9FA',
  },
  dropdownOverlay: {
    width: '100%',
    height: '100%',
  },
});
