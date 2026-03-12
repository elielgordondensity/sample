import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import type { StaticScreenProps } from "@react-navigation/native";

import { spacing } from "../../components/tokens";
import { useTheme } from "../../theme/ThemeProvider";
import { Typography } from "../../components/typography";
import { Button } from "../../components/button";
import { TextInput } from "../../components/text-input";
import { useExecuteDeviceCode } from "../../api/generated/devices/devices";
import { useOrgProduct } from "../../context/OrgProductContext";

type Props = StaticScreenProps<{ identifier: string }>;

interface ConsoleEntry {
  id: string;
  type: "input" | "output" | "error";
  text: string;
}

export default function DeviceConsoleScreen({ route }: Props) {
  const { identifier } = route.params;
  const { colors } = useTheme();
  const { orgId, productId } = useOrgProduct();
  const executeCode = useExecuteDeviceCode();
  const [code, setCode] = useState("");
  const [history, setHistory] = useState<ConsoleEntry[]>([]);

  const handleExecute = () => {
    const trimmed = code.trim();
    if (!trimmed || !orgId || !productId) return;

    const inputEntry: ConsoleEntry = {
      id: `${Date.now()}-in`,
      type: "input",
      text: trimmed,
    };
    setHistory((prev) => [...prev, inputEntry]);
    setCode("");

    executeCode.mutate(
      {
        orgName: orgId,
        productName: productId,
        identifier,
        data: { data: trimmed },
      },
      {
        onSuccess: (result) => {
          const outputEntry: ConsoleEntry = {
            id: `${Date.now()}-out`,
            type: "output",
            text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
          };
          setHistory((prev) => [...prev, outputEntry]);
        },
        onError: (error) => {
          const errorEntry: ConsoleEntry = {
            id: `${Date.now()}-err`,
            type: "error",
            text: error instanceof Error ? error.message : "Execution failed",
          };
          setHistory((prev) => [...prev, errorEntry]);
        },
      },
    );
  };

  const renderEntry = ({ item }: { item: ConsoleEntry }) => {
    const color =
      item.type === "input"
        ? colors.textSecondary
        : item.type === "error"
          ? "#E74C3C"
          : "#9ACD32";
    const prefix = item.type === "input" ? "> " : "";

    return (
      <View style={styles.entry}>
        <Typography
          type="body"
          fontType="mono"
          fontSize={13}
          color={color}
        >
          {prefix}{item.text}
        </Typography>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.list}
        style={styles.listContainer}
      />
      <View style={[styles.inputRow, { borderTopColor: colors.border }]}>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Enter Elixir code…"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          label="Run"
          type="primary"
          size="sm"
          onPress={handleExecute}
          disabled={!code.trim() || executeCode.isPending}
          isLoading={executeCode.isPending}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    paddingTop: 120,
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  entry: {
    paddingVertical: spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    paddingBottom: 106
  },
  input: {
    flex: 1,
  },
});
