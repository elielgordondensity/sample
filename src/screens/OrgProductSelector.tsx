import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "../components/tokens";
import { EmptyView, ErrorView, LoadingView } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useOrgs, useProducts } from "../hooks/useApi";

export default function OrgProductSelector() {
  const { selectOrgAndProduct, logout } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const orgsQuery = useOrgs();
  const productsQuery = useProducts(selectedOrg);

  const handleSelectProduct = (productName: string) => {
    if (!selectedOrg) return;
    selectOrgAndProduct(selectedOrg, productName);
  };

  // ── Org list ───────────────────────────────────────────────────
  if (!selectedOrg) {
    if (orgsQuery.isLoading) return <LoadingView message="Loading orgs…" />;
    if (orgsQuery.isError)
      return (
        <ErrorView
          message="Failed to load organizations"
          onRetry={() => orgsQuery.refetch()}
        />
      );

    const orgs = orgsQuery.data?.data ?? [];
    if (orgs.length === 0)
      return <EmptyView title="No Organizations" message="You don't belong to any organizations." />;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Organization</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={orgs}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedOrg(item.name)}
            >
              <Text style={typography.subtitle}>{item.name}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // ── Product list ───────────────────────────────────────────────
  if (productsQuery.isLoading)
    return <LoadingView message="Loading products…" />;
  if (productsQuery.isError)
    return (
      <ErrorView
        message="Failed to load products"
        onRetry={() => productsQuery.refetch()}
      />
    );

  const products = productsQuery.data?.data ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedOrg(null)}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumb}>{selectedOrg}</Text>
      </View>
      <Text style={[styles.title, { paddingHorizontal: spacing.lg }]}>
        Select Product
      </Text>

      {products.length === 0 ? (
        <EmptyView
          title="No Products"
          message="This organization has no products."
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id ?? item.name)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelectProduct(item.name ?? "")}
            >
              <Text style={typography.subtitle}>{item.name}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    paddingBottom: spacing.md,
  },
  logoutText: {
    ...typography.body,
    color: colors.danger,
  },
  backText: {
    ...typography.body,
    color: colors.accent,
  },
  breadcrumb: {
    ...typography.bodySmall,
    color: colors.accent,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  arrow: {
    ...typography.title,
    color: colors.textTertiary,
  },
});
