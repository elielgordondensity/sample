import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import {
  configureAxios,
  customInstance,
  resetAxios,
} from "../api/mutator/custom-instance";
import { deleteToken, getToken, setToken } from "../utils/secureStorage";
import {
  getString,
  remove,
  setString,
  STORAGE_KEYS,
} from "../utils/storage";
import type { AuthResponse, UserResponse } from "../api/generated/schemas";

interface AuthState {
  isLoading: boolean;
  instanceUrl: string | null;
  token: string | null;
  org: string | null;
  product: string | null;
}

interface AuthContextValue extends AuthState {
  login: (instanceUrl: string, token: string) => Promise<void>;
  loginWithCredentials: (
    instanceUrl: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  selectOrgAndProduct: (org: string, product: string) => void;
  resetOrgAndProduct: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    instanceUrl: null,
    token: null,
    org: null,
    product: null,
  });

  // Rehydrate on boot
  useEffect(() => {
    (async () => {
      const token = await getToken();
      const instanceUrl = getString(STORAGE_KEYS.INSTANCE_URL) ?? null;
      const org = getString(STORAGE_KEYS.ORG) ?? null;
      const product = getString(STORAGE_KEYS.PRODUCT) ?? null;

      if (token && instanceUrl) {
        configureAxios(instanceUrl, token);
      }

      setState({ isLoading: false, instanceUrl, token, org, product });
    })();
  }, []);

  // Reconfigure axios whenever auth changes
  useMemo(() => {
    if (state.instanceUrl && state.token) {
      configureAxios(state.instanceUrl, state.token);
    }
  }, [state.instanceUrl, state.token]);

  const login = useCallback(async (instanceUrl: string, token: string) => {
    await setToken(token);
    setString(STORAGE_KEYS.INSTANCE_URL, instanceUrl);
    configureAxios(instanceUrl, token);
    setState((prev) => ({ ...prev, instanceUrl, token, org: null, product: null }));
  }, []);

  const loginWithCredentials = useCallback(
    async (instanceUrl: string, email: string, password: string) => {
      // Authenticate with email/password to obtain a token
      const authResponse = await axios.post<AuthResponse>(
        `${instanceUrl}/api/users/auth`,
        { email, password },
      );

      const authToken = authResponse.data?.data?.token;
      if (!authToken) {
        throw new Error("No token received");
      }

      // Validate the token by fetching the current user
      configureAxios(instanceUrl, authToken);
      const userResponse = await customInstance<UserResponse>({
        url: "/users/me",
        method: "GET",
      });

      if (!userResponse?.data) {
        throw new Error("Invalid response");
      }

      await login(instanceUrl, authToken);
    },
    [login],
  );

  const logout = useCallback(async () => {
    await deleteToken();
    remove(STORAGE_KEYS.INSTANCE_URL);
    remove(STORAGE_KEYS.ORG);
    remove(STORAGE_KEYS.PRODUCT);
    resetAxios();
    setState({
      isLoading: false,
      instanceUrl: null,
      token: null,
      org: null,
      product: null,
    });
  }, []);

  const selectOrgAndProduct = useCallback((org: string, product: string) => {
    setString(STORAGE_KEYS.ORG, org);
    setString(STORAGE_KEYS.PRODUCT, product);
    setState((prev) => ({ ...prev, org, product }));
  }, []);

  const resetOrgAndProduct = useCallback(() => {
    remove(STORAGE_KEYS.ORG);
    remove(STORAGE_KEYS.PRODUCT);
    setState((prev) => ({ ...prev, org: null, product: null }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      loginWithCredentials,
      logout,
      selectOrgAndProduct,
      resetOrgAndProduct,
    }),
    [state, login, loginWithCredentials, logout, selectOrgAndProduct, resetOrgAndProduct],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
