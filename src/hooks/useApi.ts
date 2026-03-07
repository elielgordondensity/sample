import { useQuery } from "@tanstack/react-query";
import { customInstance } from "../api/mutator/custom-instance";
import type {
  DeploymentGroupListResponse,
  DeviceListResponse,
  DeviceResponse,
  FirmwareListResponse,
  ProductListResponse,
  SigningKeyListResponse,
  UserResponse,
} from "../api/generated/schemas";
import { useAuth } from "../context/AuthContext";

/**
 * Thin wrappers around the Orval-generated types that enforce
 * the enabled guard (apiClient configured + org + product selected).
 *
 * These complement the generated hooks by providing a simpler API
 * that reads org/product from context automatically.
 */

function useAuthGuard() {
  const { token, org, product } = useAuth();
  return { org, product, enabled: !!token && !!org && !!product };
}

// ── User ─────────────────────────────────────────────────────────

export function useMe() {
  const { token } = useAuth();
  return useQuery<UserResponse>({
    queryKey: ["users", "me"],
    queryFn: ({ signal }) =>
      customInstance({ url: "/users/me", method: "GET", signal }),
    enabled: !!token,
    staleTime: 30_000,
  });
}

// ── Orgs (no product required) ───────────────────────────────────

export function useOrgs() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["orgs"],
    queryFn: ({ signal }) =>
      customInstance<{ data: { name: string }[] }>({
        url: "/orgs",
        method: "GET",
        signal,
      }),
    enabled: !!token,
    staleTime: 30_000,
  });
}

// ── Products (org required, no product required) ─────────────────

export function useProducts(org: string | null) {
  const { token } = useAuth();
  return useQuery<ProductListResponse>({
    queryKey: ["orgs", org, "products"],
    queryFn: ({ signal }) =>
      customInstance({
        url: `/orgs/${org}/products`,
        method: "GET",
        signal,
      }),
    enabled: !!token && !!org,
    staleTime: 30_000,
  });
}

// ── Devices ──────────────────────────────────────────────────────

export function useDevices(params?: {
  search?: string;
  page?: number;
  page_size?: number;
}) {
  const { org, product, enabled } = useAuthGuard();
  return useQuery<DeviceListResponse>({
    queryKey: ["orgs", org, "products", product, "devices", params],
    queryFn: ({ signal }) =>
      customInstance({
        url: `/orgs/${org}/products/${product}/devices`,
        method: "GET",
        params,
        signal,
      }),
    enabled,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useDevice(identifier: string) {
  const { org, product, enabled } = useAuthGuard();
  return useQuery<DeviceResponse>({
    queryKey: ["orgs", org, "products", product, "devices", identifier],
    queryFn: ({ signal }) =>
      customInstance({
        url: `/orgs/${org}/products/${product}/devices/${identifier}`,
        method: "GET",
        signal,
      }),
    enabled: enabled && !!identifier,
    staleTime: 30_000,
  });
}

// ── Firmware ─────────────────────────────────────────────────────

export function useFirmware() {
  const { org, product, enabled } = useAuthGuard();
  return useQuery<FirmwareListResponse>({
    queryKey: ["orgs", org, "products", product, "firmwares"],
    queryFn: ({ signal }) =>
      customInstance({
        url: `/orgs/${org}/products/${product}/firmwares`,
        method: "GET",
        signal,
      }),
    enabled,
    staleTime: 30_000,
  });
}

// ── Deployments ──────────────────────────────────────────────────

export function useDeployments() {
  const { org, product, enabled } = useAuthGuard();
  return useQuery<DeploymentGroupListResponse>({
    queryKey: ["orgs", org, "products", product, "deployments"],
    queryFn: ({ signal }) =>
      customInstance({
        url: `/orgs/${org}/products/${product}/deployments`,
        method: "GET",
        signal,
      }),
    enabled,
    staleTime: 30_000,
  });
}

// ── Signing Keys ─────────────────────────────────────────────────

export function useKeys() {
  const { org, enabled } = useAuthGuard();
  return useQuery<SigningKeyListResponse>({
    queryKey: ["orgs", org, "keys"],
    queryFn: ({ signal }) =>
      customInstance({
        url: `/orgs/${org}/keys`,
        method: "GET",
        signal,
      }),
    enabled,
    staleTime: 30_000,
  });
}
