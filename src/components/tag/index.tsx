import React from "react";
import { View, StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";

import { Typography } from "../typography";
import { colors } from "../../theme/colors";

export type TagColorScheme =
  | "gray"
  | "blue"
  | "orange"
  | "green"
  | "red"
  | "white";

export type TagSize = "xs" | "sm" | "md" | "lg";

export type TagProps = {
  label: string;
  colorScheme?: TagColorScheme;
  size?: TagSize;
  iconLeft?: {
    component: React.FC<SvgProps> | React.FC;
    props?: SvgProps | React.ComponentProps<React.FC>;
  };
  iconRight?: {
    component: React.FC<SvgProps>;
    props?: SvgProps | React.ComponentProps<React.FC>;
  };
  hasBorder?: boolean;
  hasShadow?: boolean;
  adjustIconPadding?: boolean;
  uppercase?: boolean;
};

interface ColorMap {
  backgroundColor: string;
  borderColor: string;
  fontColor: string;
}

export function getTagColorScheme(color: TagColorScheme): ColorMap {
  switch (color) {
    case "white":
      return {
        backgroundColor: "white",
        borderColor: "#111A021A",
        fontColor: "#383838",
      };
    case "gray":
      return {
        backgroundColor: colors.gray["000"],
        borderColor: colors.gray[200],
        fontColor: "#383838",
      };
    case "blue":
      return {
        backgroundColor: "#F5F9FF",
        borderColor: "#2C63CC4D",
        fontColor: "#2C63CC",
      };
    case "orange":
      return {
        backgroundColor: "#FFF1E0",
        borderColor: "#FD8E084D",
        fontColor: "#FD8E08",
      };
    case "green":
      return {
        backgroundColor: "#b0f3c0",
        borderColor: "#121B034D",
        fontColor: "#121B03F5",
      };
    case "red":
      return {
        backgroundColor: "#FFAFAF",
        borderColor: "#4D0000",
        fontColor: "#4D0000",
      };
    default: {
      // This ensures type safety by checking that we've handled all cases
      const _exhaustiveCheck: never = color;
      throw new Error(`Unhandled color scheme: ${_exhaustiveCheck}`);
    }
  }
}

// Get padding values based on tag size
export function getTagSizePadding(size: TagSize): {
  vertical: number;
  horizontal: number;
} {
  switch (size) {
    case "xs":
      return { vertical: 2, horizontal: 6 };
    case "sm":
      return { vertical: 4, horizontal: 8 };
    case "md":
      return { vertical: 6, horizontal: 12 };
    case "lg":
      return { vertical: 8, horizontal: 12 };
    default: {
      // This ensures type safety by checking that we've handled all cases
      const _exhaustiveCheck: never = size;
      throw new Error(`Unhandled size: ${_exhaustiveCheck}`);
    }
  }
}

export function Tag({
  label,
  colorScheme = "orange",
  size = "md",
  iconLeft,
  iconRight,
  hasBorder = false,
  hasShadow = false,
  adjustIconPadding = false,
  uppercase = false,
}: TagProps) {
  const { backgroundColor, fontColor, borderColor } =
    getTagColorScheme(colorScheme);
  const { vertical, horizontal } = getTagSizePadding(size);

  return (
    <View
      style={[
        styles.tag,
        hasShadow && styles.shadow,
        {
          borderWidth: hasBorder ? StyleSheet.hairlineWidth : 0,
          backgroundColor,
          borderColor,
          paddingVertical: vertical,
          paddingLeft:
            iconLeft && adjustIconPadding ? horizontal - 4 : horizontal,
          paddingRight: horizontal,
        },
      ]}
    >
      {iconLeft && <iconLeft.component {...iconLeft.props} />}

      <Typography
        fontSize={
          size === "xs" ? 10 : size === "sm" ? 12 : size === "md" ? 13 : 12
        }
        fontWeight={600}
        letterSpacing={0.15}
        textTransform={uppercase ? "uppercase" : "none"}
        color={fontColor}
      >
        {label}
      </Typography>

      {iconRight && <iconRight.component {...iconRight.props} />}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 20,
    borderCurve: "continuous",
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: 14,
    fontWeight: "600",
  },
  shadow: {
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
});
