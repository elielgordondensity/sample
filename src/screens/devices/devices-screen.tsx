import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { isLiquidGlassSupported, LiquidGlassContainerView } from '@callstack/liquid-glass';

import { spacing } from "../../components/tokens";
import { useTheme } from "../../theme/ThemeProvider";
import { Typography } from "../../components/typography";
import {
  EmptyView,
  ErrorView,
  LoadingView,
} from "../../components/ui";
import { useOrgProduct } from "../../context/OrgProductContext";
import { useInfiniteDevices } from "../../hooks/useApi";
import { useDeviceChannel } from "../../hooks/useDeviceChannel";
import type { Device } from "../../api/generated/schemas";
import { Button } from "../../components/button";
import { SearchInput } from "../../components/search-input";
import { DeviceCard } from "./device-card";

import SwitchIcon from "../../../assets/icons/products.svg";
import StarOutlineIcon from "../../../assets/icons/star-outline.svg";
import SearchIcon from "../../../assets/icons/search.svg";

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
  const { orgId, productId } = useOrgProduct();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const devicesQuery = useInfiniteDevices(debouncedSearch || undefined);

  // Real-time updates
  useDeviceChannel();

  function navigateToOrgProductSwitcher() {
    navigation.navigate("OrgProductModal");
  }

  const HeaderLeft = useMemo(() => {
    if (isLiquidGlassSupported) {
      return () => (
        <TouchableOpacity onPress={navigateToOrgProductSwitcher}>
          <SwitchIcon pointerEvents="none" width={22} height={22} color={colors.textPrimary} />
        </TouchableOpacity>
      );
    }

    return () => (
        <Button
          type="icon"
          size="xs"
          iconLeft={
            <SwitchIcon width={18} height={18} color={colors.textPrimary} />
          }
          onPress={navigateToOrgProductSwitcher}
      />
    );
  }, [navigateToOrgProductSwitcher]);

  function navigateToPinnedDevices() {
    navigation.navigate("PinnedDevices");
  }

  const HeaderRight = useMemo(() => {
    if (isLiquidGlassSupported) {
      return () => (
        <LiquidGlassContainerView style={styles.barItemGroup}>
          <TouchableOpacity onPress={navigateToPinnedDevices}>
            <SearchIcon pointerEvents="none" width={22} height={22} color={colors.textPrimary} />
          </TouchableOpacity>]
        </LiquidGlassContainerView>
      );
    }

    return () => (
        <Button
          type="icon"
          size="xs"
          iconLeft={
            <StarOutlineIcon width={18} height={18} color={colors.textPrimary} />
          }
          onPress={navigateToPinnedDevices}
      />
    );
  }, [navigateToPinnedDevices]);

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft: HeaderLeft,
      // headerRight: HeaderRight,
      unstable_headerLeftItems: () => [
        {
          type: "button",
          icon: {
            type: 'sfSymbol',
            name: 'repeat'
          },
          onPress: navigateToOrgProductSwitcher
       }
      ],
      unstable_headerRightItems: () => [
        // {
        //   type: 'button',
        //   label: 'Edit',
        //   icon: {
        //     type: 'sfSymbol',
        //     name: 'magnifyingglass',
        //   },
        //   onPress: () => {
        //     navigation.navigate("DeviceSearch");
        //   },
        // },
        {
          type: 'button',
          label: 'Pinned',
          icon: {
            type: 'sfSymbol',
            name: 'star',
            fill: "red"
          },
          onPress: navigateToPinnedDevices
        },
      ],
    });
  }, [navigation, HeaderLeft, HeaderRight]);

  if (devicesQuery.isLoading) return <LoadingView message="Loading devices…" />;
  if (devicesQuery.isError)
    return (
      <ErrorView
        message="Failed to load devices"
        onRetry={() => devicesQuery.refetch()}
      />
    );

  const devices = devicesQuery.data?.pages.flatMap((p) => p.data ?? []) ?? [];

  const renderDevice = ({ item }: { item: Device }) => (
    <DeviceCard
      device={item}
      onPress={(device) =>
        navigation.navigate("DeviceDetail", {
          deviceId: device.id!,
          identifier: String(device.identifier!),
        })
      }
    />
  );

  function renderListHeader() {
    return (
      <>
        <View style={styles.headerContent}>
          <Typography
            type="header"
            fontSize={24}
            fontWeight="600"
            lineHeight={28}
            marginBottom={4}
          >
            Devices
          </Typography>
          <Typography type="body" fontSize={14} color={colors.textSecondary}>
            {orgId} / {productId}
          </Typography>
        </View>
        <View style={styles.searchWrapper}>
          <SearchInput placeholder="Search devices" />
        </View>
      </>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={devices}
        keyExtractor={(item) => String(item.identifier)}
        renderItem={renderDevice}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderListHeader}
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
        ItemSeparatorComponent={() => <View style={{ height: 3 }} />}
        ListFooterComponent={
          devicesQuery.isFetchingNextPage ? (
            <ActivityIndicator
              style={styles.loadingFooter}
              color={colors.accent}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  barItemGroup: {
    flexDirection: "row",
    gap: 4
  },
  list: {
    paddingTop: 120,
    paddingBottom: 120,
  },
  headerContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,

  },
  searchWrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  loadingFooter: {
    paddingVertical: spacing.lg,
  },
});
