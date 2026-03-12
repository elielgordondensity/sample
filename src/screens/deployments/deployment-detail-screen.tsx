import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { spacing } from "../../components/tokens";
import { useTheme } from "../../theme/ThemeProvider";
import { Typography } from "../../components/typography";
import { Card } from "../../components/ui";
import { Tag } from "../../components/tag";
import type { StaticScreenProps } from "@react-navigation/native";
import type { DeploymentGroup } from "../../api/generated/schemas";

import CheckCircleIcon from "../../../assets/icons/check-circle.svg";

type Props = StaticScreenProps<{ deployment: DeploymentGroup }>;

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

export default function DeploymentDetailScreen({ route }: Props) {
  const dg = route.params.deployment;
  const { colors } = useTheme();
  const isActive = dg.is_active ?? dg.state === "on";
  const tags = dg.conditions?.tags ?? [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography
            type="header"
            fontSize={26}
            fontWeight="600"
            lineHeight={28}
            flexShrink={1}
          >
            {dg.name}
          </Typography>
          <Tag
            label={isActive ? "Active" : "Inactive"}
            colorScheme="white"
            hasBorder
            hasShadow
            size="sm"
            adjustIconPadding
            iconLeft={{
              component: CheckCircleIcon,
              props: {
                width: 16,
                height: 16,
                color: isActive ? "#9ACD32" : "#E0E3E6",
              },
            }}
          />
        </View>

        {dg.firmware && (
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
              Firmware
            </Typography>
            <Card>
              <MetaRow
                label="Version"
                value={dg.firmware.version ? `v${dg.firmware.version}` : null}
              />
              <MetaRow label="Platform" value={dg.firmware.platform} />
              <MetaRow label="Architecture" value={dg.firmware.architecture} />
              <MetaRow label="Author" value={dg.firmware.author} />
              <MetaRow label="UUID" value={dg.firmware.uuid} />
              <MetaRow label="FWUP Version" value={dg.firmware.fwup_version} />
              <MetaRow label="VCS" value={dg.firmware.vcs_identifier} />
              <MetaRow
                label="Signed"
                value={dg.firmware.signed ? "Yes" : "No"}
              />
            </Card>
          </View>
        )}

        {(dg.conditions?.version || tags.length > 0) && (
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
              Conditions
            </Typography>
            <Card>
              <MetaRow label="Version" value={dg.conditions?.version} />
              {tags.length > 0 && (
                <View style={styles.tagsMetaRow}>
                  <Typography
                    type="caption"
                    fontSize={12}
                    color={colors.textTertiary}
                  >
                    Tags
                  </Typography>
                  <View style={styles.tagsWrap}>
                    {tags.map((tag) => (
                      <Tag
                        key={tag}
                        label={`#${tag}`}
                        size="sm"
                        colorScheme="white"
                        hasBorder
                      />
                    ))}
                  </View>
                </View>
              )}
            </Card>
          </View>
        )}

        <View style={styles.section}>
          <Typography
            type="caption"
            fontSize={11}
            textTransform="uppercase"
            letterSpacing={1}
            paddingBottom={spacing.xs}
            color={colors.textTertiary}
          >
            Info
          </Typography>
          <Card>
            {dg.device_count != null && (
              <MetaRow label="Devices" value={`${dg.device_count}`} />
            )}
            <MetaRow label="State" value={dg.state} />
            <MetaRow
              label="Created"
              value={
                dg.inserted_at
                  ? new Date(dg.inserted_at).toLocaleString()
                  : null
              }
            />
            <MetaRow
              label="Updated"
              value={
                dg.updated_at ? new Date(dg.updated_at).toLocaleString() : null
              }
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 120,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  section: {
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  tagsMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: spacing.xs,
    flexShrink: 1,
  },
});
