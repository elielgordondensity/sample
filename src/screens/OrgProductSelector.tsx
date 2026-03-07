import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "../components/tokens";
import { EmptyView, ErrorView, LoadingView } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useOrgProduct } from "../context/OrgProductContext";
import { useAllOrgProducts } from "../hooks/useApi";

export default function OrgProductSelector() {
  const { logout } = useAuth();
  const { selectOrgAndProduct } = useOrgProduct();
  const { data: orgGroups, isLoading, isError, refetch } = useAllOrgProducts();

  if (isLoading) return <LoadingView message="Loading products…" />;
  if (isError)
    return (
      <ErrorView message="Failed to load products" onRetry={refetch} />
    );
  if (orgGroups.length === 0)
    return (
      <EmptyView
        title="No Products"
        message="You don't belong to any organizations with products."
      />
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Product</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {orgGroups.map((group) => (
          <View key={group.org} style={styles.orgSection}>
            <Text style={styles.orgName}>{group.org}</Text>
            {group.products.map((product) => (
              <TouchableOpacity
                key={`${group.org}:${product.name}`}
                style={styles.card}
                onPress={() => selectOrgAndProduct(group.org, product.name)}
              >
                <Text style={typography.subtitle}>{product.name}</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
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
  list: {
    paddingBottom: spacing.xl,
  },
  orgSection: {
    marginBottom: spacing.md,
  },
  orgName: {
    ...typography.caption,
    color: colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
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
    marginVertical: spacing.xs,
  },
  arrow: {
    ...typography.title,
    color: colors.textTertiary,
  },
});
