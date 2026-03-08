import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { radius, spacing } from "../components/tokens";
import { useTheme } from "../context/ThemeContext";
import { Typography } from "../components/typography";
import { EmptyView, ErrorView, LoadingView } from "../components/ui";
import { Tag } from "../components/tag";
import { useDeployments } from "../hooks/useApi";
import type { DeploymentGroup } from "../api/generated/schemas";

export default function DeploymentsScreen() {
  const { colors } = useTheme();
  const deploymentsQuery = useDeployments();

  if (deploymentsQuery.isLoading)
    return <LoadingView message="Loading deployments…" />;
  if (deploymentsQuery.isError)
    return (
      <ErrorView
        message="Failed to load deployments"
        onRetry={() => deploymentsQuery.refetch()}
      />
    );

  const deployments = [...(deploymentsQuery.data?.data ?? [])].sort((a, b) => {
    if (a.is_active && !b.is_active) return -1;
    if (!a.is_active && b.is_active) return 1;
    return 0;
  });

  const renderDeployment = ({ item }: { item: DeploymentGroup }) => {
    const isActive = item.is_active ?? item.state === "on";
    const tags = item.conditions?.tags ?? [];

    return (
      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Typography
            type="subheader"
            fontSize={20}
            fontWeight="600"
            lineHeight={28}
          >
            {item.name}
          </Typography>
          <View
            style={[
              styles.stateIndicator,
              {
                backgroundColor: isActive
                  ? colors.successSubtle
                  : colors.surfaceHover,
              },
            ]}
          >
            <View
              style={[
                styles.stateDot,
                {
                  backgroundColor: isActive
                    ? colors.success
                    : colors.textTertiary,
                },
              ]}
            />
            <Typography
              type="caption"
              fontSize={11}
              color={isActive ? colors.success : colors.textTertiary}
            >
              {isActive ? "Active" : "Inactive"}
            </Typography>
          </View>
        </View>

        {item.firmware?.version && (
          <View style={styles.firmwareRow}>
            <Typography
              type="caption"
              fontSize={11}
              color={colors.textTertiary}
            >
              Firmware
            </Typography>
            <Typography
              type="body"
              fontType="mono"
              fontSize={12}
              color={colors.textSecondary}
            >
              v{item.firmware.version}
            </Typography>
          </View>
        )}

        {item.conditions?.version && (
          <View style={styles.conditionRow}>
            <Typography
              type="caption"
              fontSize={11}
              color={colors.textTertiary}
            >
              Version
            </Typography>
            <Typography
              type="body"
              fontType="mono"
              fontSize={12}
              color={colors.textSecondary}
            >
              {item.conditions.version}
            </Typography>
          </View>
        )}

        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            <Typography
              type="caption"
              fontSize={11}
              marginRight={spacing.sm}
              color={colors.textTertiary}
            >
              Tags
            </Typography>
            {tags.map((tag) => (
              <Tag key={tag} label={tag} size="sm" colorScheme="red" />
            ))}
          </View>
        )}

        {item.device_count != null && (
          <Typography
            type="body"
            fontSize={12}
            marginTop={spacing.sm}
            color={colors.textTertiary}
          >
            {item.device_count} device{item.device_count !== 1 ? "s" : ""}
          </Typography>
        )}
      </View>
    );
  };

  function renderListHeader() {
    return (
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
        Deployments
      </Typography>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={deployments}
        keyExtractor={(item) => String(item.id ?? item.name)}
        renderItem={renderDeployment}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <EmptyView
            title="No Deployments"
            message="No deployment groups exist for this product."
          />
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  row: {
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stateIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  stateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  firmwareRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});
