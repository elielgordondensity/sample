import { useInfiniteQuery } from "@tanstack/react-query";
import { useGetMe } from "../api/generated/users/users";
import { useListProducts } from "../api/generated/products/products";
import {
  listDevices,
  getListDevicesQueryKey,
  useListDevices,
  useGetDevice,
} from "../api/generated/devices/devices";
import { useListFirmwares } from "../api/generated/firmwares/firmwares";
import { useListDeploymentGroups } from "../api/generated/deployment-groups/deployment-groups";
import { useListSigningKeys } from "../api/generated/signing-keys/signing-keys";
import { useAuth } from "../context/AuthContext";
import { useOrgProduct } from "../context/OrgProductContext";

/**
 * Thin wrappers around the Orval-generated hooks that inject
 * org/product from context and enforce auth guards.
 */

// ── Re-exports for manual hooks (no Orval equivalent) ────────────

export { useOrgs } from "./useOrgs";
export { useAllOrgProducts } from "./useAllOrgProducts";
export type { OrgWithProducts } from "./useAllOrgProducts";

// ── User ─────────────────────────────────────────────────────────

export function useMe() {
  const { token } = useAuth();
  return useGetMe({ query: { enabled: !!token, staleTime: 30_000 } });
}

// ── Products ─────────────────────────────────────────────────────

export function useProducts(org: string | null) {
  const { token } = useAuth();
  return useListProducts(org ?? "", {
    query: { enabled: !!token && !!org, staleTime: 30_000 },
  });
}

// ── Devices ──────────────────────────────────────────────────────

export function useDevices(params?: {
  search?: string;
  page?: number;
  page_size?: number;
}) {
  const { token } = useAuth();
  const { org, product } = useOrgProduct();
  return useListDevices(org ?? "", product ?? "", params, {
    query: {
      enabled: !!token && !!org && !!product,
      staleTime: 30_000,
      refetchInterval: 30_000,
    },
  });
}

const PAGE_SIZE = 25;

export function useInfiniteDevices(search?: string) {
  const { token } = useAuth();
  const { org, product } = useOrgProduct();

  return useInfiniteQuery({
    queryKey: getListDevicesQueryKey(
      org ?? "",
      product ?? "",
      search ? { search } : undefined,
    ),
    queryFn: ({ pageParam, signal }) =>
      listDevices(
        org ?? "",
        product ?? "",
        { search, page: pageParam, page_size: PAGE_SIZE },
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const p = lastPage.pagination;
      if (!p || !p.page_number || !p.total_pages) return undefined;
      return p.page_number < p.total_pages ? p.page_number + 1 : undefined;
    },
    enabled: !!token && !!org && !!product,
    staleTime: 30_000,
  });
}

export function useDevice(identifier: string) {
  const { token } = useAuth();
  const { org, product } = useOrgProduct();
  return useGetDevice(org ?? "", product ?? "", identifier, {
    query: {
      enabled: !!token && !!org && !!product && !!identifier,
      staleTime: 30_000,
    },
  });
}

// ── Firmware ─────────────────────────────────────────────────────

export function useFirmware() {
  const { token } = useAuth();
  const { org, product } = useOrgProduct();
  return useListFirmwares(org ?? "", product ?? "", {
    query: {
      enabled: !!token && !!org && !!product,
      staleTime: 30_000,
    },
  });
}

// ── Deployments ──────────────────────────────────────────────────

export function useDeployments() {
  const { token } = useAuth();
  const { org, product } = useOrgProduct();
  return useListDeploymentGroups(org ?? "", product ?? "", {
    query: {
      enabled: !!token && !!org && !!product,
      staleTime: 30_000,
    },
  });
}

// ── Signing Keys ─────────────────────────────────────────────────

export function useKeys() {
  const { token } = useAuth();
  const { org } = useOrgProduct();
  return useListSigningKeys(org ?? "", {
    query: {
      enabled: !!token && !!org,
      staleTime: 30_000,
    },
  });
}
