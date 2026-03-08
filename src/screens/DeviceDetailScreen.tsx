import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { radius, spacing } from "../components/tokens";
import { useTheme } from "../context/ThemeContext";
import { Typography } from "../components/typography";
import {
  ErrorView,
  LoadingView,
  OnlineBadge,
  UpdateStatusChip,
} from "../components/ui";
import { Tag } from "../components/tag";
import { useDevice } from "../hooks/useApi";
import type { StaticScreenProps } from "@react-navigation/native";

type Props = StaticScreenProps<{ identifier: string }>;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Typography
        type="caption"
        fontSize={11}
        textTransform="uppercase"
        letterSpacing={1}
        paddingBottom={spacing.xs}
        color={colors.textTertiary}
      >
        {title}
      </Typography>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value?: string | null }) {
  const { colors } = useTheme();
  if (!value) return null;
  return (
    <View style={styles.metaRow}>
      <Typography type="body" fontSize={12} color={colors.textTertiary}>
        {label}
      </Typography>
      <Typography type="body" fontSize={14} flexShrink={1}>
        {value}
      </Typography>
    </View>
  );
}

export default function DeviceDetailScreen({ route }: Props) {
  const { identifier } = route.params;
  const { colors } = useTheme();
  const { data, isLoading, isError, refetch } = useDevice(identifier);
  const device = data?.data;

  if (isLoading) return <LoadingView message="Loading device…" />;
  if (isError || !device)
    return (
      <ErrorView message="Failed to load device" onRetry={() => refetch()} />
    );

  const tags = Array.isArray(device.tags)
    ? device.tags
    : typeof device.tags === "string"
      ? device.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

  const fw = device.firmware_metadata;
  const dg = device.deployment_group;

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Typography type="header" fontSize={26} fontWeight="600" lineHeight={28}>
            {String(device.identifier)}
          </Typography>
          <OnlineBadge online={device.online ?? false} />
        </View>

        {device.description ? (
          <Typography type="body" fontSize={12} color={colors.textSecondary} marginBottom={spacing.md}>
            {device.description}
          </Typography>
        ) : null}

        <View style={styles.statusRow}>
          <UpdateStatusChip status={device.version} />
          {device.updates_enabled === false && (
            <View
              style={[
                styles.disabledChip,
                { backgroundColor: colors.dangerSubtle },
              ]}
            >
              <Typography type="caption" fontSize={11} color={colors.danger}>
                Updates disabled
              </Typography>
            </View>
          )}
        </View>

        {/* Firmware */}
        {fw && (
          <Section title="Firmware">
            <MetaRow label="Version" value={fw.firmware_version} />
            <MetaRow label="Name" value={fw.name} />
            <MetaRow label="UUID" value={fw.firmware_uuid} />
            <MetaRow
              label="Active"
              value={fw.is_active ? "Yes" : "No"}
            />
          </Section>
        )}

        {/* Deployment Group */}
        {dg && (
          <Section title="Deployment Group">
            <MetaRow label="Version" value={dg.version} />
            <MetaRow label="Platform" value={dg.platform} />
            <MetaRow label="Architecture" value={dg.architecture} />
            <MetaRow label="Author" value={dg.author} />
            {dg.vcs_identifier && (
              <MetaRow label="VCS" value={dg.vcs_identifier} />
            )}
          </Section>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <Section title="Tags">
            <View style={styles.tagsRow}>
              {tags.map((tag) => (
                <Tag key={tag} label={tag} size="sm" colorScheme="gray" />
              ))}
            </View>
          </Section>
        )}

        {/* Additional Info */}
        {device.updates_blocked_until && (
          <Section title="Penalty Box">
            <MetaRow
              label="Blocked until"
              value={device.updates_blocked_until}
            />
          </Section>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  disabledChip: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
});
