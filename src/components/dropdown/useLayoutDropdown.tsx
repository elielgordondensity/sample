import { useEffect, useState, useMemo } from 'react';
import { Dimensions, ViewStyle } from 'react-native';

const { height, width: screenWidth } = Dimensions.get('window');
const DROPDOWN_MAX_HEIGHT = height * 0.4;

export const getDropdownHeight = (
  dropdownStyle: ViewStyle,
  dataLength: number,
) => {
  if (dropdownStyle && dropdownStyle.height) {
    return dropdownStyle.height;
  } else {
    if (dataLength === 0) {
      return 150;
    }
  }
};

// eslint-disable-next-line
export const useLayoutDropdown = (
  data: any[],
  dropdownStyle: ViewStyle,
  fullWidth = false,
) => {
  const [isVisible, setIsVisible] = useState(false); // dropdown visible ?
  const [buttonLayout, setButtonLayout] = useState<{
    w: number;
    h: number;
    px: number;
    py: number;
  } | null>(null);
  const [dropdownCalculatedStyle, setDropdownCalculatedStyle] = useState<
    Partial<ViewStyle>
  >({});

  const [dropdownHEIGHT, setDropdownHEIGHT] = useState(() => {
    return getDropdownHeight(dropdownStyle, data?.length || 0);
  }); // dropdown height

  useEffect(() => {
    setDropdownHEIGHT(getDropdownHeight(dropdownStyle, data?.length || 0));
  }, [dropdownStyle, data]);

  const onDropdownButtonLayout = (
    w: number,
    h: number,
    px: number,
    py: number,
    dropdownItemsWidth: number,
  ) => {
    setButtonLayout({ w, h, px, py });

    const remainingHeight = (dropdownStyle?.height || height / 4) as number;

    const dropdownWidth = dropdownItemsWidth;
    const proposedLeft = px;
    const anchorRight = Math.max(0, px - (dropdownItemsWidth - w));
    const shouldAnchorToRight =
      px + w >= 0.9 * screenWidth || proposedLeft + dropdownWidth > screenWidth;
    const horizontalStyle: Partial<ViewStyle> = {
      left: shouldAnchorToRight ? anchorRight : proposedLeft,
    };

    if (fullWidth) {
      return setDropdownCalculatedStyle({
        top: py + h + 2,
        width: dropdownStyle?.width || w,
        bottom: height - (py + h) + h,
        left: px,
      });
    }

    if (py + h > height - remainingHeight) {
      return setDropdownCalculatedStyle({
        bottom: height - (py + h) + h,
        width: dropdownWidth,
        ...horizontalStyle,
      });
    }

    return setDropdownCalculatedStyle({
      top: py + h + 2,
      width: dropdownWidth,
      ...horizontalStyle,
    });
  };

  const dropdownWindowStyle: ViewStyle = useMemo(() => {
    // minimum dropdownheight to show while keyboard is opened
    const getPositionIfKeyboardIsOpened = () => {
      return {};
    };

    return {
      ...{
        borderTopWidth: 0,
      },
      ...dropdownStyle,
      ...dropdownCalculatedStyle,
      ...{
        position: 'absolute',
        height: dropdownHEIGHT,
        maxHeight: DROPDOWN_MAX_HEIGHT,
      },
      ...getPositionIfKeyboardIsOpened(),
    };
  }, [dropdownStyle, dropdownCalculatedStyle, dropdownHEIGHT]);

  const onRequestClose = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    setIsVisible,
    buttonLayout,
    onDropdownButtonLayout,
    dropdownWindowStyle,
    onRequestClose,
  };
};
