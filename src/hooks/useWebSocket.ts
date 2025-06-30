import { useEffect, useRef, useState } from "react";
import type { DataPoint } from "../types/DataPoint";

export const useWebSocket = (siteIds?: string[]): DataPoint[] => {
  const [data, setData] = useState<DataPoint[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const point: DataPoint = JSON.parse(event.data);
      setData((prev) => [...prev.slice(-999), point]);
    };

    ws.onerror = (e) => {
      console.error("WebSocket error", e);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Send filter message when `siteIds` change
  useEffect(() => {
    if (!siteIds) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "filter", siteIds })
      );
    } else {
      // Optionally wait and retry when socket isn't open yet
      const interval = setInterval(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({ type: "filter", siteIds })
          );
          clearInterval(interval);
        }
      }, 100);
    }
  }, [siteIds]);

  return data;
};
