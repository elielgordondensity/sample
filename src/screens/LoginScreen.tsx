import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "../components/tokens";
import { LoadingView } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { customInstance } from "../api/mutator/custom-instance";
import { configureAxios } from "../api/mutator/custom-instance";
import type { UserResponse } from "../api/generated/schemas";

export default function LoginScreen() {
  const { login } = useAuth();
  const [instanceUrl, setInstanceUrl] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedUrl = instanceUrl.trim().replace(/\/+$/, "");
    const trimmedToken = token.trim();

    if (!trimmedUrl || !trimmedToken) {
      Alert.alert("Error", "Please enter both instance URL and API token.");
      return;
    }

    setLoading(true);
    try {
      // Temporarily configure axios to validate
      configureAxios(trimmedUrl, trimmedToken);
      const response = await customInstance<UserResponse>({
        url: "/users/me",
        method: "GET",
      });

      if (!response?.data) {
        throw new Error("Invalid response");
      }

      await login(trimmedUrl, trimmedToken);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not authenticate";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingView message="Validating credentials…" />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>NervesHub</Text>
        <Text style={styles.subtitle}>Sign in to your instance</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Instance URL</Text>
          <TextInput
            style={styles.input}
            value={instanceUrl}
            onChangeText={setInstanceUrl}
            placeholder="https://manage.nervescloud.com"
            placeholderTextColor={colors.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>API Token</Text>
          <TextInput
            style={styles.input}
            value={token}
            onChangeText={setToken}
            placeholder="nhu_xxxxx"
            placeholderTextColor={colors.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.title,
    fontSize: 32,
    textAlign: "center",
    color: colors.accent,
  },
  subtitle: {
    ...typography.bodySmall,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodySmall,
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonText: {
    ...typography.subtitle,
    color: colors.white,
  },
});
