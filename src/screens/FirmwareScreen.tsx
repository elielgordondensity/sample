import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing } from "../components/tokens";
import { useTheme } from "../context/ThemeContext";
import { Typography } from "../components/typography";
import { EmptyView, ErrorView, LoadingView } from "../components/ui";
import { useFirmware } from "../hooks/useApi";
import type { Firmware } from "../api/generated/schemas";

export default function FirmwareScreen() {
  const { colors } = useTheme();
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
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.headerRow}>
        <Typography type="subheader" fontSize={20} fontWeight="600" lineHeight={28}>
          v{item.version ?? "?"}
        </Typography>
        <View style={styles.badges}>
          {item.signed && (
            <View
              style={[
                styles.signedBadge,
                { backgroundColor: colors.successSubtle },
              ]}
            >
              <Typography type="caption" fontSize={11} color={colors.success}>
                Signed
              </Typography>
            </View>
          )}
        </View>
      </View>

      {item.description ? (
        <Typography type="body" fontSize={12} marginTop={spacing.xs} color={colors.textSecondary}>
          {item.description}
        </Typography>
      ) : null}

      <View style={styles.metaGrid}>
        {item.platform && <MetaItem label="Platform" value={item.platform} />}
        {item.architecture && (
          <MetaItem label="Arch" value={item.architecture} />
        )}
        {item.author && <MetaItem label="Author" value={item.author} />}
      </View>

      {item.uuid && (
        <Typography type="caption" fontType="mono" fontSize={10} marginTop={spacing.sm} color={colors.textTertiary}>
          {item.uuid}
        </Typography>
      )}

      {item.inserted_at && (
        <Typography type="caption" fontSize={11} marginTop={spacing.xs} color={colors.textTertiary}>
          {new Date(item.inserted_at).toLocaleDateString()}
        </Typography>
      )}
    </View>
  );

  function renderListHeader() {
    return (
      <Typography type="header" fontSize={26} fontWeight="600" lineHeight={28} marginBottom={4} paddingHorizontal={spacing.lg} paddingTop={spacing.lg} paddingBottom={spacing.md}>
        Firmware
      </Typography>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={firmwares}
        keyExtractor={(item) => item.uuid ?? String(Math.random())}
        renderItem={renderFirmware}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <EmptyView
            title="No Firmware"
            message="No firmware has been uploaded for this product."
          />
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.metaItem}>
      <Typography type="caption" fontSize={11} color={colors.textTertiary}>
        {label}
      </Typography>
      <Typography type="body" fontType="mono" fontSize={12} color={colors.textSecondary}>
        {value}
      </Typography>
    </View>
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
  badges: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  signedBadge: {
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
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
