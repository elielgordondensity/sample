import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Channel, Socket } from "phoenix";
import type { Device, DeviceListResponse } from "../api/generated/schemas";
import { useAuth } from "../context/AuthContext";
import { useOrgProduct } from "../context/OrgProductContext";

/**
 * Connects a Phoenix WebSocket to `product:{org}:{product}` and patches
 * the React Query device list cache on presence_diff and update events.
 */
export function useDeviceChannel() {
  const { instanceUrl, token } = useAuth();
  const { org, product } = useOrgProduct();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    if (!instanceUrl || !token || !org || !product) return;

    const wsUrl = instanceUrl.replace(/^https?/, "wss");
    const socket = new Socket(`${wsUrl}/socket`, {
      params: { token },
    });
    socket.connect();
    socketRef.current = socket;

    const topic = `product:${org}:${product}`;
    const channel = socket.channel(topic, {});
    channelRef.current = channel;

    channel.join();

    // ── Presence diff: toggle online status ───────────────────────
    channel.on("presence_diff", (diff) => {
      const queryKey = ["orgs", org, "products", product, "devices"];

      queryClient.setQueriesData<DeviceListResponse>(
        { queryKey },
        (old) => {
          if (!old?.data) return old;

          const joinsSet = new Set(Object.keys(diff.joins ?? {}));
          const leavesSet = new Set(Object.keys(diff.leaves ?? {}));

          const updated = old.data.map((device: Device) => {
            const id = String(device.identifier);
            if (joinsSet.has(id)) return { ...device, online: true };
            if (leavesSet.has(id)) return { ...device, online: false };
            return device;
          });

          return { ...old, data: updated };
        },
      );
    });

    // ── Update event: patch firmware_update_status ────────────────
    channel.on("update", (payload) => {
      const queryKey = ["orgs", org, "products", product, "devices"];

      queryClient.setQueriesData<DeviceListResponse>(
        { queryKey },
        (old) => {
          if (!old?.data) return old;

          const updated = old.data.map((device: Device) => {
            if (String(device.identifier) === String(payload.identifier)) {
              return { ...device, ...payload };
            }
            return device;
          });

          return { ...old, data: updated };
        },
      );
    });

    return () => {
      channel.leave();
      socket.disconnect();
      socketRef.current = null;
      channelRef.current = null;
    };
  }, [instanceUrl, token, org, product, queryClient]);
}
