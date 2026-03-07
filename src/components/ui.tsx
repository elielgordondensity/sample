import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "./tokens";

// ── Loading ──────────────────────────────────────────────────────

export function LoadingView({ message = "Loading…" }: { message?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={[typography.body, styles.loadingText]}>{message}</Text>
    </View>
  );
}

// ── Error ────────────────────────────────────────────────────────

export function ErrorView({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.center}>
      <Text style={[typography.subtitle, { color: colors.danger }]}>Error</Text>
      <Text style={[typography.body, styles.errorText]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={[typography.body, { color: colors.accent }]}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Empty ────────────────────────────────────────────────────────

export function EmptyView({
  title = "Nothing here",
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <View style={styles.center}>
      <Text style={typography.subtitle}>{title}</Text>
      {message && (
        <Text style={[typography.bodySmall, { marginTop: spacing.sm }]}>
          {message}
        </Text>
      )}
    </View>
  );
}

// ── Online Badge ─────────────────────────────────────────────────

export function OnlineBadge({ online }: { online: boolean }) {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: online ? colors.successSubtle : colors.dangerSubtle },
      ]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: online ? colors.success : colors.danger },
        ]}
      />
      <Text
        style={[
          typography.caption,
          { color: online ? colors.success : colors.danger },
        ]}
      >
        {online ? "Online" : "Offline"}
      </Text>
    </View>
  );
}

// ── Update Status Chip ───────────────────────────────────────────

export function UpdateStatusChip({ status }: { status: string | undefined }) {
  if (!status) return null;

  const chipColor =
    status === "up-to-date"
      ? colors.success
      : status === "updating"
        ? colors.warning
        : colors.textSecondary;

  return (
    <View style={[styles.chip, { borderColor: chipColor }]}>
      <Text style={[typography.caption, { color: chipColor }]}>{status}</Text>
    </View>
  );
}

// ── Tag Pill ─────────────────────────────────────────────────────

export function TagPill({ tag }: { tag: string }) {
  return (
    <View style={styles.pill}>
      <Text style={[typography.monoSmall, { color: colors.accent }]}>
        {tag}
      </Text>
    </View>
  );
}

// ── Card ─────────────────────────────────────────────────────────

export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

// ── Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  pill: {
    backgroundColor: colors.surfaceHover,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
});
