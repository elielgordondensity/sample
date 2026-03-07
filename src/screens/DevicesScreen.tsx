import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "../components/tokens";
import {
  Card,
  EmptyView,
  ErrorView,
  LoadingView,
  OnlineBadge,
  TagPill,
  UpdateStatusChip,
} from "../components/ui";
import { useOrgProduct } from "../context/OrgProductContext";
import { useDevices } from "../hooks/useApi";
import { useDeviceChannel } from "../hooks/useDeviceChannel";
import type { Device } from "../api/generated/schemas";

export default function DevicesScreen() {
  const { org, product, resetOrgAndProduct } = useOrgProduct();
  const [search, setSearch] = useState("");
  const devicesQuery = useDevices(search ? { search } : undefined);

  // Real-time updates
  useDeviceChannel();

  if (devicesQuery.isLoading) return <LoadingView message="Loading devices…" />;
  if (devicesQuery.isError)
    return (
      <ErrorView
        message="Failed to load devices"
        onRetry={() => devicesQuery.refetch()}
      />
    );

  const devices = devicesQuery.data?.data ?? [];

  const renderDevice = ({ item }: { item: Device }) => {
    const tags = item.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

    return (
      <Card>
        <View style={styles.deviceHeader}>
          <Text style={typography.subtitle}>
            {String(item.identifier)}
          </Text>
          <OnlineBadge online={item.online ?? false} />
        </View>

        {item.description ? (
          <Text style={[typography.bodySmall, { marginTop: spacing.xs }]}>
            {item.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          {item.firmware_metadata?.firmware_version && (
            <Text style={typography.mono}>
              v{item.firmware_metadata.firmware_version}
            </Text>
          )}
          <UpdateStatusChip status={item.version} />
        </View>

        {item.firmware_metadata?.firmware_uuid && (
          <Text style={[typography.monoSmall, { marginTop: spacing.xs }]}>
            {item.firmware_metadata.firmware_uuid}
          </Text>
        )}

        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </View>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={typography.title}>Devices</Text>
          <Text style={typography.bodySmall}>
            {org} / {product}
          </Text>
        </View>
        <TouchableOpacity style={styles.swapButton} onPress={resetOrgAndProduct}>
          <Text style={styles.swapText}>Switch</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholder="Search devices…"
        placeholderTextColor={colors.textPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {devices.length === 0 ? (
        <EmptyView
          title="No Devices"
          message={search ? "No devices match your search." : "No devices found for this product."}
        />
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => String(item.identifier)}
          renderItem={renderDevice}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  swapButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  swapText: {
    ...typography.body,
    color: colors.accent,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    fontSize: 14,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});
