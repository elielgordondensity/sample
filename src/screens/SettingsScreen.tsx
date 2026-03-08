import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { radius, spacing } from "../components/tokens";
import { useTheme, type ThemeMode } from "../context/ThemeContext";
import { Typography } from "../components/typography";
import { useAuth } from "../context/AuthContext";
import { useOrgProduct } from "../context/OrgProductContext";

const themeModes: { label: string; value: ThemeMode }[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const { user, logout } = useAuth();
  const { orgId, productId, resetOrgAndProduct } = useOrgProduct();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Typography
        type="header"
        fontSize={26}
        fontWeight="600"
        lineHeight={28}
        marginBottom={4}
        paddingHorizontal={spacing.lg}
        paddingTop={spacing.lg}
        paddingBottom={spacing.md}
      >
        Settings
      </Typography>

      <View style={styles.section}>
        <Typography
          type="caption"
          fontSize={11}
          textTransform="uppercase"
          letterSpacing={1}
          paddingHorizontal={spacing.lg}
          paddingBottom={spacing.xs}
          color={colors.textTertiary}
        >
          Account
        </Typography>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Typography type="subheader" fontSize={20} fontWeight="600" lineHeight={28}>
            {user?.name ?? "—"}
          </Typography>
          <Typography type="body" fontSize={12} marginTop={spacing.xs} color={colors.textSecondary}>
            {user?.email ?? "—"}
          </Typography>
        </View>
      </View>

      <View style={styles.section}>
        <Typography
          type="caption"
          fontSize={11}
          textTransform="uppercase"
          letterSpacing={1}
          paddingHorizontal={spacing.lg}
          paddingBottom={spacing.xs}
          color={colors.textTertiary}
        >
          Organization
        </Typography>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Typography type="body" fontSize={14}>
            {orgId} / {productId}
          </Typography>
          <TouchableOpacity
            style={[styles.button, { borderColor: colors.accent }]}
            onPress={resetOrgAndProduct}
          >
            <Typography type="body" fontSize={14} color={colors.accent}>
              Switch Product
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Typography
          type="caption"
          fontSize={11}
          textTransform="uppercase"
          letterSpacing={1}
          paddingHorizontal={spacing.lg}
          paddingBottom={spacing.xs}
          color={colors.textTertiary}
        >
          Appearance
        </Typography>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.segmentedControl}>
            {themeModes.map(({ label, value }) => {
              const isActive = mode === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.segment,
                    isActive && { backgroundColor: colors.accent },
                  ]}
                  onPress={() => setMode(value)}
                >
                  <Typography
                    type="body"
                    fontSize={14}
                    color={isActive ? colors.white : colors.textSecondary}
                    fontWeight={isActive ? "600" : "400"}
                  >
                    {label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.dangerSubtle }]}
        onPress={logout}
      >
        <Typography type="destructive" fontSize={14} fontWeight="600" color={colors.danger}>
          Logout
        </Typography>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  button: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: "flex-start",
    marginTop: spacing.md,
  },
  segmentedControl: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  logoutButton: {
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    alignItems: "center",
  },
});
