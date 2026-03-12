import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { spacing } from "../../components/tokens";
import { useTheme } from "../../theme/ThemeProvider";
import { Typography } from "../../components/typography";
import { Card, LoadingView } from "../../components/ui";
import { Tag } from "../../components/tag";
import { Dropdown, type DropDownItem } from "../../components/dropdown";
import CheckCircleIcon from "../../../assets/icons/check-circle.svg";
import { useDeployments } from "../../hooks/useApi";
import { useUpdateDevice } from "../../api/generated/devices/devices";
import { useOrgProduct } from "../../context/OrgProductContext";
import type { DeploymentGroup } from "../../api/generated/schemas";
import { Button } from "../../components/button";

interface DeploymentGroupCardProps {
  currentDeploymentGroupId?: string | null;
  deviceIdentifier: string;
}

function MetaRow({ label, value }: { label: string; value?: string | null }) {
  const { colors } = useTheme();
  if (!value) return null;
  return (
    <View style={styles.metaRow}>
      <Typography type="caption" fontSize={12} color={colors.textTertiary}>
        {label}
      </Typography>
      <Typography
        type="body"
        fontType="mono"
        fontSize={13}
        fontWeight="500"
        flexShrink={1}
        textAlign="right"
        color={colors.textPrimary}
      >
        {value}
      </Typography>
    </View>
  );
}

export function DeploymentGroupCard({ currentDeploymentGroupId, deviceIdentifier }: DeploymentGroupCardProps) {
  const { colors } = useTheme();
  const { orgId, productId } = useOrgProduct();
  const { data, isLoading } = useDeployments();
  const updateDevice = useUpdateDevice();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const deploymentGroups = data?.data ?? [];
  const current = deploymentGroups.find((dg) => dg.name === currentDeploymentGroupId);

  if (isLoading) {
    return <LoadingView message="Loading deployments…" />;
  }

  if (!current) return null;

  const isActive = current.is_active ?? current.state === "on";

  const dropdownItems: DropDownItem<DeploymentGroup>[] = deploymentGroups.map((dg) => ({
    id: String(dg.id),
    label: dg.name ?? "Unnamed",
    value: dg,
  }));

  return (
    <View style={styles.section}>
      <Typography
        type="caption"
        fontSize={11}
        textTransform="uppercase"
        letterSpacing={1}
        paddingBottom={spacing.xs}
        paddingHorizontal={spacing.lg}
        color={colors.textTertiary}
      >
        Deployment
      </Typography>
      <Card>
        <View style={styles.headerRow}>
          <Typography
            type="body"
            fontSize={15}
            fontWeight="600"
            color={colors.textPrimary}
            flexShrink={1}
          >
            {current.name}
          </Typography>
          <Tag
            label={isActive ? "Active" : "Inactive"}
            size="sm"
            colorScheme="white"
            hasBorder
            iconLeft={{
              component: CheckCircleIcon,
              props: {
                width: 14,
                height: 14,
                color: isActive ? "#9ACD32" : "#E0E3E6",
              },
            }}
          />
        </View>
        <MetaRow label="Version" value={current.firmware?.version} />
        <MetaRow label="Platform" value={current.conditions?.tags?.join(", ")} />
        <MetaRow label="Device count" value={String(current.device_count ?? 0)} />
        {dropdownItems.length > 1 && (
          <View style={styles.dropdownRow}>
            <Dropdown
              items={dropdownItems}
              defaultSelectedItemId={String(current.id)}
              size="sm"
              placeholderLabel="Switch deployment"
              fullWidth
              fullItemsWidth
              onSelect={(item) => setSelectedGroupId(item.value?.id ?? null)}
            />
            <Button
              label="Assign"
              size="sm"
              type="tertiary"
              disabled={!selectedGroupId || String(selectedGroupId) === currentDeploymentGroupId || updateDevice.isPending}
              isLoading={updateDevice.isPending}
              onPress={() => {
                if (!selectedGroupId || !orgId || !productId) return;
                updateDevice.mutate(
                  {
                    orgName: orgId,
                    productName: productId,
                    identifier: deviceIdentifier,
                    data: { device: { deployment_group_id: selectedGroupId } },
                  },
                  {
                    onSuccess: () => Alert.alert("Success", "Deployment group updated."),
                    onError: () => Alert.alert("Error", "Failed to update deployment group."),
                  },
                );
              }}
            />
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  dropdownRow: {
    flexDirection: "row",
    marginTop: spacing.sm,
    gap: 6
  },
});
