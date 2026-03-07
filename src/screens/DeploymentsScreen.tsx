import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../components/tokens";
import { Card, EmptyView, ErrorView, LoadingView, TagPill } from "../components/ui";
import { useDeployments } from "../hooks/useApi";
import type { DeploymentGroup } from "../api/generated/schemas";

export default function DeploymentsScreen() {
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

  const deployments = [...(deploymentsQuery.data?.data ?? [])].sort(
    (a, b) => {
      // Active first
      if (a.is_active && !b.is_active) return -1;
      if (!a.is_active && b.is_active) return 1;
      return 0;
    },
  );

  const renderDeployment = ({ item }: { item: DeploymentGroup }) => {
    const isActive = item.is_active ?? item.state === "on";
    const tags = item.conditions?.tags ?? [];

    return (
      <Card>
        <View style={styles.headerRow}>
          <Text style={typography.subtitle}>{item.name}</Text>
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
            <Text
              style={[
                typography.caption,
                {
                  color: isActive ? colors.success : colors.textTertiary,
                },
              ]}
            >
              {isActive ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>

        {item.firmware?.version && (
          <View style={styles.firmwareRow}>
            <Text style={typography.caption}>Firmware</Text>
            <Text style={typography.mono}>v{item.firmware.version}</Text>
          </View>
        )}

        {item.conditions?.version && (
          <View style={styles.conditionRow}>
            <Text style={typography.caption}>Version</Text>
            <Text style={typography.mono}>{item.conditions.version}</Text>
          </View>
        )}

        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            <Text style={[typography.caption, { marginRight: spacing.sm }]}>
              Tags
            </Text>
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </View>
        )}

        {item.device_count != null && (
          <Text style={[typography.bodySmall, { marginTop: spacing.sm }]}>
            {item.device_count} device{item.device_count !== 1 ? "s" : ""}
          </Text>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deployments</Text>
      {deployments.length === 0 ? (
        <EmptyView
          title="No Deployments"
          message="No deployment groups exist for this product."
        />
      ) : (
        <FlatList
          data={deployments}
          keyExtractor={(item) => String(item.id ?? item.name)}
          renderItem={renderDeployment}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.title,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.xl,
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
