import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const STORAGE_KEYS = {
  INSTANCE_URL: "instanceUrl",
  ORG: "org",
  PRODUCT: "product",
} as const;

export function getString(key: string): string | undefined {
  return storage.getString(key);
}

export function setString(key: string, value: string): void {
  storage.set(key, value);
}

export function remove(key: string): void {
  storage.delete(key);
}
