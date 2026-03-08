import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { radius, spacing } from "../components/tokens";
import { useTheme } from "../context/ThemeContext";
import { Typography } from "../components/typography";
import { Tag } from "../components/tag";
import {
  EmptyView,
  ErrorView,
  LoadingView,
  OnlineBadge,
  UpdateStatusChip,
} from "../components/ui";
import { useOrgProduct } from "../context/OrgProductContext";
import { useInfiniteDevices } from "../hooks/useApi";
import { useDeviceChannel } from "../hooks/useDeviceChannel";
import type { Device } from "../api/generated/schemas";
import { PulsatingDotWithRipple } from "../components/pulsating-dot";

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function DevicesScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { orgId, productId, resetOrgAndProduct } = useOrgProduct();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const devicesQuery = useInfiniteDevices(debouncedSearch || undefined);

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

  const devices = devicesQuery.data?.pages.flatMap((p) => p.data ?? []) ?? [];

  const renderDevice = ({ item }: { item: Device }) => {
    const tags = Array.isArray(item.tags)
      ? item.tags
      : typeof item.tags === "string"
        ? item.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.row, { borderBottomColor: colors.border }]}
        onPress={() =>
          navigation.navigate("DeviceDetail", {
            identifier: String(item.identifier),
          })
        }
      >
        <View style={styles.rowContent}>
          <View style={styles.deviceHeader}>
            <Typography type="header" fontSize={15} fontWeight="600">
              {String(item.identifier)}
            </Typography>
            <Tag
              label={item.online ? "Online" : "Offline"}
              iconLeft={{ component: PulsatingDotWithRipple }}
            />
            <OnlineBadge online={item.online ?? false} />
          </View>

          {item.description ? (
            <Typography
              type="body"
              fontSize={12}
              marginTop={spacing.xs}
              color={colors.textSecondary}
            >
              {item.description}
            </Typography>
          ) : null}

          {item.version && (
            <Typography
              type="subheader"
              fontType="regular"
              fontSize={14}
              lineHeight={26}
              color={colors.textSecondary}
            >
              v{item.version}
            </Typography>
          )}
          {/*<UpdateStatusChip status={item.version} />*/}

          {tags.length > 0 && (
            <View style={styles.tagsRow}>
              {tags.map((tag) => (
                <Tag key={tag} label={tag} colorScheme="gray" size="sm" />
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const listHeader = (
    <>
      <View style={styles.headerRow}>
        <View>
          <Typography
            type="header"
            fontSize={26}
            fontWeight="600"
            lineHeight={28}
            marginBottom={4}
          >
            Devices
          </Typography>
          <Typography type="body" fontSize={12} color={colors.textSecondary}>
            {orgId} / {productId}
          </Typography>
        </View>
        <TouchableOpacity
          style={[styles.swapButton, { borderColor: colors.accent }]}
          onPress={resetOrgAndProduct}
        >
          <Typography type="body" fontSize={14} color={colors.accent}>
            Switch
          </Typography>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.textPrimary,
          },
        ]}
        value={search}
        onChangeText={setSearch}
        placeholder="Search devices…"
        placeholderTextColor={colors.textPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={devices}
        keyExtractor={(item) => String(item.identifier)}
        renderItem={renderDevice}
        contentContainerStyle={styles.list}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <EmptyView
            title="No Devices"
            message={
              search
                ? "No devices match your search."
                : "No devices found for this product."
            }
          />
        }
        onEndReached={() => {
          if (devicesQuery.hasNextPage && !devicesQuery.isFetchingNextPage) {
            devicesQuery.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          devicesQuery.isFetchingNextPage ? (
            <ActivityIndicator
              style={styles.loadingFooter}
              color={colors.accent}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: 14,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  loadingFooter: {
    paddingVertical: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowContent: {
    flex: 1,
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
