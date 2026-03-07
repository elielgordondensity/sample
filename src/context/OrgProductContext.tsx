import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getString, remove, setString, STORAGE_KEYS } from "../utils/storage";

interface OrgProductState {
  org: string | null;
  product: string | null;
}

interface OrgProductContextValue extends OrgProductState {
  selectOrgAndProduct: (org: string, product: string) => void;
  resetOrgAndProduct: () => void;
}

const OrgProductContext = createContext<OrgProductContextValue | null>(null);

export function OrgProductProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<OrgProductState>({
    org: null,
    product: null,
  });

  // Rehydrate from MMKV on mount
  useEffect(() => {
    const org = getString(STORAGE_KEYS.ORG) ?? null;
    const product = getString(STORAGE_KEYS.PRODUCT) ?? null;
    setState({ org, product });
  }, []);

  const selectOrgAndProduct = useCallback((org: string, product: string) => {
    setString(STORAGE_KEYS.ORG, org);
    setString(STORAGE_KEYS.PRODUCT, product);
    setState({ org, product });
  }, []);

  const resetOrgAndProduct = useCallback(() => {
    remove(STORAGE_KEYS.ORG);
    remove(STORAGE_KEYS.PRODUCT);
    setState({ org: null, product: null });
  }, []);

  const value = useMemo<OrgProductContextValue>(
    () => ({ ...state, selectOrgAndProduct, resetOrgAndProduct }),
    [state, selectOrgAndProduct, resetOrgAndProduct],
  );

  return (
    <OrgProductContext.Provider value={value}>
      {children}
    </OrgProductContext.Provider>
  );
}

export function useOrgProduct(): OrgProductContextValue {
  const ctx = useContext(OrgProductContext);
  if (!ctx)
    throw new Error("useOrgProduct must be used within OrgProductProvider");
  return ctx;
}

// Boolean hooks for React Navigation static `if` directives
export function useHasOrgProduct() {
  const { org, product } = useOrgProduct();
  return !!org && !!product;
}

export function useNeedsOrgProduct() {
  const { org, product } = useOrgProduct();
  return !org || !product;
}
