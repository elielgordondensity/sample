import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { radius, spacing } from "../components/tokens";
import { useTheme } from "../context/ThemeContext";
import { Typography } from "../components/typography";
import { LoadingView } from "../components/ui";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { colors } = useTheme();
  const { loginWithCredentials } = useAuth();
  const [instanceUrl, setInstanceUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedUrl = instanceUrl.trim().replace(/\/+$/, "");
    const trimmedEmail = email.trim();

    if (!trimmedUrl || !trimmedEmail || !password) {
      Alert.alert(
        "Error",
        "Please enter instance URL, email, and password.",
      );
      return;
    }

    setLoading(true);
    try {
      await loginWithCredentials(trimmedUrl, trimmedEmail, password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not authenticate";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingView message="Validating credentials…" />;

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.textPrimary,
    },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Typography type="header" fontSize={32} textAlign="center" color={colors.accent}>
          NervesHub
        </Typography>
        <Typography type="body" fontSize={12} textAlign="center" marginTop={spacing.sm} marginBottom={spacing.xxl} color={colors.textSecondary}>
          Sign in to your instance
        </Typography>

        <View style={styles.field}>
          <Typography type="body" fontSize={12} marginBottom={spacing.xs} color={colors.textSecondary}>
            Instance URL
          </Typography>
          <TextInput
            style={inputStyle}
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
          <Typography type="body" fontSize={12} marginBottom={spacing.xs} color={colors.textSecondary}>
            Email
          </Typography>
          <TextInput
            style={inputStyle}
            value={email}
            onChangeText={setEmail}
            placeholder="user@example.com"
            placeholderTextColor={colors.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.field}>
          <Typography type="body" fontSize={12} marginBottom={spacing.xs} color={colors.textSecondary}>
            Password
          </Typography>
          <TextInput
            style={inputStyle}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={handleLogin}
        >
          <Typography type="subheader" fontSize={20} fontWeight="600" color={colors.white}>
            Sign In
          </Typography>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 16,
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.lg,
  },
});
