import { useCallback, useEffect, useRef, useState } from "react";
import { Channel, Socket } from "phoenix";
import { useAuth } from "../context/AuthContext";
import { useCreateConsoleToken } from "../api/generated/users/users";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface ConsoleChannelOptions {
  deviceId: string | number;
  onOutput?: (data: string) => void;
  onMetadata?: (metadata: Record<string, unknown>) => void;
}

export function useConsoleChannel({
  deviceId,
  onOutput,
  onMetadata,
}: ConsoleChannelOptions) {
  const { instanceUrl } = useAuth();
  const { mutateAsync: fetchConsoleToken } = useCreateConsoleToken();
  const socketRef = useRef<Socket | null>(null);
  const channelRef = useRef<Channel | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const onOutputRef = useRef(onOutput);
  onOutputRef.current = onOutput;
  const onMetadataRef = useRef(onMetadata);
  onMetadataRef.current = onMetadata;

  useEffect(() => {
    if (!instanceUrl || !deviceId) return;

    let cancelled = false;

    async function init() {
      setStatus("connecting");

      try {
        const res = await fetchConsoleToken();
        if (cancelled) return;

        const consoleToken = res.data?.token;
        if (!consoleToken) {
          console.warn("[console] No token in response", res);
          setStatus("error");
          return;
        }

        const wsUrl = instanceUrl!.replace(/^http/, "ws");
        const socket = new Socket(`${wsUrl}/socket`, {
          params: { token: consoleToken },
        });

        socket.onError((error) => {
          console.warn("[console] Socket error", error);
          if (!cancelled) setStatus("error");
        });
        socket.onClose(() => {
          if (!cancelled && channelRef.current) setStatus("disconnected");
        });

        socket.connect();
        socketRef.current = socket;

        const topic = `user:console:${deviceId}`;
        const channel = socket.channel(topic, {});
        channelRef.current = channel;

        channel
          .join()
          .receive("ok", () => {
            if (!cancelled) setStatus("connected");
          })
          .receive("error", (reason) => {
            console.warn("[console] Channel join error", reason);
            if (!cancelled) setStatus("error");
          })
          .receive("timeout", () => {
            console.warn("[console] Channel join timeout");
            if (!cancelled) setStatus("error");
          });

        channel.on("up", (payload: { data: string }) => {
          onOutputRef.current?.(payload.data);
        });

        channel.on("metadata", (payload: Record<string, unknown>) => {
          onMetadataRef.current?.(payload);
        });
      } catch (err) {
        console.warn("[console] Token fetch failed", err);
        if (!cancelled) setStatus("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      channelRef.current?.leave();
      socketRef.current?.disconnect();
      channelRef.current = null;
      socketRef.current = null;
    };
  }, [instanceUrl, deviceId, fetchConsoleToken]);

  const sendInput = useCallback((data: string) => {
    channelRef.current?.push("dn", { data });
  }, []);

  const sendWindowSize = useCallback((height: number, width: number) => {
    channelRef.current?.push("window_size", { height, width });
  }, []);

  return {
    status,
    sendInput,
    sendWindowSize,
  };
}
