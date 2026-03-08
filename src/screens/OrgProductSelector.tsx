import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { radius, spacing } from "../components/tokens";
import { useTheme } from "../context/ThemeContext";
import { Typography } from "../components/typography";
import { EmptyView, ErrorView, LoadingView } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useOrgProduct } from "../context/OrgProductContext";
import { useProducts } from "../hooks/useApi";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrgProductSelector() {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const { selectOrgAndProduct } = useOrgProduct();
  const [orgName, setOrgName] = useState("");
  const submittedOrg = orgName.trim() || null;
  const { data, isLoading, isError, refetch } = useProducts(submittedOrg);
  const products = data?.data ?? [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Typography type="header" fontSize={26} fontWeight="600" lineHeight={28} paddingBottom={spacing.md}>
          Select Product
        </Typography>
        <TouchableOpacity onPress={logout}>
          <Typography type="destructive" fontSize={14} color={colors.danger}>
            Logout
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.textPrimary,
            },
          ]}
          placeholder="Organization name"
          placeholderTextColor={colors.textTertiary}
          value={orgName}
          onChangeText={setOrgName}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {!submittedOrg ? (
        <EmptyView
          title="Enter Organization"
          message="Type your organization name above to see its products."
        />
      ) : isLoading ? (
        <LoadingView message="Loading products…" />
      ) : isError ? (
        <ErrorView message="Failed to load products" onRetry={refetch} />
      ) : products.length === 0 ? (
        <EmptyView
          title="No Products"
          message={`No products found for "${submittedOrg}".`}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          <Typography
            type="caption"
            fontSize={11}
            textTransform="uppercase"
            letterSpacing={1}
            paddingHorizontal={spacing.lg}
            paddingTop={spacing.md}
            paddingBottom={spacing.xs}
            color={colors.textTertiary}
          >
            {submittedOrg}
          </Typography>
          {products.map((product) => (
            <TouchableOpacity
              key={product.name}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => selectOrgAndProduct(submittedOrg, product.name)}
            >
              <Typography type="subheader" fontSize={20} fontWeight="600" lineHeight={28}>
                {product.name}
              </Typography>
              <Typography type="header" fontSize={26} color={colors.textTertiary}>
                ›
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  inputContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  input: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
});
