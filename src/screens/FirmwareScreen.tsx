import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../components/tokens";
import { Card, EmptyView, ErrorView, LoadingView } from "../components/ui";
import { useFirmware } from "../hooks/useApi";
import type { Firmware } from "../api/generated/schemas";

export default function FirmwareScreen() {
  const firmwareQuery = useFirmware();

  if (firmwareQuery.isLoading)
    return <LoadingView message="Loading firmware…" />;
  if (firmwareQuery.isError)
    return (
      <ErrorView
        message="Failed to load firmware"
        onRetry={() => firmwareQuery.refetch()}
      />
    );

  const firmwares = [...(firmwareQuery.data?.data ?? [])].sort((a, b) => {
    const da = a.inserted_at ? new Date(a.inserted_at).getTime() : 0;
    const db = b.inserted_at ? new Date(b.inserted_at).getTime() : 0;
    return db - da;
  });

  const renderFirmware = ({ item }: { item: Firmware }) => (
    <Card>
      <View style={styles.headerRow}>
        <Text style={typography.subtitle}>v{item.version ?? "?"}</Text>
        <View style={styles.badges}>
          {item.signed && (
            <View style={styles.signedBadge}>
              <Text style={styles.signedText}>Signed</Text>
            </View>
          )}
        </View>
      </View>

      {item.description ? (
        <Text style={[typography.bodySmall, { marginTop: spacing.xs }]}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.metaGrid}>
        {item.platform && (
          <MetaItem label="Platform" value={item.platform} />
        )}
        {item.architecture && (
          <MetaItem label="Arch" value={item.architecture} />
        )}
        {item.author && <MetaItem label="Author" value={item.author} />}
      </View>

      {item.uuid && (
        <Text style={[typography.monoSmall, { marginTop: spacing.sm }]}>
          {item.uuid}
        </Text>
      )}

      {item.inserted_at && (
        <Text style={[typography.caption, { marginTop: spacing.xs }]}>
          {new Date(item.inserted_at).toLocaleDateString()}
        </Text>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firmware</Text>
      {firmwares.length === 0 ? (
        <EmptyView
          title="No Firmware"
          message="No firmware has been uploaded for this product."
        />
      ) : (
        <FlatList
          data={firmwares}
          keyExtractor={(item) => item.uuid ?? String(Math.random())}
          renderItem={renderFirmware}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={typography.caption}>{label}</Text>
      <Text style={typography.mono}>{value}</Text>
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
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  signedBadge: {
    backgroundColor: colors.successSubtle,
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  signedText: {
    ...typography.caption,
    color: colors.success,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  metaItem: {
    gap: 2,
  },
});
